"""Employees registered by an employer."""
from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

EMPLOYEE_STATUSES = ('Active', 'Inactive', 'Separated')
EMPLOYMENT_TYPES = ('Permanent', 'Contractual', 'Daily Wages', 'Piece Rated', 'Others')


class Employee(TimestampMixin, Base):
    __tablename__ = 'employees'
    __table_args__ = (UniqueConstraint('employer_id', 'cnic'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), index=True)
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

    employee: Mapped[Employee] = relationship(back_populates='dependents')
