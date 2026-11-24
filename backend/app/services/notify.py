"""Outgoing SMS / e-mail (stored in the outbox) and the audit trail."""
from typing import Any

from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.models import AuditLog, OutboxMessage
from app.services.delivery import initial_status


def send_message(db: Session, subject: str, body: str, mobile: str | None, email: str | None, employer_id: int | None = None) -> None:
    """Queue an SMS + e-mail. The delivery worker sends them when an SMS gateway / SMTP is configured."""
    s = get_settings()
    db.add(OutboxMessage(
        employer_id=employer_id, mobile=mobile, email=email, subject=subject, body=body,
        sms_status=initial_status(mobile, s.sms_enabled), email_status=initial_status(email, s.email_enabled),
    ))


def audit(db: Session, actor: str, action: str, entity: str, entity_id: Any, details: dict | None = None) -> None:
    db.add(AuditLog(actor=actor, action=action, entity=entity, entity_id=str(entity_id), details=details))
