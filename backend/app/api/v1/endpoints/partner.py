"""Partner systems (pharmacies, hospital HMIS): check whether a worker or family member is covered by ESSI.

Send the partner key issued by ESSI in the X-API-Key header. The number can be written either way:
    GET /api/v1/eligibility/W-26-102-004573-6        or  /api/v1/eligibility/261020045736        (worker)
    GET /api/v1/eligibility/W-26-102-004573-6-02     or  /api/v1/eligibility/26102004573602      (family member 02)
    GET /api/v1/eligibility/42101-5550001-1                                                     (CNIC)
"""
from fastapi import APIRouter

from app.api.deps import DB, CurrentPartner
from app.schemas.partner import EligibilityOut
from app.services import eligibility

router = APIRouter(prefix='/eligibility', tags=['Partners – eligibility'])


@router.get('/{number:path}', response_model=EligibilityOut)
def check_eligibility(number: str, partner: CurrentPartner, db: DB):
    """Who the person is and whether they are covered today. Accepts a worker number (W-26-102-004573-6 or 261020045736),
    a family member's number (W-26-102-004573-6/02, W-26-102-004573-6-02 or 26102004573602) or a CNIC."""
    return eligibility.check(db, number, f'partner:{partner.id}:{partner.name}'[:120])
