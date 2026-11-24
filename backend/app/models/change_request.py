"""Requests to change registered company details (reviewed by ESSI)."""
from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin

# Fields an employer may ask to change: key -> (label, supporting document, document required)
CHANGEABLE_FIELDS: dict[str, tuple[str, str, bool]] = {
    'name': ('Employer Name', 'Amended SECP certificate or registration letter', True),
    'business_type': ('Business Type', 'SECP certificate showing the new business type', True),
    'industry_code': ('Industry Classification', 'Proof of the change in principal business activity (amended SECP / NTN record)', True),
    'secp_no': ('SECP Certificate No.', 'New SECP certificate', True),
    'ntn': ('NTN', 'NTN certificate', True),
    'srb_no': ('SRB Registration No.', 'SRB registration certificate', True),
    'address': ('Business Address', 'Recent utility bill showing the new address', True),
    'district': ('District', 'Recent utility bill showing the new address', True),
    'gps': ('GPS Location', 'Optional: photo of the premises', False),
    'contact_person': ('Contact Person', 'Optional: authority letter', False),
    'designation': ('Designation', 'Optional', False),
    'contact_mobile': ('Mobile No.', 'Optional', False),
    'contact_email': ('Email Address', 'Optional', False),
    'office_phone': ('Office Phone', 'Optional', False),
}

PENDING_REVIEW = 'Pending Review'
UNDER_REVIEW = 'Under Review'
APPROVED = 'Approved'
REJECTED = 'Rejected'


class ChangeRequest(TimestampMixin, Base):
    __tablename__ = 'change_requests'

    id: Mapped[int] = mapped_column(primary_key=True)
    ref: Mapped[str] = mapped_column(String(20), unique=True)  # CR-2026-0001
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), index=True)
    field: Mapped[str] = mapped_column(String(30))
    old_value: Mapped[str | None] = mapped_column(String(300))
    new_value: Mapped[str] = mapped_column(String(300))
    reason: Mapped[str] = mapped_column(Text)
    document: Mapped[str | None] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(20), default=PENDING_REVIEW, index=True)
    remarks: Mapped[str | None] = mapped_column(Text)
    submitted_by: Mapped[str] = mapped_column(String(120))

    events: Mapped[list['ChangeRequestEvent']] = relationship(back_populates='request', order_by='ChangeRequestEvent.id')


class ChangeRequestEvent(TimestampMixin, Base):
    __tablename__ = 'change_request_events'

    id: Mapped[int] = mapped_column(primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey('change_requests.id'), index=True)
    text: Mapped[str] = mapped_column(Text)
    actor: Mapped[str] = mapped_column(String(20))  # Employer | ESSI

    request: Mapped[ChangeRequest] = relationship(back_populates='events')
