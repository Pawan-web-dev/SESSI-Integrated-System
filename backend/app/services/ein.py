"""Employer Identification Number (EIN) – Sindh Employees' Social Security Act, 2016.

    DDD-II-NNNNNN[-BB]
    DDD     Directorate Code             (3 digits)
    II      Industry Classification Code (2 digits)
    NNNNNN  Establishment Serial Number  (6 digits, sequential per Directorate + Industry)
    BB      Branch / Sub-unit Identifier (optional, 2 digits)

Rules:
  * issued once per establishment and permanent (also after an industry change, closure,
    transfer, merger or change of ownership);
  * every issued number is kept in ein_registry and never re-issued;
  * the serial for a Directorate + Industry is taken from ein_sequences under a row lock.
"""
import re
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Directorate, EinRegistry, EinSequence, Employer, IndustryClassification
from app.services.errors import ServiceError

EIN_PATTERN = re.compile(r'^(\d{3})-(\d{2})-(\d{6})(?:-(\d{2}))?$')


@dataclass(frozen=True)
class EinParts:
    directorate: str
    industry: str
    serial: int
    branch: str | None = None


def format_ein(p: EinParts) -> str:
    return f'{p.directorate}-{p.industry}-{p.serial:06d}' + (f'-{p.branch}' if p.branch else '')


def parse_ein(ein: str | None) -> EinParts | None:
    m = EIN_PATTERN.match((ein or '').strip())
    if not m:
        return None
    return EinParts(m.group(1), m.group(2), int(m.group(3)), m.group(4))


def describe_ein(db: Session, ein: str) -> dict | None:
    """Breakdown shown on the company profile."""
    p = parse_ein(ein)
    if not p:
        return None
    directorate = db.get(Directorate, p.directorate)
    industry = db.get(IndustryClassification, p.industry)
    return {
        'ein': ein,
        'directorate_code': p.directorate,
        'directorate': directorate.name if directorate else None,
        'industry_code': p.industry,
        'industry': industry.name if industry else None,
        'serial': f'{p.serial:06d}',
        'branch': p.branch,
    }


def _sequence(db: Session, directorate: str, industry: str, lock: bool) -> EinSequence | None:
    stmt = select(EinSequence).where(EinSequence.directorate_code == directorate, EinSequence.industry_code == industry)
    if lock:
        stmt = stmt.with_for_update()  # PostgreSQL row lock; ignored by SQLite
    return db.scalars(stmt).first()


def preview_next_ein(db: Session, directorate: str, industry: str) -> str:
    seq = _sequence(db, directorate, industry, lock=False)
    return format_ein(EinParts(directorate, industry, (seq.last_serial if seq else 0) + 1))


def issue_ein(db: Session, employer: Employer, issued_by: str) -> str:
    """Give the employer its permanent EIN (returns the existing one if already issued)."""
    existing = db.scalars(select(EinRegistry).where(EinRegistry.employer_id == employer.id)).first()
    if existing:
        employer.ein = existing.ein
        return existing.ein
    if not db.get(Directorate, employer.directorate_code):
        raise ServiceError(f'Unknown Directorate code {employer.directorate_code}.')
    if not db.get(IndustryClassification, employer.industry_code):
        raise ServiceError(f'Unknown Industry Classification code {employer.industry_code}.')

    seq = _sequence(db, employer.directorate_code, employer.industry_code, lock=True)
    if seq is None:
        seq = EinSequence(directorate_code=employer.directorate_code, industry_code=employer.industry_code, last_serial=0)
        db.add(seq)
    serial = seq.last_serial + 1
    ein = format_ein(EinParts(employer.directorate_code, employer.industry_code, serial))
    while db.get(EinRegistry, ein):  # never re-use a number, even one reserved some other way
        serial += 1
        ein = format_ein(EinParts(employer.directorate_code, employer.industry_code, serial))
    seq.last_serial = serial
    db.add(EinRegistry(ein=ein, employer_id=employer.id, issued_by=issued_by))
    employer.ein = ein
    db.flush()
    return ein


def reserve_existing_ein(db: Session, employer: Employer, issued_by: str = 'migration') -> None:
    """Register a number that already exists (data migration / seed) so it is never issued again."""
    p = parse_ein(employer.ein)
    if not p or db.get(EinRegistry, employer.ein):
        return
    db.add(EinRegistry(ein=employer.ein, employer_id=employer.id, issued_by=issued_by))
    seq = _sequence(db, p.directorate, p.industry, lock=True)
    if seq is None:
        db.add(EinSequence(directorate_code=p.directorate, industry_code=p.industry, last_serial=p.serial))
    elif seq.last_serial < p.serial:
        seq.last_serial = p.serial
    db.flush()
