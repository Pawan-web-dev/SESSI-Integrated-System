"""Employees of an establishment."""
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models import ContributionLine, Employee, EmployeeDependent, Employer
from app.models.workforce import EMPLOYMENT_TYPES
from app.schemas.employer import DependentIn, EmployeeIn
from app.services.errors import NotFound, ServiceError
from app.services.formatting import format_cnic, format_mobile
from app.services.notify import audit
from app.services.worker_no import link_employee, number_dependents


def list_employees(db: Session, employer: Employer) -> list[Employee]:
    return list(db.scalars(select(Employee).options(selectinload(Employee.dependents)).where(Employee.employer_id == employer.id).order_by(Employee.id)))


def get_employee(db: Session, employer: Employer, employee_id: int) -> Employee:
    emp = db.get(Employee, employee_id)
    if not emp or emp.employer_id != employer.id:
        raise NotFound('Employee not found.')
    return emp


def _clean(db: Session, employer: Employer, data: EmployeeIn, current_id: int | None) -> dict:
    cnic = format_cnic(data.cnic)
    if not cnic:
        raise ServiceError('CNIC must have 13 digits, for example 42101-1234567-1.')
    mobile = format_mobile(data.mobile)
    if not mobile:
        raise ServiceError('Enter a valid mobile number, for example 0300-1234567.')
    if data.photo and not data.photo.startswith('data:image/'):
        raise ServiceError('The photo must be an image.')
    if data.employment_type not in EMPLOYMENT_TYPES:
        raise ServiceError('Employment type must be one of: ' + ', '.join(EMPLOYMENT_TYPES) + '.')
    clash = db.scalars(select(Employee).where(Employee.employer_id == employer.id, Employee.cnic == cnic)).first()
    if clash and clash.id != current_id:
        raise ServiceError('This CNIC is already registered.', 409)
    values = data.model_dump(exclude={'dependents'})
    values.update(cnic=cnic, mobile=mobile, full_name=data.full_name.strip(), father_name=data.father_name.strip())
    return values


def _clean_dependent(d: DependentIn) -> dict:
    name = ' '.join(d.name.split())
    relation = ' '.join(d.relation.split())
    if not name or not relation:
        raise ServiceError('Every dependent needs a name and a relationship.')
    cnic = (d.cnic or '').strip()
    if cnic in ('-', '—'):
        cnic = ''
    # a 13-digit number is a CNIC (or B-Form) and is stored in the standard 00000-0000000-0 form
    if cnic and len(''.join(ch for ch in cnic if ch.isdigit())) == 13 and not any(ch.isalpha() for ch in cnic):
        cnic = format_cnic(cnic) or cnic
    if d.photo and not d.photo.startswith('data:image/'):
        raise ServiceError(f'The photo of {name} must be an image.')
    return {'name': name, 'relation': relation, 'cnic': cnic or None, 'date_of_birth': d.date_of_birth, 'gender': d.gender,
            'photo': d.photo or None, 'source': d.source}


def replace_dependents(emp: Employee, items: list[DependentIn]) -> None:
    """Make the employee's dependents exactly `items`: rows with a known `id` are updated, new rows added, the rest removed."""
    cleaned = [(d.id, _clean_dependent(d)) for d in items]
    existing = {d.id: d for d in emp.dependents}
    keep: list[EmployeeDependent] = []
    for dep_id, values in cleaned:
        row = existing.get(dep_id) if dep_id else None
        if row is None:
            row = EmployeeDependent(**values)
        else:
            for key, value in values.items():
                setattr(row, key, value)
        keep.append(row)
    emp.dependents = keep


def add_dependent(db: Session, emp: Employee, data: DependentIn, actor: str) -> EmployeeDependent:
    row = EmployeeDependent(**_clean_dependent(data))
    emp.dependents.append(row)
    db.flush()
    number_dependents(db, emp)
    audit(db, actor, 'dependent.created', 'employee', emp.id, {'dependent': row.id, 'name': row.name})
    db.commit()
    return row


def update_dependent(db: Session, row: EmployeeDependent, data: DependentIn, actor: str) -> EmployeeDependent:
    for key, value in _clean_dependent(data).items():
        setattr(row, key, value)
    audit(db, actor, 'dependent.updated', 'employee', row.employee_id, {'dependent': row.id})
    db.commit()
    return row


def delete_dependent(db: Session, row: EmployeeDependent, actor: str) -> None:
    audit(db, actor, 'dependent.deleted', 'employee', row.employee_id, {'dependent': row.id, 'name': row.name})
    db.delete(row)
    db.commit()


def create_employee(db: Session, employer: Employer, data: EmployeeIn, actor: str) -> Employee:
    emp = Employee(employer_id=employer.id, status='Active', **_clean(db, employer, data, None))
    if data.dependents is not None:
        replace_dependents(emp, data.dependents)
    db.add(emp)
    db.flush()
    link_employee(db, employer, emp, actor)  # an existing worker (same CNIC) keeps their number; a new one gets one
    number_dependents(db, emp)
    audit(db, actor, 'employee.created', 'employee', emp.id, {'cnic': emp.cnic, 'worker_no': emp.worker_no})
    db.commit()
    return emp


def update_employee(db: Session, employer: Employer, emp: Employee, data: EmployeeIn, actor: str) -> Employee:
    for key, value in _clean(db, employer, data, emp.id).items():
        setattr(emp, key, value)
    if data.dependents is not None:
        replace_dependents(emp, data.dependents)
    db.flush()
    link_employee(db, employer, emp, actor)
    number_dependents(db, emp)
    audit(db, actor, 'employee.updated', 'employee', emp.id)
    db.commit()
    return emp


def set_status(db: Session, emp: Employee, status: str, actor: str) -> Employee:
    old = emp.status
    emp.status = status
    audit(db, actor, 'employee.status', 'employee', emp.id, {'from': old, 'to': status})
    db.commit()
    return emp


def delete_employee(db: Session, emp: Employee, actor: str) -> None:
    """Only employees never included in a contribution can be deleted; others must be marked Separated."""
    used = db.scalars(select(ContributionLine.id).where(ContributionLine.employee_id == emp.id)).first()
    if used:
        raise ServiceError('This employee appears in a submitted contribution and cannot be deleted. Mark the employee as Separated instead.', 409)
    audit(db, actor, 'employee.deleted', 'employee', emp.id, {'cnic': emp.cnic, 'name': emp.full_name})
    db.delete(emp)
    db.commit()
