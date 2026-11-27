"""ESSI staff accounts, outgoing SMS / e-mail, and the audit trail."""
from datetime import datetime

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin


class AdminUser(TimestampMixin, Base):
    __tablename__ = 'admin_users'

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(60), unique=True)
    full_name: Mapped[str] = mapped_column(String(120))
    password_hash: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(20), default='officer')  # officer | admin
    active: Mapped[bool] = mapped_column(Boolean, default=True)


class OutboxMessage(TimestampMixin, Base):
    """Every SMS / e-mail the system sends. A gateway job will deliver them; in demo mode they are only listed."""

    __tablename__ = 'outbox_messages'

    id: Mapped[int] = mapped_column(primary_key=True)
    employer_id: Mapped[int | None] = mapped_column(ForeignKey('employers.id'), index=True)
    mobile: Mapped[str | None] = mapped_column(String(20), index=True)
    email: Mapped[str | None] = mapped_column(String(160), index=True)
    subject: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text)
    sent: Mapped[bool] = mapped_column(Boolean, default=False)
    # delivery through the SMS gateway / SMTP: queued -> sent | failed (| outbox-only when no gateway is set)
    sms_status: Mapped[str | None] = mapped_column(String(12))
    email_status: Mapped[str | None] = mapped_column(String(12))
    attempts: Mapped[int] = mapped_column(Integer, default=0)
    last_error: Mapped[str | None] = mapped_column(String(300))
    sent_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    # when the employer opened it in the portal inbox (NULL = unread)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))


class AuditLog(TimestampMixin, Base):
    """Who did what and when. Rows are never updated or deleted."""

    __tablename__ = 'audit_log'

    id: Mapped[int] = mapped_column(primary_key=True)
    actor: Mapped[str] = mapped_column(String(120))  # e.g. "admin:admin", "employer:101-10-000001", "system"
    action: Mapped[str] = mapped_column(String(60), index=True)  # e.g. ein.issued, industry.changed
    entity: Mapped[str] = mapped_column(String(40))
    entity_id: Mapped[str] = mapped_column(String(40), index=True)
    details: Mapped[dict | None] = mapped_column(JSON)


PARTNER_KINDS = ('Pharmacy', 'HMIS', 'Other')


class PartnerKey(TimestampMixin, Base):
    """An API key for a partner system (pharmacy, hospital HMIS) that checks whether a worker or family member is covered.

    Only a SHA-256 hash of the key is kept; the key itself is shown once, when it is created. Every lookup made with
    the key is written to the audit trail (action eligibility.checked).
    """

    __tablename__ = 'partner_keys'

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(120))  # e.g. "Civil Hospital Karachi – HMIS"
    kind: Mapped[str] = mapped_column(String(20))  # Pharmacy | HMIS | Other
    key_prefix: Mapped[str] = mapped_column(String(16))  # first characters, so officers can tell keys apart
    key_hash: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_by: Mapped[str] = mapped_column(String(80))
    last_used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    revoked_by: Mapped[str | None] = mapped_column(String(80))
