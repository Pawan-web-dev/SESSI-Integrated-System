"""API keys for partner systems (pharmacies, hospital HMIS): issued and revoked by an ESSI admin, checked on every lookup."""
import hashlib
import secrets

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.base import utcnow
from app.models import AdminUser, PartnerKey
from app.models.system import PARTNER_KINDS
from app.services.errors import NotFound, ServiceError
from app.services.notify import audit

KEY_PREFIX = 'essi_'


def _hash(key: str) -> str:
    return hashlib.sha256(key.encode('utf-8')).hexdigest()


def _only_admins(admin: AdminUser) -> None:
    if admin.role != 'admin':
        raise ServiceError('Only an ESSI administrator can issue or revoke partner keys.', 403)


def list_keys(db: Session) -> list[PartnerKey]:
    return list(db.scalars(select(PartnerKey).order_by(PartnerKey.active.desc(), PartnerKey.id.desc())))


def create_key(db: Session, admin: AdminUser, name: str, kind: str) -> tuple[PartnerKey, str]:
    """A new key for a partner system. Returns the key itself, which is shown only this once."""
    _only_admins(admin)
    name = name.strip()
    if not name:
        raise ServiceError('Enter the name of the hospital, pharmacy or system.')
    if kind not in PARTNER_KINDS:
        raise ServiceError(f'Type must be one of: {", ".join(PARTNER_KINDS)}.')
    key = KEY_PREFIX + secrets.token_urlsafe(32)
    row = PartnerKey(name=name, kind=kind, key_prefix=key[:12], key_hash=_hash(key), active=True, created_by=admin.username)
    db.add(row)
    db.flush()
    audit(db, f'admin:{admin.username}', 'partner_key.issued', 'partner_key', row.id, {'name': name, 'kind': kind, 'prefix': row.key_prefix})
    db.commit()
    return row, key


def revoke_key(db: Session, admin: AdminUser, key_id: int) -> PartnerKey:
    _only_admins(admin)
    row = db.get(PartnerKey, key_id)
    if not row:
        raise NotFound('Partner key not found.')
    if row.active:
        row.active, row.revoked_at, row.revoked_by = False, utcnow(), admin.username
        audit(db, f'admin:{admin.username}', 'partner_key.revoked', 'partner_key', row.id, {'name': row.name})
        db.commit()
    return row


def delete_key(db: Session, admin: AdminUser, key_id: int) -> str:
    """Remove a revoked key for good (an active key must be revoked first). The audit trail keeps its history."""
    _only_admins(admin)
    row = db.get(PartnerKey, key_id)
    if not row:
        raise NotFound('Partner key not found.')
    if row.active:
        raise ServiceError('Revoke the key first, then delete it.')
    name = row.name
    audit(db, f'admin:{admin.username}', 'partner_key.deleted', 'partner_key', row.id, {'name': name, 'prefix': row.key_prefix})
    db.delete(row)
    db.commit()
    return name


def authenticate(db: Session, key: str | None) -> PartnerKey | None:
    """The active partner key matching `key`, or None."""
    key = (key or '').strip()
    if not key.startswith(KEY_PREFIX):
        return None
    row = db.scalars(select(PartnerKey).where(PartnerKey.key_hash == _hash(key))).first()
    if not row or not row.active:
        return None
    row.last_used_at = utcnow()
    return row
