"""ESSI officers: sign-in, dashboard, establishments and workers (with dependents), registration review (issues the EIN), change-request review, audit trail."""
from fastapi import APIRouter, Query, status as http_status
from fastapi.responses import FileResponse
from sqlalchemy import select

from app.api.deps import DB, CurrentAdmin, admin_actor
from app.models import AuditLog, Employer
from app.models.change_request import PENDING_REVIEW
from app.schemas.admin import AdminDashboardOut, AdminEmployerDetailOut, AdminEmployerOut, AdminWorkerDetailOut, AdminWorkerListOut
from app.schemas.common import AdminLoginIn, AuditOut, Message, TokenOut
from app.schemas.employer import ChangeRequestDecisionIn, ChangeRequestOut, DependentIn, DependentOut
from app.schemas.partner import EligibilityOut, PartnerKeyCreatedOut, PartnerKeyIn, PartnerKeyOut
from app.schemas.registration import ApplicationDetailOut, ApplicationListOut, ProgressIn, RejectIn
from app.services import admin_overview, auth, change_requests, eligibility, employees, partner_keys, registration
from app.services.files import file_path
from app.services.notify import audit

router = APIRouter(prefix='/admin')


@router.post('/login', response_model=TokenOut, tags=['Admin'])
def login(body: AdminLoginIn, db: DB):
    token, admin = auth.login_admin(db, body.username, body.password)
    return TokenOut(access_token=token, name=admin.full_name, role=admin.role)


# ---------------------------------------------------------------- dashboard
@router.get('/dashboard', response_model=AdminDashboardOut, tags=['Admin – overview'])
def dashboard(admin: CurrentAdmin, db: DB):
    """Headline figures: establishments, employees, dependents, contributions and the last 6 months."""
    return admin_overview.dashboard(db)


# ---------------------------------------------------------------- establishments and workers
@router.get('/employers', response_model=list[AdminEmployerOut], tags=['Admin – establishments'])
def list_employers(admin: CurrentAdmin, db: DB, q: str = Query('', max_length=100),
                   status: str | None = Query(None, pattern='^(pending|approved|rejected|closed)$')):
    return admin_overview.list_employers(db, q, status)


@router.get('/employers/{employer_id}', response_model=AdminEmployerDetailOut, tags=['Admin – establishments'])
def get_employer(employer_id: int, admin: CurrentAdmin, db: DB):
    return admin_overview.employer_detail(db, employer_id)


@router.get('/employees', response_model=AdminWorkerListOut, tags=['Admin – workers'])
def list_workers(admin: CurrentAdmin, db: DB, q: str = Query('', max_length=100), employer_id: int | None = None,
                 status: str | None = Query(None, pattern='^(Active|Inactive|Separated)$'),
                 offset: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200)):
    """Workers of every establishment. `q` matches name, father's name, CNIC (with or without dashes), worker number or establishment."""
    return admin_overview.list_workers(db, q, employer_id, status, offset, limit)


@router.get('/employees/{employee_id}', response_model=AdminWorkerDetailOut, tags=['Admin – workers'])
def get_worker(employee_id: int, admin: CurrentAdmin, db: DB):
    """A worker with all their dependents."""
    return admin_overview.worker_detail(db, admin_overview.get_worker(db, employee_id))


@router.post('/employees/{employee_id}/dependents', response_model=DependentOut, status_code=http_status.HTTP_201_CREATED, tags=['Admin – workers'])
def add_dependent(employee_id: int, body: DependentIn, admin: CurrentAdmin, db: DB):
    emp = admin_overview.get_worker(db, employee_id)
    return employees.add_dependent(db, emp, body, admin_actor(admin))


@router.put('/dependents/{dependent_id}', response_model=DependentOut, tags=['Admin – workers'])
def update_dependent(dependent_id: int, body: DependentIn, admin: CurrentAdmin, db: DB):
    return employees.update_dependent(db, admin_overview.get_dependent(db, dependent_id), body, admin_actor(admin))


@router.delete('/dependents/{dependent_id}', response_model=Message, tags=['Admin – workers'])
def delete_dependent(dependent_id: int, admin: CurrentAdmin, db: DB):
    employees.delete_dependent(db, admin_overview.get_dependent(db, dependent_id), admin_actor(admin))
    return Message(message='Dependent removed.')


# ---------------------------------------------------------------- partner systems (pharmacy, HMIS)
@router.get('/partner-keys', response_model=list[PartnerKeyOut], tags=['Admin – partner access'])
def list_partner_keys(admin: CurrentAdmin, db: DB):
    return partner_keys.list_keys(db)


@router.post('/partner-keys', response_model=PartnerKeyCreatedOut, status_code=http_status.HTTP_201_CREATED, tags=['Admin – partner access'])
def create_partner_key(body: PartnerKeyIn, admin: CurrentAdmin, db: DB):
    """A new key for a pharmacy or hospital system. The key is in this response only: it cannot be shown again."""
    row, key = partner_keys.create_key(db, admin, body.name, body.kind)
    return PartnerKeyCreatedOut(**PartnerKeyOut.model_validate(row).model_dump(), key=key)


