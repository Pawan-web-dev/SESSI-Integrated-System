"""Workers (one per person, with a permanent ESSI worker number) and their employments with employers."""
from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

EMPLOYEE_STATUSES = ('Active', 'Inactive', 'Separated')
EMPLOYMENT_TYPES = ('Permanent', 'Contractual', 'Daily Wages', 'Piece Rated', 'Others')


class Worker(TimestampMixin, Base):
    """A person insured under ESSI. One row per person (found by CNIC); it stays the same when they change employer.

    `worker_no` is the permanent ESSI worker number W-YY-DDD-NNNNNN-C (see services/worker_no.py): issued once,
    never changed and never re-issued.
    """

    __tablename__ = 'workers'

    id: Mapped[int] = mapped_column(primary_key=True)
    worker_no: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    cnic: Mapped[str] = mapped_column(String(15), unique=True)
    # where and when the number was first issued (part of the number, so these never change)
    directorate_code: Mapped[str] = mapped_column(ForeignKey('directorates.code'))
    issued_year: Mapped[int] = mapped_column(Integer)
    serial: Mapped[int] = mapped_column(Integer)
    issued_by: Mapped[str] = mapped_column(String(80))
    # last family-member suffix handed out (/01, /02 …)
    last_member_no: Mapped[int] = mapped_column(Integer, default=0)

    employments: Mapped[list['Employee']] = relationship(back_populates='worker')


class WorkerSequence(Base):
    """Last serial issued per Directorate and year (the NNNNNN part of the worker number)."""

    __tablename__ = 'worker_sequences'
    __table_args__ = (UniqueConstraint('directorate_code', 'year'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    directorate_code: Mapped[str] = mapped_column(ForeignKey('directorates.code'))
    year: Mapped[int] = mapped_column(Integer)  # two digits, 26 = 2026
    last_serial: Mapped[int] = mapped_column(Integer, default=0)


class Employee(TimestampMixin, Base):
    """One employment: a worker registered by an employer (the same worker can have employments with several employers)."""

    __tablename__ = 'employees'
    __table_args__ = (UniqueConstraint('employer_id', 'cnic'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), index=True)
    worker_id: Mapped[int | None] = mapped_column(ForeignKey('workers.id'), index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    father_name: Mapped[str] = mapped_column(String(120))
    gender: Mapped[str] = mapped_column(String(12))  # MALE | FEMALE | TRANSGENDER
    cnic: Mapped[str] = mapped_column(String(15), index=True)
    date_of_birth: Mapped[date | None] = mapped_column(Date)
    mobile: Mapped[str] = mapped_column(String(20))
    designation: Mapped[str] = mapped_column(String(80))
    skill_level: Mapped[str | None] = mapped_column(String(30))
    employment_type: Mapped[str] = mapped_column(String(20))
    wage_type: Mapped[str | None] = mapped_column(String(20))
    payment_frequency: Mapped[str | None] = mapped_column(String(20))
    date_joined: Mapped[date | None] = mapped_column(Date)
    monthly_wage: Mapped[int | None] = mapped_column(Integer)  # PKR
    bank_account: Mapped[str | None] = mapped_column(String(40))
    status: Mapped[str] = mapped_column(String(12), default='Active', index=True)
    # small JPEG as a data URL (resized to 200x200 in the browser)
    photo: Mapped[str | None] = mapped_column(Text)

    dependents: Mapped[list['EmployeeDependent']] = relationship(
        back_populates='employee', cascade='all, delete-orphan', passive_deletes=True, order_by='EmployeeDependent.id')
    worker: Mapped[Worker | None] = relationship(back_populates='employments', lazy='joined')

    @property
    def worker_no(self) -> str | None:
        return self.worker.worker_no if self.worker else None

    @property
    def worker_no_digits(self) -> str | None:
        """The same number as digits only: W-26-102-004573-6 -> 261020045736."""
        return _digits(self.worker_no)


DEPENDENT_SOURCES = ('FRC', 'Manual', 'NADRA')


class EmployeeDependent(TimestampMixin, Base):
    """A family member of an employee (from the NADRA Family Registration Certificate or typed in by hand)."""

    __tablename__ = 'employee_dependents'

    id: Mapped[int] = mapped_column(primary_key=True)
    employee_id: Mapped[int] = mapped_column(ForeignKey('employees.id', ondelete='CASCADE'), index=True)
    name: Mapped[str] = mapped_column(String(120))
    relation: Mapped[str] = mapped_column(String(40))  # Spouse, Son, Daughter, Father, Mother …
    # CNIC 00000-0000000-0 or a B-Form number; empty for young children without one
    cnic: Mapped[str | None] = mapped_column(String(30))
    date_of_birth: Mapped[date | None] = mapped_column(Date)
    gender: Mapped[str | None] = mapped_column(String(12))
    # small JPEG as a data URL (cropped from the FRC or uploaded)
    photo: Mapped[str | None] = mapped_column(Text)
    source: Mapped[str] = mapped_column(String(10), default='Manual')
    # family-member suffix under the worker's number: 1 = /01. Kept for the same person across employers.
    member_no: Mapped[int | None] = mapped_column(Integer)

    employee: Mapped[Employee] = relationship(back_populates='dependents')

    @property
    def worker_no(self) -> str | None:
        """The family member's number: the worker's number plus /01, /02 …"""
        base = self.employee.worker_no if self.employee else None
        return f'{base}/{self.member_no:02d}' if base and self.member_no else None

    @property
    def worker_no_digits(self) -> str | None:
        """Digits only: W-26-102-004573-6/02 -> 26102004573602."""
        return _digits(self.worker_no)


def _digits(worker_no: str | None) -> str | None:
    return ''.join(ch for ch in worker_no if ch.isdigit()) if worker_no else None
