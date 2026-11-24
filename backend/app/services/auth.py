"""Employer and admin sign-in, failed-login lock, one-time codes and password changes."""
import hashlib
import secrets
from datetime import timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_token, hash_password, password_problem, verify_password
from app.db.base import as_utc, utcnow
from app.models import AdminUser, Employer, EmployerUser, OneTimeCode
from app.models.employer import APPROVED, PENDING, REJECTED
from app.models.registration import RegistrationApplication
from app.services.errors import ServiceError
from app.services.formatting import digits, format_cnic, format_mobile
from app.services.notify import audit, send_message

settings = get_settings()


# ---------------------------------------------------------------- one-time codes
def _hash_code(purpose: str, target: str, code: str) -> str:
    return hashlib.sha256(f'{settings.jwt_secret}|{purpose}|{target}|{code}'.encode()).hexdigest()


def create_code(db: Session, purpose: str, target: str) -> str:
    """Create a 6-digit code for `target`; older unused codes for the same target stop working."""
    for old in db.scalars(select(OneTimeCode).where(OneTimeCode.purpose == purpose, OneTimeCode.target == target, OneTimeCode.used_at.is_(None))):
        old.used_at = utcnow()
    code = f'{secrets.randbelow(1_000_000):06d}'
    db.add(OneTimeCode(purpose=purpose, target=target, code_hash=_hash_code(purpose, target, code), expires_at=utcnow() + timedelta(minutes=settings.otp_minutes)))
    db.flush()
    return code


def use_code(db: Session, purpose: str, target: str, code: str) -> bool:
    row = db.scalars(
        select(OneTimeCode)
        .where(OneTimeCode.purpose == purpose, OneTimeCode.target == target, OneTimeCode.used_at.is_(None))
        .order_by(OneTimeCode.id.desc())
    ).first()
    if not row or as_utc(row.expires_at) < utcnow() or row.code_hash != _hash_code(purpose, target, code.strip()):
        return False
    row.used_at = utcnow()
    return True


# ---------------------------------------------------------------- employer login
def find_user(db: Session, login_id: str) -> EmployerUser | None:
    """Login ID can be the Employer No. (EIN), e-mail, CNIC or mobile number."""
    value = (login_id or '').strip()
    if not value:
        return None
    employer = db.scalars(select(Employer).where(Employer.ein == value)).first()
    if employer and employer.users:
        return employer.users[0]
    user = db.scalars(select(EmployerUser).where(EmployerUser.email == value.lower())).first()
    if user:
        return user
    cnic = format_cnic(value)
    if cnic:
        return db.scalars(select(EmployerUser).where(EmployerUser.cnic == cnic)).first()
    mobile = format_mobile(value)
    if mobile and len(digits(value)) in (10, 11, 12):
        return db.scalars(select(EmployerUser).where(EmployerUser.mobile == mobile)).first()
    return None


def _application(db: Session, employer_id: int) -> RegistrationApplication | None:
    return db.scalars(
        select(RegistrationApplication).where(RegistrationApplication.employer_id == employer_id).order_by(RegistrationApplication.id.desc())
    ).first()


def login_employer(db: Session, login_id: str, password: str) -> tuple[str, EmployerUser]:
    user = find_user(db, login_id)
    now = utcnow()
    if user and user.locked_until and as_utc(user.locked_until) > now:
        seconds = int((as_utc(user.locked_until) - now).total_seconds()) + 1
        raise ServiceError(f'Too many failed attempts. Try again in {seconds} seconds.', 429)
    if not user or not verify_password(password, user.password_hash):
        if user:
            user.failed_logins += 1
            left = settings.max_login_attempts - user.failed_logins
            if left <= 0:
                user.failed_logins = 0
                user.locked_until = now + timedelta(seconds=settings.login_lock_seconds)
                db.commit()
                raise ServiceError(f'Too many failed attempts. Try again in {settings.login_lock_seconds} seconds.', 429)
            db.commit()
            raise ServiceError(f'Invalid login ID or password. {left} attempt{"" if left == 1 else "s"} remaining.', 401)
        raise ServiceError('Invalid login ID or password.', 401)

    user.failed_logins = 0
    user.locked_until = None
    employer = user.employer
    app = _application(db, employer.id)
    if employer.status == PENDING:
        db.commit()
        raise ServiceError(
            f'Your application {app.app_no if app else ""} is still waiting for ESSI approval. You can log in once an Employer No. is assigned. '
            'Use “Track my application” to check the status.',
            403,
        )
    if employer.status == REJECTED:
        db.commit()
        reason = app.rejection_reason if app else '-'
        raise ServiceError(f'Your application {app.app_no if app else ""} was rejected. Reason: {reason}. Please register again.', 403)
    if employer.status != APPROVED:
        db.commit()
        raise ServiceError('This employer account is not active.', 403)
    audit(db, f'employer:{employer.ein}', 'login', 'employer_user', user.id)
    db.commit()
    return create_token(str(user.id), 'employer', settings.access_token_minutes), user


def request_password_reset(db: Session, login_id: str) -> str:
    """Send a reset code to the registered mobile + e-mail. Returns the masked mobile number."""
    user = find_user(db, login_id)
    if not user:
        raise ServiceError('No account found for that login ID.', 404)
    code = create_code(db, 'password_reset', str(user.id))
    send_message(
        db,
        'Password reset code',
        f'ESSI Sindh: Your password reset code is {code}. It is valid for {settings.otp_minutes} minutes. Do not share it with anyone.',
        user.mobile,
        user.email,
        user.employer_id,
    )
    db.commit()
    d = digits(user.mobile)
    return f'{d[:4]}-XXX{d[-4:]}'


def reset_password(db: Session, login_id: str, code: str, new_password: str) -> None:
    user = find_user(db, login_id)
    if not user or not use_code(db, 'password_reset', str(user.id), code):
        raise ServiceError('The code is incorrect or has expired.')
    problem = password_problem(new_password)
    if problem:
        raise ServiceError(problem)
    user.password_hash = hash_password(new_password)
    user.failed_logins = 0
    user.locked_until = None
    audit(db, f'employer_user:{user.id}', 'password.reset', 'employer_user', user.id)
    db.commit()


def change_password(db: Session, user: EmployerUser, current: str, new: str) -> None:
    if not verify_password(current, user.password_hash):
        raise ServiceError('Your current password is not correct.')
    if new == current:
        raise ServiceError('New password must be different from the current password.')
    problem = password_problem(new)
    if problem:
        raise ServiceError(problem)
    user.password_hash = hash_password(new)
    audit(db, f'employer_user:{user.id}', 'password.changed', 'employer_user', user.id)
    db.commit()


# ---------------------------------------------------------------- admin login
def login_admin(db: Session, username: str, password: str) -> tuple[str, AdminUser]:
    admin = db.scalars(select(AdminUser).where(AdminUser.username == username.strip().lower(), AdminUser.active.is_(True))).first()
    if not admin or not verify_password(password, admin.password_hash):
        raise ServiceError('Wrong admin ID or password.', 401)
    audit(db, f'admin:{admin.username}', 'login', 'admin_user', admin.id)
    db.commit()
    return create_token(str(admin.id), 'admin', settings.access_token_minutes, {'role': admin.role}), admin
