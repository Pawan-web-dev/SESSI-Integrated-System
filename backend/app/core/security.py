"""Password hashing and JSON Web Tokens."""
from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt

from app.core.config import get_settings


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('ascii')


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('ascii'))
    except ValueError:
        return False


def password_problem(password: str) -> str | None:
    """Same rule as the portal: at least 8 characters, one capital letter and one number."""
    if len(password) < 8 or not any(c.isupper() for c in password) or not any(c.isdigit() for c in password):
        return 'Password needs at least 8 characters, one capital letter and one number.'
    return None


def create_token(subject: str, kind: str, minutes: int, extra: dict[str, Any] | None = None) -> str:
    """kind: 'employer' | 'admin' | 'contact' (verified mobile + e-mail during registration)."""
    settings = get_settings()
    now = datetime.now(timezone.utc)
    payload: dict[str, Any] = {'sub': subject, 'kind': kind, 'iat': now, 'exp': now + timedelta(minutes=minutes)}
    if extra:
        payload.update(extra)
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str, kind: str) -> dict[str, Any] | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError:
        return None
    return payload if payload.get('kind') == kind else None
