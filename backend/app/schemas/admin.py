"""Admin panel: dashboard figures, establishments and their workers (with dependents)."""
from datetime import date, datetime

from pydantic import BaseModel

from app.schemas.employer import DependentOut


class LabelValue(BaseModel):
    label: str
    value: int


class TrendPoint(BaseModel):
    month: str
    registrations: int
    employees: int


class TopEmployer(BaseModel):
    id: int
    name: str
    ein: str | None
    employees: int


class AdminDashboardOut(BaseModel):
    employers: dict[str, int]
    employers_total: int
    pending_applications: int
    employees: dict[str, int]
    employees_total: int
    dependents_total: int
    pending_change_requests: int
    contributions_this_month: int
    collected_total: int
    outstanding_total: int
    unpaid_challans: int
    employees_by_type: list[LabelValue]
    employees_by_gender: list[LabelValue]
    trend: list[TrendPoint]
    top_employers: list[TopEmployer]


class AdminWorkerOut(BaseModel):
    id: int
    worker_no: str | None
    full_name: str
    father_name: str
    cnic: str
    gender: str
    mobile: str
    designation: str
    employment_type: str
    status: str
    photo: str | None
    employer_id: int
    employer_name: str
    employer_ein: str | None
    dependents: int


class AdminWorkerListOut(BaseModel):
    total: int
    items: list[AdminWorkerOut]


class AdminWorkerDetailOut(AdminWorkerOut):
    date_of_birth: date | None
    skill_level: str | None
    wage_type: str | None
    payment_frequency: str | None
    date_joined: date | None
    monthly_wage: int | None
    bank_account: str | None
    dependents_list: list[DependentOut]


class AdminEmployerOut(BaseModel):
    id: int
    ein: str | None
    name: str
    status: str
    business_type: str
    industry: str
    district: str
    contact_person: str
    contact_mobile: str
    contact_email: str
    approved_at: datetime | None
    created_at: datetime
    employees: int
    active_employees: int


class AdminEmployerDetailOut(AdminEmployerOut):
    address: str
    directorate: str
    secp_no: str
    ntn: str
    srb_no: str
    designation: str | None
    office_phone: str | None
    employees_list: list[AdminWorkerOut]
