"""Employer registration: contact verification, submission, tracking and ESSI review."""
import secrets

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import create_token, decode_token, hash_password, password_problem
from app.db.base import utcnow
from app.models import (
    ApplicationDocument, ApplicationEvent, Employer, EmployerUser, IndustryClassification, RegistrationApplication, StoredFile,
)
from app.models.employer import APPROVED, PENDING, REJECTED
from app.models.registration import EVENT_DOCS, EVENT_FINAL, EVENT_INSPECT, EVENT_REJECTED, EVENT_SUBMITTED, STAGES
from app.schemas.registration import OPTIONAL_DOCUMENTS, REQUIRED_DOCUMENTS, RegistrationIn
from app.services.auth import create_code, use_code
from app.services.ein import issue_ein, preview_next_ein
from app.services.errors import NotFound, ServiceError
from app.services.files import save_file
from app.services.formatting import format_cnic, format_mobile
from app.services.master_data import directorate_for_district
from app.services.notify import audit, send_message

settings = get_settings()

EVENT_LABELS = {
    EVENT_SUBMITTED: 'Application submitted',
    EVENT_DOCS: 'Documents verified',
    EVENT_INSPECT: 'Directorate review completed',
    EVENT_FINAL: 'Approved',
    EVENT_REJECTED: 'Rejected',
}


# ---------------------------------------------------------------- contact verification
def _contact(mobile: str, email: str) -> tuple[str, str]:
    m = format_mobile(mobile)
    if not m:
        raise ServiceError('Enter a valid mobile number, for example 0300-1234567.')
    return m, email.strip().lower()


def send_contact_codes(db: Session, mobile: str, email: str) -> None:
    m, e = _contact(mobile, email)
    sms_code = create_code(db, 'contact', m)
    email_code = create_code(db, 'contact', e)
    send_message(db, 'Mobile verification code', f'ESSI Sindh: Your mobile verification code is {sms_code}.', m, None)
    send_message(db, 'E-mail verification code', f'ESSI Sindh: Your e-mail verification code is {email_code}.', None, e)
    db.commit()


def verify_contact(db: Session, mobile: str, email: str, mobile_code: str, email_code: str) -> str:
    m, e = _contact(mobile, email)
    ok_m = use_code(db, 'contact', m, mobile_code)
    ok_e = use_code(db, 'contact', e, email_code)
    db.commit()
    if not (ok_m and ok_e):
        raise ServiceError('The codes do not match or have expired. Request new codes and try again.')
    return create_token(m, 'contact', settings.contact_token_minutes, {'email': e})


# ---------------------------------------------------------------- submission
# ---------------------------------------------------------------- documents
DOCUMENT_LABELS = {**REQUIRED_DOCUMENTS, **OPTIONAL_DOCUMENTS}


def _contact_mobile(contact_token: str) -> str:
    token = decode_token(contact_token, 'contact')
    if not token or not token.get('sub'):
        raise ServiceError('Verify your mobile number and e-mail again before uploading documents.', 401)
    return token['sub']


def upload_document(db: Session, contact_token: str, doc_type: str, data: bytes, file_name: str | None) -> StoredFile:
    """Store one registration document before the application is submitted."""
    mobile = _contact_mobile(contact_token)
    if doc_type not in DOCUMENT_LABELS:
        raise ServiceError('Unknown document type.')
    stored = save_file(db, data, file_name, uploaded_by=mobile, folder='registration')
    db.commit()
    return stored


def _next_app_no(db: Session) -> str:
    year = utcnow().year
    while True:
        app_no = f'REG-{year}-{secrets.randbelow(90000) + 10000}'
        if not db.scalars(select(RegistrationApplication.id).where(RegistrationApplication.app_no == app_no)).first():
            return app_no


