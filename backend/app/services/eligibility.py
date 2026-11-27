"""Eligibility check for pharmacies and hospitals (HMIS): who is this person, and are they covered by ESSI today?

The person is found by any of:
    worker number      W-26-102-004573-6  or  261020045736
    family member      W-26-102-004573-6/02, W-26-102-004573-6-02  or  26102004573602
    CNIC               42101-5550001-1  or  4210155500011

Covered ("eligible") means the worker has at least one Active employment with an approved establishment; a family
member is covered when their worker is. Only what a counter needs is returned: no wages, bank details or full CNIC.
"""
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models import Challan, Contribution, ContributionLine, Employee, EmployeeDependent, Employer, Worker
from app.models.employer import APPROVED
from app.services.errors import NotFound, ServiceError
from app.services.notify import audit
from app.services.worker_no import format_worker_no, member_worker_no, parse_any, to_digits


def _digits(text: str | None) -> str:
    return ''.join(ch for ch in (text or '') if ch.isdigit())


def mask_cnic(cnic: str | None) -> str | None:
    """42101-5550001-1 -> *****-***0001-1 (enough to compare with the card, not enough to copy)."""
    d = _digits(cnic)
    if len(d) != 13:
        return None
    return f'*****-***{d[8:12]}-{d[12]}'


def _find(db: Session, value: str) -> tuple[Worker, int | None]:
    """(worker, family member number or None) for a worker number, a family member's number or a CNIC."""
    found = parse_any(value)
    if found:
        parts, member = found
        worker = db.scalars(select(Worker).where(Worker.worker_no == format_worker_no(parts))).first()
        if not worker:
            raise NotFound('No worker has this number.')
        return worker, member

    digits = _digits(value)
    if len(digits) == 13:
        worker = db.scalars(select(Worker).where(func.replace(Worker.cnic, '-', '') == digits)).first()
        if worker:
            return worker, None
        rows = db.execute(select(Employee.worker_id, EmployeeDependent.member_no).join(Employee)
                          .where(func.replace(EmployeeDependent.cnic, '-', '') == digits,
                                 Employee.worker_id.is_not(None), EmployeeDependent.member_no.is_not(None))).all()
        people = {(w, m) for w, m in rows}
        if len(people) > 1:
            raise ServiceError('More than one family member is recorded with this CNIC. Search with the worker number instead.', 409)
        if people:
            worker_id, member = people.pop()
            return db.get(Worker, worker_id), member
        raise NotFound('No worker or family member is registered with this CNIC.')

    if value.strip().upper().startswith('W') or len(digits) in (12, 14):
        raise ServiceError('This worker number has a typing mistake: the last digit (check digit) does not match. Please check the number.')
    raise ServiceError('Enter a worker number (W-26-102-004573-6 or 261020045736) or a 13-digit CNIC.')


def _last_paid_month(db: Session, employee_ids: list[int]) -> str | None:
    if not employee_ids:
        return None
    month = db.scalar(select(func.max(Contribution.month))
                      .join(ContributionLine, ContributionLine.contribution_id == Contribution.id)
                      .join(Challan, Challan.contribution_id == Contribution.id)
                      .where(ContributionLine.employee_id.in_(employee_ids), Challan.status == 'paid'))
    return month.strftime('%Y-%m') if month else None


def _family(employments: list[Employee]) -> list[dict]:
    """Each family member once (the same person can be saved under several employers), in suffix order."""
    seen: dict[int, dict] = {}
    for e in employments:
        for d in e.dependents:
            if d.member_no and d.member_no not in seen:
                seen[d.member_no] = {'id': d.worker_no, 'id_digits': d.worker_no_digits, 'name': d.name, 'relation': d.relation,
                                     'date_of_birth': d.date_of_birth}
    return [seen[k] for k in sorted(seen)]


def check(db: Session, value: str, actor: str) -> dict:
    """The eligibility answer for one person. Every lookup is written to the audit trail."""
    worker, member = _find(db, value)
    employments = sorted(worker.employments, key=lambda e: e.id, reverse=True)
    if not employments:
        raise NotFound('No worker has this number.')
    employers = {e.employer_id: db.get(Employer, e.employer_id) for e in employments}
    active = [e for e in employments if e.status == 'Active' and employers[e.employer_id].status == APPROVED]
    latest = (active or employments)[0]

    if active:
        eligible, reason = True, 'Covered: currently employed with a registered establishment.'
    else:
        eligible, reason = False, f'Not covered: the worker is not currently employed with a registered establishment (last status: {latest.status}).'

    out: dict = {
        'worker_no': worker.worker_no, 'worker_no_digits': to_digits(worker.worker_no),
        'worker_name': latest.full_name, 'eligible': eligible, 'reason': reason,
        'employers': [{'name': employers[e.employer_id].name, 'ein': employers[e.employer_id].ein, 'since': e.date_joined} for e in active],
        'last_paid_month': _last_paid_month(db, [e.id for e in employments]),
    }
    if member is None:
        out.update({'id': worker.worker_no, 'id_digits': out['worker_no_digits'], 'person': 'worker', 'relation': 'Self',
                    'name': latest.full_name, 'father_name': latest.father_name, 'gender': latest.gender,
                    'date_of_birth': latest.date_of_birth, 'cnic_masked': mask_cnic(worker.cnic), 'photo': latest.photo,
                    'family': _family(employments)})
    else:
        dep = next((d for e in employments for d in e.dependents if d.member_no == member), None)
        if dep is None:
            raise NotFound('This worker has no family member with this number.')
        no = member_worker_no(worker.worker_no, member)
        out.update({'id': no, 'id_digits': to_digits(no), 'person': 'family member', 'relation': dep.relation,
                    'name': dep.name, 'father_name': None, 'gender': dep.gender, 'date_of_birth': dep.date_of_birth,
                    'cnic_masked': mask_cnic(dep.cnic), 'photo': dep.photo, 'family': []})

    audit(db, actor, 'eligibility.checked', 'worker', worker.worker_no, {'id': out['id'], 'eligible': eligible})
    db.commit()
    return out
