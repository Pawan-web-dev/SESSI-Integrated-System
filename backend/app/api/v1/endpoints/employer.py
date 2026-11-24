"""Signed-in employer: profile, employees, contributions (F-4 / C-1), challans, receipts, change requests."""
from fastapi import APIRouter, Query, status
from fastapi.responses import FileResponse
from sqlalchemy import select

from app.api.deps import DB, CurrentEmployer
from app.schemas.common import Message
from app.schemas.employer import (
    ChallanOut, ChangePasswordIn, ChangeRequestIn, ChangeRequestOut, ContributionDetailOut, ContributionIn, ContributionOut,
    ContributionPreviewOut, DashboardOut, EmployeeIn, EmployeeOut, EmployeeStatusIn, EmployerProfileOut, F4Out,
    NotificationOut, PayIn, ReceiptOut,
)
from app.services import auth, change_requests, contributions, employees
from app.models import OutboxMessage, RegistrationApplication
from app.schemas.registration import ApplicationDocumentOut
from app.services import registration
from app.services.errors import NotFound
from app.services.files import file_path
from app.services.ein import describe_ein

router = APIRouter(prefix='/employer')


# ---------------------------------------------------------------- profile
@router.get('/me', response_model=EmployerProfileOut, tags=['Employer'])
def me(session: CurrentEmployer, db: DB):
    e = session.employer
    return {
        'id': e.id, 'ein': e.ein, 'ein_breakdown': describe_ein(db, e.ein), 'status': e.status, 'name': e.name, 'business_type': e.business_type,
        'industry_code': e.industry_code, 'industry': e.industry.name, 'directorate_code': e.directorate_code, 'directorate': e.directorate.name,
        'secp_no': e.secp_no, 'ntn': e.ntn, 'srb_no': e.srb_no, 'address': e.address, 'district': e.district, 'province': e.province,
        'gps': e.gps, 'contact_person': e.contact_person, 'designation': e.designation, 'contact_mobile': e.contact_mobile,
        'contact_email': e.contact_email, 'office_phone': e.office_phone, 'approved_at': e.approved_at, 'user_name': session.user.full_name,
        'user_designation': e.designation,
    }


@router.post('/password', response_model=Message, tags=['Employer'])
def change_password(body: ChangePasswordIn, session: CurrentEmployer, db: DB):
    auth.change_password(db, session.user, body.current_password, body.new_password)
    return Message(message='Your password has been changed.')


@router.get('/notifications', response_model=list[NotificationOut], tags=['Employer'])
def notifications(session: CurrentEmployer, db: DB):
    """SMS / e-mail messages sent to this employer, newest first."""
    stmt = select(OutboxMessage).where(OutboxMessage.employer_id == session.employer.id).order_by(OutboxMessage.id.desc()).limit(100)
    return db.scalars(stmt).all()


def _application(session, db) -> RegistrationApplication | None:
    return db.scalars(select(RegistrationApplication).where(RegistrationApplication.employer_id == session.employer.id)
                      .order_by(RegistrationApplication.id.desc())).first()


@router.get('/documents', response_model=list[ApplicationDocumentOut], tags=['Employer'])
def documents(session: CurrentEmployer, db: DB):
    """Every document type, with the file this employer uploaded at registration (if any)."""
    app = _application(session, db)
    uploaded = {d.doc_type: d for d in app.documents} if app else {}
    out = []
    for key, label in registration.DOCUMENT_LABELS.items():
        d = uploaded.get(key)
        if d:
            out.append(registration.document_view(d, 'Verified' if app.status == 'approved' else 'Uploaded'))
        else:
            out.append({'doc_type': key, 'label': label, 'required': key in registration.REQUIRED_DOCUMENTS, 'file_name': None, 'status': 'Not provided'})
    return out


@router.get('/documents/{document_id}/file', tags=['Employer'], response_class=FileResponse,
            responses={200: {'content': {'application/pdf': {}, 'image/png': {}, 'image/jpeg': {}}}})
def document_file(document_id: int, session: CurrentEmployer, db: DB):
    """One of this employer's own uploaded documents, to open in the browser."""
    app = _application(session, db)
    if not app:
        raise NotFound('Document not found.')
    doc = registration.get_document(app, document_id)
    return FileResponse(file_path(doc.file), media_type=doc.file.content_type, filename=doc.file_name, content_disposition_type='inline')


@router.get('/dashboard', response_model=DashboardOut, tags=['Employer'])
def dashboard(session: CurrentEmployer, db: DB):
    return contributions.dashboard(db, session.employer)


# ---------------------------------------------------------------- employees
@router.get('/employees', response_model=list[EmployeeOut], tags=['Employees'])
def list_employees(session: CurrentEmployer, db: DB):
    return employees.list_employees(db, session.employer)


@router.post('/employees', response_model=EmployeeOut, status_code=status.HTTP_201_CREATED, tags=['Employees'])
def create_employee(body: EmployeeIn, session: CurrentEmployer, db: DB):
    return employees.create_employee(db, session.employer, body, session.actor)


