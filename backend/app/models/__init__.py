"""All database models (imported here so Alembic and create_all see every table)."""
from app.models.change_request import ChangeRequest, ChangeRequestEvent
from app.models.contribution import Challan, Contribution, ContributionLine
from app.models.files import StoredFile
from app.models.employer import EinRegistry, EinSequence, Employer, EmployerUser, OneTimeCode
from app.models.master import Directorate, DirectorateDistrict, IndustryClassification
from app.models.registration import ApplicationDocument, ApplicationEvent, RegistrationApplication
from app.models.system import AdminUser, AuditLog, OutboxMessage
from app.models.workforce import Employee, EmployeeDependent

__all__ = [
    'AdminUser',
    'ApplicationDocument',
    'ApplicationEvent',
    'AuditLog',
    'Challan',
    'ChangeRequest',
    'ChangeRequestEvent',
    'Contribution',
    'ContributionLine',
    'Directorate',
    'DirectorateDistrict',
    'EinRegistry',
    'EinSequence',
    'Employee',
    'EmployeeDependent',
    'Employer',
    'EmployerUser',
    'IndustryClassification',
    'OneTimeCode',
    'OutboxMessage',
    'RegistrationApplication',
    'StoredFile',
]