def submit_registration(db: Session, data: RegistrationIn) -> RegistrationApplication:
    token = decode_token(data.contact_token, 'contact')
    mobile = format_mobile(data.mobile)
    email = data.email.strip().lower()
    if not token or token.get('sub') != mobile or token.get('email') != email:
        raise ServiceError('Verify your mobile number and e-mail again before submitting.', 401)
    cnic = format_cnic(data.cnic)
    if not cnic:
        raise ServiceError('CNIC must have 13 digits, for example 42101-1234567-1.')
    problem = password_problem(data.password)
    if problem:
        raise ServiceError(problem)
    if not data.declaration_accepted:
        raise ServiceError('Please accept the declaration to submit.')
    contact_mobile = format_mobile(data.contact_mobile)
    if not contact_mobile:
        raise ServiceError('Enter a valid contact mobile number, for example 0300-1234567.')

    industry = db.get(IndustryClassification, data.industry_code)
    if not industry or not industry.active:
        raise ServiceError('Choose a valid Industry Classification.')
    directorate = directorate_for_district(db, data.district)
    if not directorate:
        raise ServiceError('Choose a valid district.')
    missing = [label for key, label in REQUIRED_DOCUMENTS.items() if not (data.documents.get(key) or '').strip()]
    if missing:
        raise ServiceError('Please upload: ' + ', '.join(missing) + '.')
    unknown = set(data.documents) - set(DOCUMENT_LABELS)
    if unknown:
        raise ServiceError('Unknown document type: ' + ', '.join(sorted(unknown)) + '.')
    # every document must be a file this applicant uploaded and that is not part of another application
    files: dict[str, StoredFile] = {}
    for key, file_id in data.documents.items():
        if not file_id.strip():
            continue
        stored = db.get(StoredFile, file_id.strip())
        used = stored and db.scalars(select(ApplicationDocument.id).where(ApplicationDocument.file_id == stored.id)).first()
        if not stored or stored.uploaded_by != mobile or used:
            raise ServiceError(f'Upload the {DOCUMENT_LABELS[key]} again.')
        files[key] = stored

    # one account per CNIC / e-mail; a rejected applicant may register again
    existing = db.scalars(select(EmployerUser).where((EmployerUser.cnic == cnic) | (EmployerUser.email == email))).all()
    if any(u.employer.status != REJECTED for u in existing):
        raise ServiceError('An account with this CNIC or email already exists. Please log in instead.', 409)
    if len(existing) > 1:
        raise ServiceError('This CNIC and e-mail belong to two different earlier applications. Please contact ESSI.', 409)

    employer = Employer(
        status=PENDING, name=data.employer_name.strip(), business_type=data.business_type, industry_code=industry.code,
        directorate_code=directorate.code, secp_no=data.secp_no.strip(), ntn=data.ntn.strip(), srb_no=data.srb_no.strip(),
        address=data.business_address.strip(), district=data.district, province='Sindh', gps=data.gps,
        contact_person=data.contact_person.strip(), designation=data.designation.strip(), contact_mobile=contact_mobile,
        contact_email=str(data.contact_email).lower(), office_phone=data.office_phone, expected_workers=data.expected_workers,
        operations_started=data.operations_started,
    )
    db.add(employer)
    db.flush()

    user = existing[0] if existing else EmployerUser(cnic=cnic, email=email)
    user.employer_id = employer.id
    user.full_name = data.applicant_name.strip()
    user.cnic, user.email, user.mobile = cnic, email, mobile
    user.password_hash = hash_password(data.password)
    user.failed_logins = 0
    db.add(user)

    app = RegistrationApplication(app_no=_next_app_no(db), employer_id=employer.id, status=PENDING, stage=1, submitted_at=utcnow())
    db.add(app)
    db.flush()
    app.events.append(ApplicationEvent(code=EVENT_SUBMITTED, note=f'Application {app.app_no} received.', actor='applicant'))
    for key, stored in files.items():
        app.documents.append(ApplicationDocument(doc_type=key, file_name=stored.original_name, file_id=stored.id, required=key in REQUIRED_DOCUMENTS))

    send_message(
        db, 'Application received',
        f'ESSI Sindh: Dear {user.full_name}, your employer registration for {employer.name} was received. '
        f'Application No. {app.app_no}. You will be notified after verification.',
        user.mobile, user.email, employer.id,
    )
    audit(db, f'applicant:{cnic}', 'registration.submitted', 'registration_application', app.app_no,
          {'employer': employer.name, 'industry': industry.code, 'directorate': directorate.code})

    if not industry.approval_required:  # instant registration where no approval is legally required
        _approve(db, app, 'system')
    db.commit()
    return app


# ---------------------------------------------------------------- views
def _stages(app: RegistrationApplication) -> list[dict]:
    done = 4 if app.status == APPROVED else max(1, min(3, app.stage))
    rejected = app.status == REJECTED
    out = []
    for i, (title, description) in enumerate(STAGES):
        state = 'done' if i < done else ('stopped' if rejected else 'current') if i == done else 'waiting'
        out.append({'title': title, 'description': description, 'state': state})
    return out


def application_view(app: RegistrationApplication) -> dict:
    return {
        'app_no': app.app_no,
        'status': app.status,
        'stage': 4 if app.status == APPROVED else app.stage,
        'employer_name': app.employer.name,
        'employer_no': app.employer.ein,
        'submitted_at': app.submitted_at,
        'rejection_reason': app.rejection_reason,
        'stages': _stages(app),
        'events': [{'code': e.code, 'label': EVENT_LABELS.get(e.code, e.code), 'note': e.note, 'at': e.created_at} for e in reversed(app.events)],
    }


def application_detail(db: Session, app: RegistrationApplication) -> dict:
    e = app.employer
    user = e.users[0] if e.users else None
    return {
        **application_view(app),
        'id': app.id,
        'business_type': e.business_type,
        'industry': e.industry.name,
        'industry_code': e.industry_code,
        'address': e.address,
        'district': e.district,
        'directorate': e.directorate.name,
        'directorate_code': e.directorate_code,
        'secp_no': e.secp_no,
        'ntn': e.ntn,
        'srb_no': e.srb_no,
        'applicant': user.full_name if user else e.contact_person,
        'designation': e.designation,
        'cnic': user.cnic if user else '',
        'mobile': user.mobile if user else e.contact_mobile,
        'email': user.email if user else e.contact_email,
        'expected_workers': e.expected_workers,
        'documents': [document_view(d) for d in app.documents],
        'employer_no_on_approval': e.ein or preview_next_ein(db, e.directorate_code, e.industry_code),
    }