@router.get('/employees/{employee_id}', response_model=EmployeeOut, tags=['Employees'])
def get_employee(employee_id: int, session: CurrentEmployer, db: DB):
    return employees.get_employee(db, session.employer, employee_id)


@router.put('/employees/{employee_id}', response_model=EmployeeOut, tags=['Employees'])
def update_employee(employee_id: int, body: EmployeeIn, session: CurrentEmployer, db: DB):
    emp = employees.get_employee(db, session.employer, employee_id)
    return employees.update_employee(db, session.employer, emp, body, session.actor)


@router.post('/employees/{employee_id}/status', response_model=EmployeeOut, tags=['Employees'])
def set_employee_status(employee_id: int, body: EmployeeStatusIn, session: CurrentEmployer, db: DB):
    emp = employees.get_employee(db, session.employer, employee_id)
    return employees.set_status(db, emp, body.status, session.actor)


@router.delete('/employees/{employee_id}', response_model=Message, tags=['Employees'])
def delete_employee(employee_id: int, session: CurrentEmployer, db: DB):
    emp = employees.get_employee(db, session.employer, employee_id)
    employees.delete_employee(db, emp, session.actor)
    return Message(message='Employee deleted.')


# ---------------------------------------------------------------- contributions (F-4 / C-1)
@router.get('/contributions', response_model=list[ContributionOut], tags=['Contributions'])
def list_contributions(session: CurrentEmployer, db: DB):
    return [contributions.contribution_view(c) for c in contributions.list_contributions(db, session.employer)]


@router.get('/contributions/preview', response_model=ContributionPreviewOut, tags=['Contributions'])
def preview_contribution(session: CurrentEmployer, db: DB, month: str = Query(pattern=r'^\d{4}-\d{2}$', examples=['2026-11'])):
    """Amounts for all active employees (30 days), without submitting."""
    return contributions.preview_contribution(db, session.employer, ContributionIn(month=month))


@router.post('/contributions', response_model=ContributionDetailOut, status_code=status.HTTP_201_CREATED, tags=['Contributions'])
def create_contribution(body: ContributionIn, session: CurrentEmployer, db: DB):
    """Submit the month's contribution; a challan is generated at once."""
    c = contributions.create_contribution(db, session.employer, body, session.actor)
    return contributions.contribution_view(c, with_lines=True)


@router.get('/contributions/{contribution_id}', response_model=ContributionDetailOut, tags=['Contributions'])
def get_contribution(contribution_id: int, session: CurrentEmployer, db: DB):
    return contributions.contribution_view(contributions.get_contribution(db, session.employer, contribution_id), with_lines=True)


@router.get('/contributions/{contribution_id}/f4', response_model=F4Out, tags=['Contributions'])
def f4_return(contribution_id: int, session: CurrentEmployer, db: DB):
    """F-4 return; `lines` is the C-1 worker-wise schedule; declarant fields feed the declaration."""
    return contributions.f4_view(session.employer, contributions.get_contribution(db, session.employer, contribution_id))


# ---------------------------------------------------------------- challans and payments
@router.get('/challans', response_model=list[ChallanOut], tags=['Payments'])
def list_challans(session: CurrentEmployer, db: DB):
    return [contributions.challan_view(c.challan) for c in contributions.list_contributions(db, session.employer) if c.challan]


@router.get('/challans/{challan_no}', response_model=ChallanOut, tags=['Payments'])
def get_challan(challan_no: str, session: CurrentEmployer, db: DB):
    return contributions.challan_view(contributions.get_challan(db, session.employer, challan_no))


@router.post('/challans/{challan_no}/pay', response_model=ReceiptOut, tags=['Payments'])
def pay_challan(challan_no: str, body: PayIn, session: CurrentEmployer, db: DB):
    """Demo payment. In production the 1LINK / bank confirmation records the payment instead."""
    ch = contributions.get_challan(db, session.employer, challan_no)
    contributions.pay_challan(db, session.employer, ch, body.channel, session.actor)
    return contributions.receipt_view(session.employer, ch)


@router.get('/challans/{challan_no}/receipt', response_model=ReceiptOut, tags=['Payments'])
def receipt(challan_no: str, session: CurrentEmployer, db: DB):
    return contributions.receipt_view(session.employer, contributions.get_challan(db, session.employer, challan_no))


# ---------------------------------------------------------------- change requests
@router.get('/change-requests', response_model=list[ChangeRequestOut], tags=['Change requests'])
def list_change_requests(session: CurrentEmployer, db: DB):
    return [change_requests.request_view(db, r) for r in change_requests.list_requests(db, session.employer)]


@router.post('/change-requests', response_model=ChangeRequestOut, status_code=status.HTTP_201_CREATED, tags=['Change requests'])
def create_change_request(body: ChangeRequestIn, session: CurrentEmployer, db: DB):
    r = change_requests.submit_request(db, session.employer, body, session.user.full_name)
    return change_requests.request_view(db, r)


@router.get('/change-requests/{request_id}', response_model=ChangeRequestOut, tags=['Change requests'])
def get_change_request(request_id: int, session: CurrentEmployer, db: DB):
    return change_requests.request_view(db, change_requests.get_request(db, request_id, session.employer))
