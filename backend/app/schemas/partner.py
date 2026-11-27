"""Partner systems (pharmacy, hospital HMIS): API keys and the eligibility answer."""
from datetime import date, datetime

from pydantic import BaseModel, ConfigDict, Field


class PartnerKeyIn(BaseModel):
    name: str = Field(min_length=2, max_length=120, examples=['Civil Hospital Karachi – HMIS'])
    kind: str = Field(examples=['HMIS'], description='Pharmacy | HMIS | Other')


class PartnerKeyOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    kind: str
    key_prefix: str
    active: bool
    created_by: str
    created_at: datetime
    last_used_at: datetime | None
    revoked_at: datetime | None


class PartnerKeyCreatedOut(PartnerKeyOut):
    key: str = Field(description='The API key. It is shown only once: copy it now and give it to the partner.')


class EligibleEmployer(BaseModel):
    name: str
    ein: str | None
    since: date | None


class FamilyMember(BaseModel):
    id: str | None = Field(examples=['W-26-102-004573-6/01'])
    id_digits: str | None = Field(examples=['26102004573601'])
    name: str
    relation: str
    date_of_birth: date | None


class EligibilityOut(BaseModel):
    id: str = Field(description='Number of the person looked up', examples=['W-26-102-004573-6/02'])
    id_digits: str = Field(description='The same number as digits only', examples=['26102004573602'])
    person: str = Field(description='worker | family member')
    name: str
    relation: str = Field(description='Self for the worker; Wife, Son … for a family member')
    father_name: str | None
    gender: str | None
    date_of_birth: date | None
    cnic_masked: str | None = Field(examples=['*****-***0001-1'])
    photo: str | None = Field(description='Small JPEG as a data URL')
    worker_no: str = Field(examples=['W-26-102-004573-6'])
    worker_no_digits: str = Field(examples=['261020045736'])
    worker_name: str
    eligible: bool
    reason: str
    employers: list[EligibleEmployer]
    last_paid_month: str | None = Field(description='Latest month with a paid contribution for this worker (YYYY-MM)', examples=['2026-10'])
    family: list[FamilyMember] = Field(description='Family members (only when the worker is looked up)')
