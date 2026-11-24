"""Shared request / response shapes: sign-in, master data, messages."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class Message(BaseModel):
    message: str


class EmployerLoginIn(BaseModel):
    login_id: str = Field(description='Employer No. (EIN), CNIC, e-mail or mobile', examples=['101-10-000001'])
    password: str


class AdminLoginIn(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    name: str
    employer_no: str | None = None
    role: str | None = None


class ResetRequestIn(BaseModel):
    login_id: str


class ResetRequestOut(BaseModel):
    message: str
    sent_to: str


class ResetConfirmIn(BaseModel):
    login_id: str
    code: str = Field(min_length=6, max_length=6)
    new_password: str


class DirectorateOut(BaseModel):
    code: str
    name: str
    districts: list[str]


class IndustryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    code: str
    name: str
    approval_required: bool


class OutboxOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    mobile: str | None
    email: str | None
    subject: str
    body: str
    created_at: datetime


class AuditOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    actor: str
    action: str
    entity: str
    entity_id: str
    details: dict | None
    created_at: datetime
