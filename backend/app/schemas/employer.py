"""Request / response shapes for the employer area (profile, employees, contributions, payments, change requests)."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class EinOut(BaseModel):
    ein: str
    directorate_code: str
    directorate: str | None
    industry_code: str
    industry: str | None
    serial: str
    branch: str | None


class EmployerProfileOut(BaseModel):
    id: int
    ein: str
    ein_breakdown: EinOut
    status: str
    name: str
    business_type: str
    industry_code: str
    industry: str
    directorate_code: str
    directorate: str
    secp_no: str
    ntn: str
    srb_no: str
    address: str
    district: str
    province: str
    gps: str | None
    contact_person: str
    designation: str | None
    contact_mobile: str
    contact_email: str
    office_phone: str | None
    approved_at: datetime | None
    user_name: str
    user_designation: str | None


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str


# ---------------------------------------------------------------- employees
class DependentIn(BaseModel):
    """A family member of the employee. `id` keeps an existing record when the list is saved again."""

    id: int | None = None
    name: str = Field(min_length=1, max_length=120)
    relation: str = Field(min_length=1, max_length=40, examples=['Spouse'])
    cnic: str | None = Field(default=None, max_length=30, description='CNIC or B-Form number, if the person has one')
    date_of_birth: date | None = None
    gender: str | None = Field(default=None, pattern='^(MALE|FEMALE|TRANSGENDER)$')
    photo: str | None = Field(default=None, max_length=300_000, description='data:image/jpeg;base64,… (about 200x200)')
    source: str = Field(default='Manual', pattern='^(FRC|Manual|NADRA)$')


class DependentOut(DependentIn):
    model_config = ConfigDict(from_attributes=True)

    id: int


class EmployeeIn(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    father_name: str = Field(min_length=2, max_length=120)
    gender: str = Field(pattern='^(MALE|FEMALE|TRANSGENDER)$')
    cnic: str
    date_of_birth: date | None = None
    mobile: str
    designation: str = Field(min_length=2, max_length=80)
    skill_level: str | None = None
    employment_type: str = Field(examples=['Permanent'])
    wage_type: str | None = None
    payment_frequency: str | None = None
    date_joined: date | None = None
    monthly_wage: int | None = Field(default=None, ge=0)
    bank_account: str | None = None
    photo: str | None = Field(default=None, max_length=300_000, description='data:image/jpeg;base64,… (about 200x200)')
    dependents: list[DependentIn] | None = Field(default=None, max_length=30, description='Family members. Leave out to keep the saved list; send [] to remove all.')


class EmployeeOut(EmployeeIn):
    model_config = ConfigDict(from_attributes=True)

    id: int
    status: str
    dependents: list[DependentOut] = []


class EmployeeStatusIn(BaseModel):
    status: str = Field(pattern='^(Active|Inactive|Separated)$')


# ---------------------------------------------------------------- contributions and challans
class ContributionLineIn(BaseModel):
    employee_id: int
    days: int = Field(default=30, ge=0, le=31)
    wage: int | None = Field(default=None, ge=0, description='Defaults to the employee monthly wage')


class ContributionIn(BaseModel):
    month: str = Field(pattern=r'^\d{4}-\d{2}$', examples=['2026-11'])
    lines: list[ContributionLineIn] | None = Field(default=None, description='Defaults to all active employees, 30 days')


class ContributionLineOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    employee_id: int | None
    worker_name: str
    cnic: str
    mobile: str | None
    employment_type: str
    wage: int
    days: int
    amount: int


class ChallanOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    challan_no: str
    month: str
    amount: int
    service_charges: int
    payable_now: int
    due_date: date
    status: str
    paid_at: datetime | None
    days_late: int | None
    late_increase: int | None
    total_paid: int | None
    receipt_no: str | None
    payment_channel: str | None
    transaction_ref: str | None


class ContributionOut(BaseModel):
    id: int
    ref: str
    month: str
    workers: int
    total_wages: int
    amount: int
    status: str
    submitted_at: datetime
    challan: ChallanOut | None


class ContributionDetailOut(ContributionOut):
    lines: list[ContributionLineOut]


class PayIn(BaseModel):
    channel: str = Field(default='1Bill', max_length=20)


class ReceiptOut(BaseModel):
    receipt_no: str
    challan_no: str
    month: str
    employer_no: str
    employer_name: str
    directorate: str
    workers: int
    contribution: int
    service_charges: int
    days_late: int
    late_increase: int
    total_paid: int
    total_in_words: str
    paid_at: datetime
    due_date: date
    payment_channel: str
    transaction_ref: str


class F4Out(BaseModel):
    """F-4 return with its C-1 worker schedule and the data for the employer's declaration."""

    form: str = 'F-4'
    month: str
    ref: str
    employer_no: str
    employer_name: str
    industry: str
    directorate: str
    address: str
    ntn: str
    declarant: str
    designation: str | None
    workers: int
    total_wages: int
    contribution: int
    service_charges: int
    total: int
    total_in_words: str
    receipt_no: str | None
    lines: list[ContributionLineOut]


class ContributionPreviewOut(BaseModel):
    month: str
    workers: int
    total_wages: int
    amount: int
    service_charges: int
    total: int
    lines: list[ContributionLineOut]


class NotificationOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    subject: str
    body: str
    created_at: datetime


class DashboardOut(BaseModel):
    employees: dict[str, int]
    contributions_last_6_months: list[dict]
    outstanding: int
    next_due: date | None
    last_payment: datetime | None


# ---------------------------------------------------------------- change requests
class ChangeRequestIn(BaseModel):
    field: str = Field(examples=['industry_code'])
    new_value: str = Field(min_length=1, max_length=300)
    reason: str = Field(min_length=10, max_length=1000)
    document: str | None = Field(default=None, max_length=200, description='Supporting document file name')


class ChangeRequestEventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    text: str
    actor: str
    created_at: datetime


class ChangeRequestOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ref: str
    field: str
    label: str
    old_value: str | None
    new_value: str
    reason: str
    document: str | None
    status: str
    remarks: str | None
    submitted_by: str
    created_at: datetime
    events: list[ChangeRequestEventOut]


class ChangeRequestDecisionIn(BaseModel):
    status: str = Field(pattern='^(Under Review|Approved|Rejected)$')
    remarks: str | None = Field(default=None, max_length=1000)
