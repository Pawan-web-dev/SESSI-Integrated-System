"""Request / response shapes for registration and application review."""
from datetime import date, datetime

from pydantic import BaseModel, EmailStr, Field

# Mandatory documents (SESSI requirement). gas / deed / logo are optional.
REQUIRED_DOCUMENTS = {
    'secp': 'SECP Certificate',
    'ntn': 'NTN',
    'srb': 'SRB Registration',
    'elec': 'Electricity Bill',
    'cnic': 'Proprietor/Employer CNIC',
    'bank': 'Bank Details',
    'contact': 'Contact Numbers & Email Address',
}
OPTIONAL_DOCUMENTS = {'gas': 'Gas Bill', 'deed': 'Partnership Deed', 'logo': 'Company Logo'}


class ContactCodesIn(BaseModel):
    mobile: str = Field(examples=['0333-1112223'])
    email: EmailStr


class ContactVerifyIn(ContactCodesIn):
    mobile_code: str = Field(min_length=6, max_length=6)
    email_code: str = Field(min_length=6, max_length=6)


class ContactTokenOut(BaseModel):
    contact_token: str


class RegistrationIn(BaseModel):
    contact_token: str = Field(description='From POST /registrations/contact/verify')
    # authorized person (portal login)
    applicant_name: str = Field(min_length=2, max_length=120)
    cnic: str = Field(examples=['42101-1234567-1'])
    mobile: str
    email: EmailStr
    password: str
    # step 1 – business information
    employer_name: str = Field(min_length=2, max_length=200)
    business_address: str = Field(min_length=3, max_length=300)
    business_type: str = Field(min_length=2, max_length=60)
    industry_code: str = Field(min_length=2, max_length=2, examples=['91'])
    district: str = Field(examples=['Malir'])
    secp_no: str = Field(min_length=1, max_length=40)
    ntn: str = Field(min_length=1, max_length=20)
    srb_no: str = Field(min_length=1, max_length=40)
    gps: str = Field(min_length=1, max_length=80)
    # step 2 – documents: type -> file_id returned by POST /registrations/documents
    documents: dict[str, str]
    # step 3 – contact & location
    contact_person: str = Field(min_length=2, max_length=120)
    designation: str = Field(min_length=1, max_length=80)
    contact_mobile: str
    contact_email: EmailStr
    office_phone: str | None = None
    expected_workers: int = Field(ge=1)
    operations_started: date
    # step 4
    declaration_accepted: bool


class StageOut(BaseModel):
    title: str
    description: str
    state: str  # done | current | stopped | waiting


class EventOut(BaseModel):
    code: str
    label: str
    note: str | None
    at: datetime


class ApplicationOut(BaseModel):
    app_no: str
    status: str
    stage: int
    employer_name: str
    employer_no: str | None
    submitted_at: datetime
    rejection_reason: str | None
    stages: list[StageOut]
    events: list[EventOut]


class ApplicationSummaryOut(BaseModel):
    id: int
    app_no: str
    status: str
    stage: int
    employer_name: str
    applicant: str
    cnic: str
    submitted_at: datetime
    employer_no: str | None
    rejection_reason: str | None


class ApplicationListOut(BaseModel):
    counts: dict[str, int]
    items: list[ApplicationSummaryOut]


class ApplicationDocumentOut(BaseModel):
    """A document uploaded with the application. `has_file` is false for types that were not uploaded."""
    id: int | None = None
    doc_type: str
    label: str
    required: bool
    file_name: str | None
    has_file: bool = False
    content_type: str | None = None
    size: int | None = None
    uploaded_at: datetime | None = None
    status: str | None = None  # employer view: Verified | Uploaded | Not provided


class DocumentUploadOut(BaseModel):
    file_id: str = Field(description='Send this as the value for the document type in POST /registrations')
    file_name: str
    content_type: str
    size: int


class ApplicationDetailOut(ApplicationOut):
    id: int
    business_type: str
    industry: str
    industry_code: str
    address: str
    district: str
    directorate: str
    directorate_code: str
    secp_no: str
    ntn: str
    srb_no: str
    applicant: str
    designation: str | None
    cnic: str
    mobile: str
    email: str
    expected_workers: int | None
    documents: list[ApplicationDocumentOut]
    employer_no_on_approval: str


class TrackIn(BaseModel):
    app_no: str
    cnic: str


class ProgressIn(BaseModel):
    stage: int = Field(ge=2, le=3, description='2 = documents verified, 3 = directorate review completed')
    note: str | None = Field(default=None, max_length=500)


class RejectIn(BaseModel):
    reason: str = Field(min_length=5, max_length=500)
