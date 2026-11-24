"""Changes to registered company details. Applied only after ESSI approval; recorded in the audit trail.

The Employer Identification Number never changes, also when the Industry Classification or district changes.
"""
import secrets

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.base import utcnow
from app.models import ChangeRequest, ChangeRequestEvent, Employer, IndustryClassification
from app.models.change_request import APPROVED, CHANGEABLE_FIELDS, PENDING_REVIEW, REJECTED, UNDER_REVIEW
from app.schemas.employer import ChangeRequestIn
from app.services.errors import NotFound, ServiceError
from app.services.master_data import directorate_for_district
from app.services.notify import audit, send_message


def display_value(db: Session, field: str, value: str | None) -> str | None:
    if field == 'industry_code' and value:
        ind = db.get(IndustryClassification, value)
        return f'{ind.name} ({value})' if ind else value
    return value


def request_view(db: Session, r: ChangeRequest) -> dict:
    return {
        'id': r.id, 'ref': r.ref, 'field': r.field, 'label': CHANGEABLE_FIELDS[r.field][0],
        'old_value': display_value(db, r.field, r.old_value), 'new_value': display_value(db, r.field, r.new_value),
        'reason': r.reason, 'document': r.document, 'status': r.status, 'remarks': r.remarks, 'submitted_by': r.submitted_by,
        'created_at': r.created_at, 'events': list(r.events),
    }


def list_requests(db: Session, employer: Employer | None = None, status: str | None = None) -> list[ChangeRequest]:
    stmt = select(ChangeRequest).order_by(ChangeRequest.id.desc())
    if employer:
        stmt = stmt.where(ChangeRequest.employer_id == employer.id)
    if status:
        stmt = stmt.where(ChangeRequest.status == status)
    return list(db.scalars(stmt))


def get_request(db: Session, request_id: int, employer: Employer | None = None) -> ChangeRequest:
    r = db.get(ChangeRequest, request_id)
    if not r or (employer and r.employer_id != employer.id):
        raise NotFound('Change request not found.')
    return r


def submit_request(db: Session, employer: Employer, data: ChangeRequestIn, submitted_by: str) -> ChangeRequest:
    if data.field not in CHANGEABLE_FIELDS:
        raise ServiceError('Choose what you want to change.')
    label, doc, doc_required = CHANGEABLE_FIELDS[data.field]
    new_value = data.new_value.strip()
    old_value = getattr(employer, data.field)
    if new_value == (old_value or ''):
        raise ServiceError('The new value is the same as the current value.')
    if data.field == 'industry_code':
        ind = db.get(IndustryClassification, new_value)
        if not ind or not ind.active:
            raise ServiceError('Choose a valid Industry Classification code.')
    if data.field == 'district' and not directorate_for_district(db, new_value):
        raise ServiceError('Choose a valid district.')
    if doc_required and not (data.document or '').strip():
        raise ServiceError(f'Attach the supporting document: {doc}.')
    open_same = db.scalars(select(ChangeRequest.id).where(ChangeRequest.employer_id == employer.id, ChangeRequest.field == data.field,
                                                          ChangeRequest.status.in_([PENDING_REVIEW, UNDER_REVIEW]))).first()
    if open_same:
        raise ServiceError(f'There is already an open request to change {label}.', 409)

    year = utcnow().year
    while True:
        ref = f'CR-{year}-{secrets.randbelow(10000):04d}'
        if not db.scalars(select(ChangeRequest.id).where(ChangeRequest.ref == ref)).first():
            break
    r = ChangeRequest(ref=ref, employer_id=employer.id, field=data.field, old_value=old_value, new_value=new_value, reason=data.reason.strip(),
                      document=data.document, status=PENDING_REVIEW, submitted_by=submitted_by)
    r.events.append(ChangeRequestEvent(text=f'Request submitted by {submitted_by}', actor='Employer'))
    db.add(r)
    audit(db, f'employer:{employer.ein}', 'change_request.submitted', 'change_request', ref, {'field': data.field, 'new': new_value})
    db.commit()
    return r


def decide(db: Session, r: ChangeRequest, status: str, remarks: str | None, admin: str) -> ChangeRequest:
    if r.status in (APPROVED, REJECTED):
        raise ServiceError(f'Request {r.ref} is already {r.status.lower()}.', 409)
    employer = db.get(Employer, r.employer_id)
    label = CHANGEABLE_FIELDS[r.field][0]
    remarks = (remarks or '').strip()
    if status == REJECTED and not remarks:
        raise ServiceError('Give the reason for rejecting the request.')
    r.status = status
    r.remarks = remarks or r.remarks
    if status == UNDER_REVIEW:
        r.events.append(ChangeRequestEvent(text='Assigned to an ESSI officer for review', actor='ESSI'))
    elif status == REJECTED:
        r.events.append(ChangeRequestEvent(text=f'Rejected by ESSI officer: {r.remarks}', actor='ESSI'))
    elif status == APPROVED:
        old = getattr(employer, r.field)
        setattr(employer, r.field, r.new_value)
        text = 'Approved by ESSI officer. Company profile updated.'
        if r.field == 'industry_code':
            text += (f' Industry Classification changed from {display_value(db, r.field, old)} to {display_value(db, r.field, r.new_value)};'
                     f' Employer No. {employer.ein} remains unchanged.')
            audit(db, admin, 'industry.changed', 'employer', employer.id, {'from': old, 'to': r.new_value, 'ein': employer.ein, 'request': r.ref, 'reason': r.reason})
        if r.field == 'district':
            new_dir = directorate_for_district(db, r.new_value)
            if new_dir and new_dir.code != employer.directorate_code:
                audit(db, admin, 'directorate.changed', 'employer', employer.id, {'from': employer.directorate_code, 'to': new_dir.code, 'ein': employer.ein})
                employer.directorate_code = new_dir.code
                text += f' Now served by {new_dir.name}; Employer No. {employer.ein} remains unchanged.'
        r.events.append(ChangeRequestEvent(text=text, actor='ESSI'))
    audit(db, admin, 'change_request.' + status.lower().replace(' ', '_'), 'change_request', r.ref, {'field': r.field})
    user = employer.users[0]
    send_message(db, f'Change request {r.ref}: {status}', f'ESSI Sindh: Your request to change {label} ({r.ref}) is now "{status}".'
                 + (f' Remarks: {r.remarks}' if r.remarks and status == REJECTED else ''), user.mobile, user.email, employer.id)
    db.commit()
    return r