@router.post('/partner-keys/{key_id}/revoke', response_model=PartnerKeyOut, tags=['Admin – partner access'])
def revoke_partner_key(key_id: int, admin: CurrentAdmin, db: DB):
    return partner_keys.revoke_key(db, admin, key_id)


@router.get('/eligibility/{number:path}', response_model=EligibilityOut, tags=['Admin – partner access'])
def check_eligibility(number: str, admin: CurrentAdmin, db: DB):
    """The same answer a pharmacy or hospital gets, for officers (e.g. to help a partner over the phone)."""
    return eligibility.check(db, number, admin_actor(admin))


# ---------------------------------------------------------------- registrations
@router.get('/applications', response_model=ApplicationListOut, tags=['Admin – registrations'])
def list_applications(admin: CurrentAdmin, db: DB, status: str = Query('pending', pattern='^(pending|approved|rejected)$')):
    counts, items = registration.list_applications(db, status)
    out = []
    for app in items:
        user = app.employer.users[0] if app.employer.users else None
        out.append({
            'id': app.id, 'app_no': app.app_no, 'status': app.status, 'stage': app.stage, 'employer_name': app.employer.name,
            'applicant': user.full_name if user else app.employer.contact_person, 'cnic': user.cnic if user else '',
            'submitted_at': app.submitted_at, 'employer_no': app.employer.ein, 'rejection_reason': app.rejection_reason,
        })
    return {'counts': counts, 'items': out}


@router.get('/applications/{application_id}', response_model=ApplicationDetailOut, tags=['Admin – registrations'])
def get_application(application_id: int, admin: CurrentAdmin, db: DB):
    """Includes `employer_no_on_approval`: the EIN this establishment will receive."""
    return registration.application_detail(db, registration.get_application(db, application_id))


@router.get('/applications/{application_id}/documents/{document_id}', tags=['Admin – registrations'],
            response_class=FileResponse, responses={200: {'content': {'application/pdf': {}, 'image/png': {}, 'image/jpeg': {}}}})
def view_document(application_id: int, document_id: int, admin: CurrentAdmin, db: DB):
    """The uploaded file, to open in the browser (PDF / image)."""
    doc = registration.get_document(registration.get_application(db, application_id), document_id)
    path = file_path(doc.file)
    audit(db, admin_actor(admin), 'document.viewed', 'application_document', doc.id, {'doc_type': doc.doc_type})
    db.commit()
    return FileResponse(path, media_type=doc.file.content_type, filename=doc.file_name, content_disposition_type='inline')


@router.post('/applications/{application_id}/progress', response_model=ApplicationDetailOut, tags=['Admin – registrations'])
def post_progress(application_id: int, body: ProgressIn, admin: CurrentAdmin, db: DB):
    app = registration.get_application(db, application_id)
    registration.post_progress(db, app, body.stage, body.note, admin_actor(admin))
    return registration.application_detail(db, app)


@router.post('/applications/{application_id}/approve', response_model=ApplicationDetailOut, tags=['Admin – registrations'])
def approve(application_id: int, admin: CurrentAdmin, db: DB):
    """Approve and issue the permanent Employer Identification Number."""
    app = registration.get_application(db, application_id)
    registration.approve(db, app, admin_actor(admin))
    return registration.application_detail(db, app)


@router.post('/applications/{application_id}/reject', response_model=ApplicationDetailOut, tags=['Admin – registrations'])
def reject(application_id: int, body: RejectIn, admin: CurrentAdmin, db: DB):
    app = registration.get_application(db, application_id)
    registration.reject(db, app, body.reason, admin_actor(admin))
    return registration.application_detail(db, app)


# ---------------------------------------------------------------- change requests
@router.get('/change-requests', response_model=list[ChangeRequestOut], tags=['Admin – change requests'])
def list_change_requests(admin: CurrentAdmin, db: DB, status: str = Query(PENDING_REVIEW)):
    return [change_requests.request_view(db, r) for r in change_requests.list_requests(db, status=status)]


@router.post('/change-requests/{request_id}/decision', response_model=ChangeRequestOut, tags=['Admin – change requests'])
def decide_change_request(request_id: int, body: ChangeRequestDecisionIn, admin: CurrentAdmin, db: DB):
    r = change_requests.get_request(db, request_id)
    change_requests.decide(db, r, body.status, body.remarks, admin_actor(admin))
    return change_requests.request_view(db, r)


# ---------------------------------------------------------------- audit trail
@router.get('/audit', response_model=list[AuditOut], tags=['Admin – audit'])
def audit_trail(admin: CurrentAdmin, db: DB, ein: str | None = Query(None, description='Show entries for one employer'), limit: int = Query(100, le=500)):
    stmt = select(AuditLog).order_by(AuditLog.id.desc()).limit(limit)
    if ein:
        employer = db.scalars(select(Employer).where(Employer.ein == ein)).first()
        if not employer:
            return []
        stmt = stmt.where(((AuditLog.entity == 'employer') & (AuditLog.entity_id == str(employer.id))) | (AuditLog.actor == f'employer:{ein}'))
    return db.scalars(stmt).all()


@router.get('/me', response_model=Message, tags=['Admin'])
def whoami(admin: CurrentAdmin):
    return Message(message=f'Signed in as {admin.full_name} ({admin.role}).')