def document_view(d: ApplicationDocument, status: str | None = None) -> dict:
    return {
        'id': d.id, 'doc_type': d.doc_type, 'label': DOCUMENT_LABELS.get(d.doc_type, d.doc_type), 'required': d.required,
        'file_name': d.file_name, 'has_file': d.file is not None,
        'content_type': d.file.content_type if d.file else None, 'size': d.file.size if d.file else None,
        'uploaded_at': d.created_at, 'status': status,
    }


def get_document(app: RegistrationApplication, document_id: int) -> ApplicationDocument:
    doc = next((d for d in app.documents if d.id == document_id), None)
    if not doc or not doc.file:
        raise NotFound('Document not found.')
    return doc


def track(db: Session, app_no: str, cnic: str) -> RegistrationApplication:
    formatted = format_cnic(cnic)
    app = db.scalars(select(RegistrationApplication).where(RegistrationApplication.app_no == app_no.strip().upper())).first()
    if not app or not formatted or not any(u.cnic == formatted for u in app.employer.users):
        raise NotFound('No application found for that Application No. and CNIC.')
    return app


# ---------------------------------------------------------------- ESSI review
def get_application(db: Session, application_id: int) -> RegistrationApplication:
    app = db.get(RegistrationApplication, application_id)
    if not app:
        raise NotFound('Application not found.')
    return app


def list_applications(db: Session, status: str) -> tuple[dict[str, int], list[RegistrationApplication]]:
    counts = {s: 0 for s in (PENDING, APPROVED, REJECTED)}
    for s, n in db.execute(select(RegistrationApplication.status, func.count()).group_by(RegistrationApplication.status)):
        counts[s] = n
    items = db.scalars(
        select(RegistrationApplication).where(RegistrationApplication.status == status).order_by(RegistrationApplication.submitted_at.desc())
    ).all()
    return counts, list(items)


def _require_pending(app: RegistrationApplication) -> None:
    if app.status != PENDING:
        raise ServiceError(f'Application {app.app_no} is already {app.status}.', 409)


def post_progress(db: Session, app: RegistrationApplication, stage: int, note: str | None, admin: str) -> None:
    _require_pending(app)
    note = (note or '').strip()
    app.stage = max(app.stage, stage)
    code = EVENT_DOCS if stage == 2 else EVENT_INSPECT
    app.events.append(ApplicationEvent(code=code, note=note or ('Your documents have been verified.' if stage == 2 else 'Directorate review has been completed.'), actor=admin))
    user = app.employer.users[0]
    send_message(
        db, 'Application update',
        f'ESSI Sindh: Application {app.app_no} — {STAGES[stage - 1][0]} completed.' + (f' {note}.' if note else '') + ' You can track your application any time from the login page.',
        user.mobile, user.email, app.employer_id,
    )
    audit(db, admin, 'registration.progress', 'registration_application', app.app_no, {'stage': stage, 'note': note})
    db.commit()


def _approve(db: Session, app: RegistrationApplication, admin: str) -> str:
    employer = app.employer
    ein = issue_ein(db, employer, admin)
    employer.status = APPROVED
    employer.approved_at = utcnow()
    app.status, app.stage = APPROVED, 4
    app.decided_at, app.decided_by = utcnow(), admin
    app.events.append(ApplicationEvent(code=EVENT_FINAL, note=f'Approved. Employer No. {ein} assigned.', actor=admin))
    user = employer.users[0]
    send_message(
        db, 'Registration approved',
        f'ESSI Sindh: Congratulations! {employer.name} is approved. Your Employer No. is {ein}. Log in at the Employer Portal '
        'with your Employer No. (or CNIC / email) and the password you created at registration.',
        user.mobile, user.email, employer.id,
    )
    audit(db, admin, 'ein.issued', 'employer', employer.id, {'ein': ein, 'app_no': app.app_no})
    return ein


def approve(db: Session, app: RegistrationApplication, admin: str) -> str:
    _require_pending(app)
    ein = _approve(db, app, admin)
    db.commit()
    return ein


def reject(db: Session, app: RegistrationApplication, reason: str, admin: str) -> None:
    _require_pending(app)
    reason = reason.strip()
    app.status = REJECTED
    app.employer.status = REJECTED
    app.rejection_reason = reason
    app.decided_at, app.decided_by = utcnow(), admin
    app.events.append(ApplicationEvent(code=EVENT_REJECTED, note=reason, actor=admin))
    user = app.employer.users[0]
    send_message(
        db, 'Registration needs correction',
        f'ESSI Sindh: Your application {app.app_no} could not be approved. Reason: {reason}. Please register again with corrected details.',
        user.mobile, user.email, app.employer_id,
    )
    audit(db, admin, 'registration.rejected', 'registration_application', app.app_no, {'reason': reason})
    db.commit()
