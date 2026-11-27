"""Shared FastAPI dependencies: database session and the signed-in employer / admin."""
from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, HTTPException, Security, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.security import decode_token
from app.db.session import get_db
from app.models import AdminUser, Employer, EmployerUser, PartnerKey
from app.models.employer import APPROVED
from app.services import partner_keys

DB = Annotated[Session, Depends(get_db)]
bearer = HTTPBearer(auto_error=False)
api_key = APIKeyHeader(name='X-API-Key', auto_error=False, description='Partner key issued by ESSI (Admin panel → Partner access)')


def _payload(credentials: HTTPAuthorizationCredentials | None, kind: str) -> dict:
    payload = decode_token(credentials.credentials, kind) if credentials else None
    if not payload:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Please sign in again.', headers={'WWW-Authenticate': 'Bearer'})
    return payload


@dataclass
class EmployerSession:
    user: EmployerUser
    employer: Employer

    @property
    def actor(self) -> str:
        return f'employer:{self.employer.ein}'


def current_employer(db: DB, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]) -> EmployerSession:
    payload = _payload(credentials, 'employer')
    user = db.get(EmployerUser, int(payload['sub']))
    if not user or user.employer.status != APPROVED:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Please sign in again.')
    return EmployerSession(user=user, employer=user.employer)


def current_admin(db: DB, credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)]) -> AdminUser:
    payload = _payload(credentials, 'admin')
    admin = db.get(AdminUser, int(payload['sub']))
    if not admin or not admin.active:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'Please sign in again.')
    return admin


def current_partner(db: DB, key: Annotated[str | None, Security(api_key)]) -> PartnerKey:
    partner = partner_keys.authenticate(db, key)
    if not partner:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, 'A valid partner key is needed in the X-API-Key header.')
    return partner


CurrentEmployer = Annotated[EmployerSession, Depends(current_employer)]
CurrentAdmin = Annotated[AdminUser, Depends(current_admin)]
CurrentPartner = Annotated[PartnerKey, Depends(current_partner)]


def admin_actor(admin: AdminUser) -> str:
    return f'admin:{admin.username}'
