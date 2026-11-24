"""Employers (establishments), their portal users and the Employer Identification Number registry."""
from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

# Employer status
PENDING = 'pending'
APPROVED = 'approved'
REJECTED = 'rejected'
CLOSED = 'closed'


class Employer(TimestampMixin, Base):
    __tablename__ = 'employers'

    id: Mapped[int] = mapped_column(primary_key=True)
    # Employer Identification Number DDD-II-NNNNNN[-BB]; empty until approved, never changes afterwards
    ein: Mapped[str | None] = mapped_column(String(16), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(12), default=PENDING, index=True)

    name: Mapped[str] = mapped_column(String(200))
    business_type: Mapped[str] = mapped_column(String(60))
    industry_code: Mapped[str] = mapped_column(ForeignKey('industry_classifications.code'), index=True)
    directorate_code: Mapped[str] = mapped_column(ForeignKey('directorates.code'), index=True)

    secp_no: Mapped[str] = mapped_column(String(40))
    ntn: Mapped[str] = mapped_column(String(20))
    srb_no: Mapped[str] = mapped_column(String(40))

    address: Mapped[str] = mapped_column(String(300))
    district: Mapped[str] = mapped_column(String(80))
    province: Mapped[str] = mapped_column(String(40), default='Sindh')
    gps: Mapped[str | None] = mapped_column(String(80))

    contact_person: Mapped[str] = mapped_column(String(120))
    designation: Mapped[str | None] = mapped_column(String(80))
    contact_mobile: Mapped[str] = mapped_column(String(20))
    contact_email: Mapped[str] = mapped_column(String(160))
    office_phone: Mapped[str | None] = mapped_column(String(20))

    expected_workers: Mapped[int | None] = mapped_column(Integer)
    operations_started: Mapped[date | None] = mapped_column(Date)
    approved_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    users: Mapped[list['EmployerUser']] = relationship(back_populates='employer')
    industry = relationship('IndustryClassification')
    directorate = relationship('Directorate')


class EmployerUser(TimestampMixin, Base):
    """The authorized person who registered the establishment and logs in to the portal."""

    __tablename__ = 'employer_users'

    id: Mapped[int] = mapped_column(primary_key=True)
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), index=True)
    full_name: Mapped[str] = mapped_column(String(120))
    cnic: Mapped[str] = mapped_column(String(15), unique=True)  # 00000-0000000-0
    mobile: Mapped[str] = mapped_column(String(20), index=True)
    email: Mapped[str] = mapped_column(String(160), unique=True)
    password_hash: Mapped[str] = mapped_column(String(100))

    failed_logins: Mapped[int] = mapped_column(Integer, default=0)
    locked_until: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    employer: Mapped[Employer] = relationship(back_populates='users')


class EinRegistry(TimestampMixin, Base):
    """Every Employer Identification Number ever issued. Rows are never deleted, so a number is never re-issued."""

    __tablename__ = 'ein_registry'

    ein: Mapped[str] = mapped_column(String(16), primary_key=True)
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), unique=True)
    issued_by: Mapped[str | None] = mapped_column(String(80))


class EinSequence(Base):
    """Last serial issued per Directorate + Industry (locked while issuing to avoid duplicates)."""

    __tablename__ = 'ein_sequences'
    __table_args__ = (UniqueConstraint('directorate_code', 'industry_code'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    directorate_code: Mapped[str] = mapped_column(ForeignKey('directorates.code'))
    industry_code: Mapped[str] = mapped_column(ForeignKey('industry_classifications.code'))
    last_serial: Mapped[int] = mapped_column(Integer, default=0)


class OneTimeCode(TimestampMixin, Base):
    """Codes sent by SMS / e-mail: contact verification at registration and password reset."""

    __tablename__ = 'one_time_codes'

    id: Mapped[int] = mapped_column(primary_key=True)
    purpose: Mapped[str] = mapped_column(String(20), index=True)  # contact | password_reset
    target: Mapped[str] = mapped_column(String(160), index=True)  # mobile or e-mail, or user id for resets
    code_hash: Mapped[str] = mapped_column(String(100))
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    note: Mapped[str | None] = mapped_column(Text)
