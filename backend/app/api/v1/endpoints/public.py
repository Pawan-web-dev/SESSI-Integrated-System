"""Endpoints that need no sign-in: master data, employer login, password reset, registration and tracking."""
from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile, status
from sqlalchemy import or_, select

from app.api.deps import DB
from app.core.config import get_settings
from app.models import Directorate, IndustryClassification, OutboxMessage
from app.schemas.common import (
    DirectorateOut, EmployerLoginIn, IndustryOut, Message, OutboxOut, ResetConfirmIn, ResetRequestIn, ResetRequestOut, TokenOut,
)
from app.schemas.registration import (
    ApplicationOut, ContactCodesIn, ContactTokenOut, ContactVerifyIn, DocumentUploadOut, RegistrationIn, TrackIn,
)
from app.services import auth, registration
from app.services.formatting import digits

router = APIRouter()


# ---------------------------------------------------------------- master data
@router.get('/master/directorates', response_model=list[DirectorateOut], tags=['Master data'])
def directorates(db: DB):
    rows = db.scalars(select(Directorate).where(Directorate.active.is_(True)).order_by(Directorate.code))
    return [{'code': d.code, 'name': d.name, 'districts': [x.district for x in d.districts]} for d in rows]


@router.get('/master/industries', response_model=list[IndustryOut], tags=['Master data'])
def industries(db: DB):
    return db.scalars(select(IndustryClassification).where(IndustryClassification.active.is_(True)).order_by(IndustryClassification.name)).all()


# ---------------------------------------------------------------- employer sign-in
@router.post('/auth/login', response_model=TokenOut, tags=['Auth'])
def login(body: EmployerLoginIn, db: DB):
    token, user = auth.login_employer(db, body.login_id, body.password)
    return TokenOut(access_token=token, name=user.employer.name, employer_no=user.employer.ein)


@router.post('/auth/password-reset/request', response_model=ResetRequestOut, tags=['Auth'])
def password_reset_request(body: ResetRequestIn, db: DB):
    sent_to = auth.request_password_reset(db, body.login_id)
    return ResetRequestOut(message='A 6-digit code was sent to your registered mobile number and e-mail.', sent_to=sent_to)


@router.post('/auth/password-reset/confirm', response_model=Message, tags=['Auth'])
def password_reset_confirm(body: ResetConfirmIn, db: DB):
    auth.reset_password(db, body.login_id, body.code, body.new_password)
    return Message(message='Password changed. Log in with your new password.')


# ---------------------------------------------------------------- registration
@router.post('/registrations/contact/codes', response_model=Message, tags=['Registration'])
def contact_codes(body: ContactCodesIn, db: DB):
    """Step "Verify": send one code by SMS and one by e-mail."""
    registration.send_contact_codes(db, body.mobile, str(body.email))
    return Message(message='Verification codes sent to your mobile number and e-mail.')


@router.post('/registrations/contact/verify', response_model=ContactTokenOut, tags=['Registration'])
def contact_verify(body: ContactVerifyIn, db: DB):
    token = registration.verify_contact(db, body.mobile, str(body.email), body.mobile_code, body.email_code)
    return ContactTokenOut(contact_token=token)


@router.post('/registrations/documents', response_model=DocumentUploadOut, status_code=status.HTTP_201_CREATED, tags=['Registration'])
async def upload_document(
    db: DB,
    contact_token: str = Form(description='From POST /registrations/contact/verify'),
    doc_type: str = Form(examples=['secp']),
    file: UploadFile = File(description='PDF, JPG or PNG, up to MAX_UPLOAD_MB'),
):
    """Step 2: upload one document. Send the returned `file_id` in `documents` when submitting."""
    data = await file.read(get_settings().max_upload_mb * 1024 * 1024 + 1)
    stored = registration.upload_document(db, contact_token, doc_type, data, file.filename)
    return DocumentUploadOut(file_id=stored.id, file_name=stored.original_name, content_type=stored.content_type, size=stored.size)


@router.post('/registrations', response_model=ApplicationOut, status_code=status.HTTP_201_CREATED, tags=['Registration'])
def submit(body: RegistrationIn, db: DB):
    app = registration.submit_registration(db, body)
    return registration.application_view(app)


@router.post('/registrations/track', response_model=ApplicationOut, tags=['Registration'])
def track(body: TrackIn, db: DB):
    """"Track my application": Application No. + CNIC."""
    return registration.application_view(registration.track(db, body.app_no, body.cnic))


# ---------------------------------------------------------------- demo
@router.get('/demo/outbox', response_model=list[OutboxOut], tags=['Demo'])
def demo_outbox(db: DB, q: str = Query('', description='Mobile number or e-mail')):
    """Messages that would be sent by SMS / e-mail. Only available while DEMO_MODE is on."""
    if not get_settings().demo_mode:
        raise HTTPException(status.HTTP_404_NOT_FOUND, 'Not found.')
    stmt = select(OutboxMessage).order_by(OutboxMessage.id.desc()).limit(200)
    q = q.strip().lower()
    if q:
        d = digits(q)
        mobile = f'{d[:4]}-{d[4:]}' if len(d) == 11 else q
        stmt = stmt.where(or_(OutboxMessage.email == q, OutboxMessage.mobile == mobile))
    return db.scalars(stmt).all()
