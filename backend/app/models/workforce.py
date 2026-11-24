"""Employees registered by an employer."""
from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

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
