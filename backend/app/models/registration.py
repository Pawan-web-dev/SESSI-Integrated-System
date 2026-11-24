"""Employer registration applications and their review history."""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin, utcnow
from app.models.files import StoredFile

# Review stages shown to the applicant (1-4)
STAGES = [
    ('Application Submitted', 'We received your application and uploaded documents.'),
    ('Under Review', 'ESSI officers check your SECP, NTN, SRB and CNIC documents.'),
    ('Approved', 'Your area directorate reviews the establishment details.'),
    ('Registration Complete', 'Your Employer No. is issued and you can log in.'),
]

# Event codes in the activity log
EVENT_SUBMITTED = 'submitted'
EVENT_DOCS = 'docs'
EVENT_INSPECT = 'inspect'
EVENT_FINAL = 'final'
EVENT_REJECTED = 'rejected'


class RegistrationApplication(TimestampMixin, Base):
    __tablename__ = 'registration_applications'

    id: Mapped[int] = mapped_column(primary_key=True)
    app_no: Mapped[str] = mapped_column(String(20), unique=True, index=True)  # REG-2026-12345
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), index=True)
    status: Mapped[str] = mapped_column(String(12), default='pending', index=True)  # pending | approved | rejected
    stage: Mapped[int] = mapped_column(Integer, default=1)  # highest completed review stage
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utcnow)
    decided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    decided_by: Mapped[str | None] = mapped_column(String(80))
    rejection_reason: Mapped[str | None] = mapped_column(Text)

    employer = relationship('Employer')
    events: Mapped[list['ApplicationEvent']] = relationship(back_populates='application', order_by='ApplicationEvent.id')
    documents: Mapped[list['ApplicationDocument']] = relationship(back_populates='application', order_by='ApplicationDocument.id')


class ApplicationEvent(TimestampMixin, Base):
    __tablename__ = 'application_events'

    id: Mapped[int] = mapped_column(primary_key=True)
    application_id: Mapped[int] = mapped_column(ForeignKey('registration_applications.id'), index=True)
    code: Mapped[str] = mapped_column(String(12))  # submitted | docs | inspect | final | rejected
    note: Mapped[str | None] = mapped_column(Text)
    actor: Mapped[str | None] = mapped_column(String(80))

    application: Mapped[RegistrationApplication] = relationship(back_populates='events')


class ApplicationDocument(TimestampMixin, Base):
    """Documents uploaded with an application. The file itself is in stored_files (older rows may have none)."""

    __tablename__ = 'application_documents'

    id: Mapped[int] = mapped_column(primary_key=True)
    application_id: Mapped[int] = mapped_column(ForeignKey('registration_applications.id'), index=True)
    doc_type: Mapped[str] = mapped_column(String(20))  # secp | ntn | srb | elec | gas | deed | cnic | bank | logo | contact
    file_name: Mapped[str] = mapped_column(String(200))
    required: Mapped[bool] = mapped_column(Boolean, default=True)
    file_id: Mapped[str | None] = mapped_column(ForeignKey('stored_files.id'))

    file: Mapped[StoredFile | None] = relationship()

    application: Mapped[RegistrationApplication] = relationship(back_populates='documents')
