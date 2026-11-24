"""Employees of an establishment."""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import ContributionLine, Employee, Employer
from app.models.workforce import EMPLOYMENT_TYPES
from app.schemas.employer import EmployeeIn
from app.services.errors import NotFound, ServiceError
from app.services.formatting import format_cnic, format_mobile
from app.services.notify import audit


def list_employees(db: Session, employer: Employer) -> list[Employee]:
    return list(db.scalars(select(Employee).where(Employee.employer_id == employer.id).order_by(Employee.id)))


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
    values = data.model_dump()
    values.update(cnic=cnic, mobile=mobile, full_name=data.full_name.strip(), father_name=data.father_name.strip())
    return values


def create_employee(db: Session, employer: Employer, data: EmployeeIn, actor: str) -> Employee:
    emp = Employee(employer_id=employer.id, status='Active', **_clean(db, employer, data, None))
    db.add(emp)
    db.flush()
    audit(db, actor, 'employee.created', 'employee', emp.id, {'cnic': emp.cnic})
    db.commit()
    return emp


def update_employee(db: Session, employer: Employer, emp: Employee, data: EmployeeIn, actor: str) -> Employee:
    for key, value in _clean(db, employer, data, emp.id).items():
        setattr(emp, key, value)
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
