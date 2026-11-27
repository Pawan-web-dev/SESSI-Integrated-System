"""Admin panel read models: dashboard figures, registered establishments, and every establishment's workers."""
from datetime import date

from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session, selectinload

from app.models import Challan, ChangeRequest, Contribution, Employee, EmployeeDependent, Employer, RegistrationApplication, Worker
from app.models.change_request import PENDING_REVIEW
from app.services.errors import NotFound


def _month_start(d: date, back: int = 0) -> date:
    m = d.month - 1 - back
    return date(d.year + m // 12, m % 12 + 1, 1)


def dashboard(db: Session) -> dict:
    today = date.today()
    count = lambda stmt: db.scalar(stmt) or 0  # noqa: E731

    employers = {s: 0 for s in ('approved', 'pending', 'rejected', 'closed')}
    for s, n in db.execute(select(Employer.status, func.count()).group_by(Employer.status)):
        employers[s] = n
    employees = {s: 0 for s in ('Active', 'Inactive', 'Separated')}
    for s, n in db.execute(select(Employee.status, func.count()).group_by(Employee.status)):
        employees[s] = n
    by_type = [{'label': t, 'value': n} for t, n in db.execute(
        select(Employee.employment_type, func.count()).where(Employee.status == 'Active').group_by(Employee.employment_type).order_by(func.count().desc()))]
    by_gender = [{'label': g, 'value': n} for g, n in db.execute(select(Employee.gender, func.count()).group_by(Employee.gender).order_by(func.count().desc()))]

    # registrations and new employees in each of the last 6 months
    first = _month_start(today, 5)
    months = [_month_start(today, k) for k in range(5, -1, -1)]
    regs = dict.fromkeys(months, 0)
    for (submitted,) in db.execute(select(RegistrationApplication.submitted_at).where(RegistrationApplication.submitted_at >= first)):
        key = date(submitted.year, submitted.month, 1)
        if key in regs:
            regs[key] += 1
    joined = dict.fromkeys(months, 0)
    for (created,) in db.execute(select(Employee.created_at).where(Employee.created_at >= first)):
        key = date(created.year, created.month, 1)
        if key in joined:
            joined[key] += 1
    trend = [{'month': m.strftime('%b %Y'), 'registrations': regs[m], 'employees': joined[m]} for m in months]

    top = db.execute(
        select(Employer.id, Employer.name, Employer.ein, func.count(Employee.id).label('n'))
        .join(Employee, Employee.employer_id == Employer.id).where(Employee.status == 'Active')
        .group_by(Employer.id, Employer.name, Employer.ein).order_by(func.count(Employee.id).desc()).limit(5)
    ).all()

    this_month = _month_start(today)
    return {
        'employers': employers,
        'employers_total': sum(employers.values()),
        'pending_applications': count(select(func.count()).select_from(RegistrationApplication).where(RegistrationApplication.status == 'pending')),
        'employees': employees,
        'employees_total': sum(employees.values()),
        'dependents_total': count(select(func.count()).select_from(EmployeeDependent)),
        'pending_change_requests': count(select(func.count()).select_from(ChangeRequest).where(ChangeRequest.status == PENDING_REVIEW)),
        'contributions_this_month': count(select(func.count()).select_from(Contribution).where(Contribution.month == this_month)),
        'collected_total': count(select(func.sum(Challan.total_paid)).where(Challan.status == 'paid')),
        'outstanding_total': count(select(func.sum(Challan.amount + Challan.service_charges)).where(Challan.status == 'unpaid')),
        'unpaid_challans': count(select(func.count()).select_from(Challan).where(Challan.status == 'unpaid')),
        'employees_by_type': by_type,
        'employees_by_gender': by_gender,
        'trend': trend,
        'top_employers': [{'id': r.id, 'name': r.name, 'ein': r.ein, 'employees': r.n} for r in top],
    }


def _counts(db: Session, employer_ids: list[int]) -> tuple[dict[int, int], dict[int, int]]:
    if not employer_ids:
        return {}, {}
    total, active = {}, {}
    for eid, status, n in db.execute(
            select(Employee.employer_id, Employee.status, func.count()).where(Employee.employer_id.in_(employer_ids))
            .group_by(Employee.employer_id, Employee.status)):
        total[eid] = total.get(eid, 0) + n
        if status == 'Active':
            active[eid] = n
    return total, active


def _employer_row(e: Employer, total: dict[int, int], active: dict[int, int]) -> dict:
    return {
        'id': e.id, 'ein': e.ein, 'name': e.name, 'status': e.status, 'business_type': e.business_type, 'industry': e.industry.name if e.industry else '',
        'district': e.district, 'contact_person': e.contact_person, 'contact_mobile': e.contact_mobile, 'contact_email': e.contact_email,
        'approved_at': e.approved_at, 'created_at': e.created_at, 'employees': total.get(e.id, 0), 'active_employees': active.get(e.id, 0),
    }


def list_employers(db: Session, q: str = '', status: str | None = None) -> list[dict]:
    stmt = select(Employer).options(selectinload(Employer.industry)).order_by(Employer.id.desc())
    if status:
        stmt = stmt.where(Employer.status == status)
    if q.strip():
        like = f'%{q.strip()}%'
        stmt = stmt.where(or_(Employer.name.ilike(like), Employer.ein.ilike(like), Employer.contact_person.ilike(like), Employer.district.ilike(like)))
    items = list(db.scalars(stmt))
    total, active = _counts(db, [e.id for e in items])
    return [_employer_row(e, total, active) for e in items]


def employer_detail(db: Session, employer_id: int) -> dict:
    e = db.get(Employer, employer_id)
    if not e:
        raise NotFound('Establishment not found.')
    total, active = _counts(db, [e.id])
    row = _employer_row(e, total, active)
    row.update({
        'address': e.address, 'directorate': e.directorate.name if e.directorate else '', 'secp_no': e.secp_no, 'ntn': e.ntn, 'srb_no': e.srb_no,
        'designation': e.designation, 'office_phone': e.office_phone,
        'employees_list': list_workers(db, employer_id=e.id, limit=1000)['items'],
    })
    return row


def _worker_row(emp: Employee, employer: Employer, dependents: int) -> dict:
    return {
        'id': emp.id, 'worker_no': emp.worker_no, 'full_name': emp.full_name, 'father_name': emp.father_name, 'cnic': emp.cnic, 'gender': emp.gender, 'mobile': emp.mobile,
        'designation': emp.designation, 'employment_type': emp.employment_type, 'status': emp.status, 'photo': emp.photo,
        'employer_id': employer.id, 'employer_name': employer.name, 'employer_ein': employer.ein, 'dependents': dependents,
    }


def list_workers(db: Session, q: str = '', employer_id: int | None = None, status: str | None = None, offset: int = 0, limit: int = 50) -> dict:
    stmt = select(Employee, Employer).join(Employer, Employer.id == Employee.employer_id).outerjoin(Worker, Worker.id == Employee.worker_id)
    if employer_id:
        stmt = stmt.where(Employee.employer_id == employer_id)
    if status:
        stmt = stmt.where(Employee.status == status)
    if q.strip():
        like = f'%{q.strip()}%'
        digits = ''.join(ch for ch in q.split('/')[0] if ch.isdigit())  # a family member's /01 is not part of the search
        conds = [Employee.full_name.ilike(like), Employee.father_name.ilike(like), Employee.cnic.ilike(like), Employer.name.ilike(like),
                 Worker.worker_no.ilike(f'%{q.strip().split("/")[0]}%')]
        if len(digits) >= 4:
            conds.append(func.replace(Employee.cnic, '-', '').like(f'%{digits}%'))
            conds.append(func.replace(Worker.worker_no, '-', '').like(f'%{digits}%'))
        stmt = stmt.where(or_(*conds))
    total = db.scalar(select(func.count()).select_from(stmt.subquery())) or 0
    rows = db.execute(stmt.order_by(Employee.id.desc()).offset(offset).limit(limit)).all()
    ids = [emp.id for emp, _ in rows]
    deps = dict(db.execute(select(EmployeeDependent.employee_id, func.count()).where(EmployeeDependent.employee_id.in_(ids))
                           .group_by(EmployeeDependent.employee_id)).all()) if ids else {}
    return {'total': total, 'items': [_worker_row(emp, er, deps.get(emp.id, 0)) for emp, er in rows]}


def get_worker(db: Session, employee_id: int) -> Employee:
    emp = db.get(Employee, employee_id)
    if not emp:
        raise NotFound('Employee not found.')
    return emp


def worker_detail(db: Session, emp: Employee) -> dict:
    employer = db.get(Employer, emp.employer_id)
    row = _worker_row(emp, employer, len(emp.dependents))
    row.update({
        'date_of_birth': emp.date_of_birth, 'skill_level': emp.skill_level, 'wage_type': emp.wage_type, 'payment_frequency': emp.payment_frequency,
        'date_joined': emp.date_joined, 'monthly_wage': emp.monthly_wage, 'bank_account': emp.bank_account,
        'dependents_list': emp.dependents,
    })
    return row


def get_dependent(db: Session, dependent_id: int) -> EmployeeDependent:
    row = db.get(EmployeeDependent, dependent_id)
    if not row:
        raise NotFound('Dependent not found.')
    return row
