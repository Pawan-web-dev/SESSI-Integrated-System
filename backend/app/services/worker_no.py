"""ESSI worker number (Social Security Number of an insured worker).

    W-YY-DDD-NNNNNN-C         e.g. W-26-102-004573-6
    W       marks a worker number (an EIN is 102-93-000001, a CNIC 42101-1234567-1)
    YY      year the worker was first registered (26 = 2026)
    DDD     Directorate where the worker was first registered
    NNNNNN  serial, counted separately per year + Directorate
    C       Luhn check digit of the 11 digits before it: a mistyped number is caught at once

    Family members: the worker's number plus /01, /02 … (W-26-102-004573-6/01).

Rules:
  * one number per person for life: the worker is found by CNIC, so changing employer keeps the number;
  * issued once, never changed and never re-issued (the serial comes from worker_sequences under a row lock);
  * YY and DDD record the first registration and do not change when the worker moves.
"""
import re
from dataclasses import dataclass
from datetime import date

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Employee, EmployeeDependent, Employer, Worker, WorkerSequence
from app.services.errors import ServiceError

WORKER_NO_PATTERN = re.compile(r'^W-(\d{2})-(\d{3})-(\d{6})-(\d)$')


def luhn_digit(digits: str) -> int:
    """The Luhn check digit for `digits`: double every second digit from the right, add everything up, round up to 10."""
    total = 0
    for i, ch in enumerate(reversed(digits)):
        d = int(ch)
        if i % 2 == 0:  # the right-most digit and every second one before it
            d *= 2
            if d > 9:
                d -= 9  # same as adding the two digits (14 -> 1 + 4)
        total += d
    return (10 - total % 10) % 10


@dataclass(frozen=True)
class WorkerNoParts:
    year: int
    directorate: str
    serial: int


def format_worker_no(p: WorkerNoParts) -> str:
    body = f'{p.year:02d}{p.directorate}{p.serial:06d}'
    return f'W-{p.year:02d}-{p.directorate}-{p.serial:06d}-{luhn_digit(body)}'


def parse_worker_no(value: str | None) -> WorkerNoParts | None:
    """The parts of a well-formed worker number whose check digit is right; None for anything else (e.g. a typo)."""
    raw = (value or '').strip().upper().split('/')[0]
    m = WORKER_NO_PATTERN.match(raw)
    if not m:
        return None
    year, directorate, serial, check = m.groups()
    if luhn_digit(year + directorate + serial) != int(check):
        return None
    return WorkerNoParts(int(year), directorate, int(serial))


def is_valid_worker_no(value: str | None) -> bool:
    return parse_worker_no(value) is not None


def _next_serial(db: Session, directorate: str, year: int) -> int:
    stmt = select(WorkerSequence).where(WorkerSequence.directorate_code == directorate, WorkerSequence.year == year).with_for_update()
    seq = db.scalars(stmt).first()  # the row lock (PostgreSQL) stops two officers getting the same serial; SQLite ignores it
    if seq is None:
        seq = WorkerSequence(directorate_code=directorate, year=year, last_serial=0)
        db.add(seq)
    serial = seq.last_serial + 1
    while db.scalar(select(func.count()).select_from(Worker).where(Worker.worker_no == format_worker_no(WorkerNoParts(year, directorate, serial)))):
        serial += 1  # never re-use a number, even one created some other way
    seq.last_serial = serial
    return serial


def issue_worker(db: Session, cnic: str, directorate: str, issued_by: str, today: date | None = None) -> Worker:
    """The worker with this CNIC; a new worker with a new number when the person was never registered before."""
    found = db.scalars(select(Worker).where(Worker.cnic == cnic)).first()
    if found:
        return found
    year = (today or date.today()).year % 100
    serial = _next_serial(db, directorate, year)
    worker = Worker(worker_no=format_worker_no(WorkerNoParts(year, directorate, serial)), cnic=cnic, directorate_code=directorate,
                    issued_year=year, serial=serial, issued_by=issued_by, last_member_no=0)
    db.add(worker)
    db.flush()
    return worker


def link_employee(db: Session, employer: Employer, emp: Employee, issued_by: str) -> None:
    """Give the employment its worker (and the worker its number). Also called after the employee's CNIC is edited."""
    if emp.worker and emp.worker.cnic == emp.cnic:
        return
    if not employer.directorate_code:
        raise ServiceError('The establishment has no Directorate, so a worker number cannot be issued.')
    old = emp.worker
    others = [e for e in old.employments if e is not emp] if old else []
    taken = db.scalars(select(Worker).where(Worker.cnic == emp.cnic)).first()
    if old and not others and taken is None:
        # the CNIC was mistyped and is now corrected: the same person keeps the same number
        old.cnic = emp.cnic
        return
    emp.worker = taken or issue_worker(db, emp.cnic, employer.directorate_code, issued_by)
    if old is not emp.worker:
        for d in emp.dependents:
            d.member_no = None  # numbered again under the new worker below
    db.flush()


def _norm(text: str | None) -> str:
    return ''.join(ch for ch in (text or '').lower() if ch.isalnum())


def number_dependents(db: Session, emp: Employee) -> None:
    """Give every family member of the employment a /NN suffix. Each row of one employment gets its own suffix; a family
    member already saved under another employer of the same worker (see _same_person) keeps theirs; anyone new gets
    the next free one."""
    worker = emp.worker
    if worker is None:
        return
    # two rows of the same employment are always two different people: each keeps its own suffix
    taken: set[int] = set()
    for d in sorted(emp.dependents, key=lambda x: x.id or 0):
        if d.member_no in taken:
            d.member_no = None  # repairs suffixes that were shared by mistake
        elif d.member_no:
            taken.add(d.member_no)
    # family members saved under the worker's other employments (another employer)
    elsewhere = [k for k in db.scalars(select(EmployeeDependent).join(Employee).where(
        Employee.worker_id == worker.id, Employee.id != emp.id, EmployeeDependent.member_no.is_not(None)))]
    for d in emp.dependents:
        if d.member_no:
            continue
        same = next((k for k in elsewhere if k.member_no not in taken and _same_person(k, d)), None)
        if same:
            d.member_no = same.member_no
        else:
            worker.last_member_no = (worker.last_member_no or 0) + 1
            d.member_no = worker.last_member_no
        taken.add(d.member_no)
    db.flush()


def _same_person(a: EmployeeDependent, b: EmployeeDependent) -> bool:
    """Same family member: two of name, CNIC and relationship agree. A CNIC alone is not enough: a misread or
    placeholder CNIC can appear on several rows (e.g. the wife's CNIC typed for a daughter too)."""
    name = _norm(a.name) == _norm(b.name)
    cnic = bool(_norm(a.cnic)) and _norm(a.cnic) == _norm(b.cnic)
    relation = _norm(a.relation) == _norm(b.relation)
    return (name and (cnic or relation)) or (cnic and relation)
