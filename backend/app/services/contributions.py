"""Monthly contributions (F-4 + C-1), challans, payments and receipts.

Rules (confirm the numbers with SESSI; they are settings in app/core/config.py):
  * contribution per worker = rate × min(wage, ceiling) × days / 30, rounded to whole rupees
  * a challan is generated for every contribution; due date = last day of the contribution month
  * service charges are added to every challan
  * paid after the due date: increase of 0.5% of the contribution per day late, at most 50% (section 24(1))
"""
import calendar
import secrets
from datetime import date, datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.base import as_utc, utcnow
from app.models import Challan, Contribution, ContributionLine, Employee, Employer
from app.schemas.employer import ContributionIn
from app.services.errors import NotFound, ServiceError
from app.services.formatting import amount_in_words, month_label
from app.services.notify import audit, send_message

settings = get_settings()


def contribution_for(wage: int, days: int) -> int:
    return round(settings.contribution_rate * min(wage, settings.contribution_wage_ceiling) * days / 30)


def late_increase(amount: int, due: date, paid_on: date) -> tuple[int, int]:
    """Returns (days late, increase in rupees)."""
    days = max(0, (paid_on - due).days)
    pct = min(days * settings.late_increase_per_day, settings.late_increase_cap)
    return days, round(amount * pct)


def _number(db: Session, model, column, prefix: str, width: int) -> str:
    year = utcnow().year
    while True:
        value = f'{prefix}-{year}-{secrets.randbelow(10 ** width):0{width}d}'
        if not db.scalars(select(model.id).where(column == value)).first():
            return value


def _parse_month(value: str) -> date:
    year, month = (int(x) for x in value.split('-'))
    if not 1 <= month <= 12:
        raise ServiceError('Month must be in the form YYYY-MM.')
    return date(year, month, 1)


def list_contributions(db: Session, employer: Employer) -> list[Contribution]:
    return list(db.scalars(select(Contribution).where(Contribution.employer_id == employer.id).order_by(Contribution.month.desc())))


def get_contribution(db: Session, employer: Employer, contribution_id: int) -> Contribution:
    c = db.get(Contribution, contribution_id)
    if not c or c.employer_id != employer.id:
        raise NotFound('Contribution not found.')
    return c


def _lines(db: Session, employer: Employer, data: ContributionIn, today: date) -> tuple[date, list[tuple[Employee, int, int]]]:
    """Check the month and return the workers to include: (employee, days, wage)."""
    month = _parse_month(data.month)
    if month > today.replace(day=1):
        raise ServiceError('You cannot submit a contribution for a future month.')
    if db.scalars(select(Contribution.id).where(Contribution.employer_id == employer.id, Contribution.month == month)).first():
        raise ServiceError(f'A contribution for {month_label(month)} has already been submitted.', 409)

    employees = {e.id: e for e in db.scalars(select(Employee).where(Employee.employer_id == employer.id))}
    if data.lines is None:
        wanted = [(e, 30, e.monthly_wage) for e in employees.values() if e.status == 'Active']
    else:
        wanted = []
        for line in data.lines:
            emp = employees.get(line.employee_id)
            if not emp:
                raise ServiceError(f'Employee {line.employee_id} does not belong to this employer.')
            wanted.append((emp, line.days, line.wage if line.wage is not None else emp.monthly_wage))
    if not wanted:
        raise ServiceError('Add at least one active employee before submitting a contribution.')
    missing_wage = [e.full_name for e, _, wage in wanted if wage is None]
    if missing_wage:
        raise ServiceError('Enter the monthly wage for: ' + ', '.join(missing_wage) + '.')
    return month, wanted


def preview_contribution(db: Session, employer: Employer, data: ContributionIn) -> dict:
    """What the contribution would be, without saving it (Create Contribution screen)."""
    month, wanted = _lines(db, employer, data, utcnow().date())
    lines = [{'employee_id': e.id, 'worker_name': e.full_name, 'cnic': e.cnic, 'mobile': e.mobile, 'employment_type': e.employment_type,
              'wage': wage, 'days': days, 'amount': contribution_for(wage, days)} for e, days, wage in wanted]
    amount = sum(x['amount'] for x in lines)
    return {'month': month_label(month), 'workers': len(lines), 'total_wages': sum(x['wage'] for x in lines), 'amount': amount,
            'service_charges': settings.service_charges, 'total': amount + settings.service_charges, 'lines': lines}


def create_contribution(db: Session, employer: Employer, data: ContributionIn, actor: str, submitted_at: datetime | None = None) -> Contribution:
    month, wanted = _lines(db, employer, data, (submitted_at or utcnow()).date())

    c = Contribution(ref=_number(db, Contribution, Contribution.ref, 'CNTR', 5), employer_id=employer.id, month=month, workers=len(wanted),
                     total_wages=0, amount=0, status='approved', submitted_at=submitted_at or utcnow())
    for emp, days, wage in wanted:
        amount = contribution_for(wage, days)
        c.lines.append(ContributionLine(employee_id=emp.id, worker_name=emp.full_name, cnic=emp.cnic, mobile=emp.mobile,
                                        employment_type=emp.employment_type, wage=wage, days=days, amount=amount))
        c.total_wages += wage
        c.amount += amount
    db.add(c)
    db.flush()
    due = date(month.year, month.month, calendar.monthrange(month.year, month.month)[1])
    challan = Challan(challan_no=_number(db, Challan, Challan.challan_no, 'CH', 6), employer_id=employer.id, contribution_id=c.id,
                      amount=c.amount, service_charges=settings.service_charges, due_date=due, status='unpaid')
    db.add(challan)
    db.flush()
    user = employer.users[0]
    send_message(
        db, 'Contribution submitted',
        f'ESSI Sindh: Contribution for {month_label(month)} ({c.workers} workers) is approved. Challan {challan.challan_no} for '
        f'PKR {c.amount + challan.service_charges:,} is due by {due:%d-%b-%Y}.',
        user.mobile, user.email, employer.id,
    )
    audit(db, actor, 'contribution.submitted', 'contribution', c.ref, {'month': data.month, 'workers': c.workers, 'amount': c.amount})
    db.commit()
    return c


def get_challan(db: Session, employer: Employer, challan_no: str) -> Challan:
    ch = db.scalars(select(Challan).where(Challan.challan_no == challan_no)).first()
    if not ch or ch.employer_id != employer.id:
        raise NotFound('Challan not found.')
    return ch


def payable_now(ch: Challan, on: date | None = None) -> int:
    if ch.status == 'paid':
        return ch.total_paid or 0
    _, inc = late_increase(ch.amount, ch.due_date, on or utcnow().date())
    return ch.amount + ch.service_charges + inc


def pay_challan(db: Session, employer: Employer, ch: Challan, channel: str, actor: str, paid_at: datetime | None = None) -> Challan:
    """Record a payment (in production this is called by the 1LINK / bank confirmation, not by the employer)."""
    if ch.status == 'paid':
        raise ServiceError(f'Challan {ch.challan_no} is already paid.', 409)
    paid_at = paid_at or utcnow()
    days, inc = late_increase(ch.amount, ch.due_date, as_utc(paid_at).date())
    ch.status = 'paid'
    ch.paid_at = paid_at
    ch.days_late, ch.late_increase = days, inc
    ch.total_paid = ch.amount + ch.service_charges + inc
    ch.receipt_no = _number(db, Challan, Challan.receipt_no, 'RCP', 6)
    ch.payment_channel = channel
    ch.transaction_ref = f'1L-{paid_at:%Y%m%d}-{secrets.randbelow(10 ** 7):07d}'
    user = employer.users[0]
    send_message(
        db, 'Payment received',
        f'ESSI Sindh: Payment of PKR {ch.total_paid:,} for {month_label(ch.contribution.month)} received. Receipt {ch.receipt_no}.'
        + (f' Includes PKR {inc:,} increase for {days} days late payment.' if inc else ''),
        user.mobile, user.email, employer.id,
    )
    audit(db, actor, 'challan.paid', 'challan', ch.challan_no, {'total': ch.total_paid, 'days_late': days, 'receipt': ch.receipt_no})
    db.commit()
    return ch


# ---------------------------------------------------------------- views
def challan_view(ch: Challan) -> dict:
    return {
        'challan_no': ch.challan_no, 'month': month_label(ch.contribution.month), 'amount': ch.amount, 'service_charges': ch.service_charges,
        'payable_now': payable_now(ch), 'due_date': ch.due_date, 'status': ch.status, 'paid_at': ch.paid_at, 'days_late': ch.days_late,
        'late_increase': ch.late_increase, 'total_paid': ch.total_paid, 'receipt_no': ch.receipt_no, 'payment_channel': ch.payment_channel,
        'transaction_ref': ch.transaction_ref,
    }


def contribution_view(c: Contribution, with_lines: bool = False) -> dict:
    out = {
        'id': c.id, 'ref': c.ref, 'month': month_label(c.month), 'workers': c.workers, 'total_wages': c.total_wages, 'amount': c.amount,
        'status': c.status, 'submitted_at': c.submitted_at, 'challan': challan_view(c.challan) if c.challan else None,
    }
    if with_lines:
        out['lines'] = list(c.lines)
    return out


def receipt_view(employer: Employer, ch: Challan) -> dict:
    if ch.status != 'paid':
        raise ServiceError('This challan is not paid yet, so there is no receipt.', 409)
    return {
        'receipt_no': ch.receipt_no, 'challan_no': ch.challan_no, 'month': month_label(ch.contribution.month), 'employer_no': employer.ein,
        'employer_name': employer.name, 'directorate': employer.directorate.name, 'workers': ch.contribution.workers, 'contribution': ch.amount,
        'service_charges': ch.service_charges, 'days_late': ch.days_late or 0, 'late_increase': ch.late_increase or 0,
        'total_paid': ch.total_paid, 'total_in_words': amount_in_words(ch.total_paid or 0), 'paid_at': ch.paid_at, 'due_date': ch.due_date,
        'payment_channel': ch.payment_channel, 'transaction_ref': ch.transaction_ref,
    }


def f4_view(employer: Employer, c: Contribution) -> dict:
    ch = c.challan
    total = c.amount + (ch.service_charges if ch else 0)
    user = employer.users[0]
    return {
        'month': month_label(c.month), 'ref': c.ref, 'employer_no': employer.ein, 'employer_name': employer.name, 'industry': employer.industry.name,
        'directorate': employer.directorate.name, 'address': employer.address, 'ntn': employer.ntn, 'declarant': user.full_name,
        'designation': employer.designation, 'workers': c.workers, 'total_wages': c.total_wages, 'contribution': c.amount,
        'service_charges': ch.service_charges if ch else 0, 'total': total, 'total_in_words': amount_in_words(total),
        'receipt_no': ch.receipt_no if ch else None, 'lines': list(c.lines),
    }


def dashboard(db: Session, employer: Employer) -> dict:
    counts: dict[str, int] = {}
    for e in db.scalars(select(Employee).where(Employee.employer_id == employer.id)):
        counts[e.status] = counts.get(e.status, 0) + 1
        if e.status == 'Active':
            counts[e.employment_type] = counts.get(e.employment_type, 0) + 1
    contributions = list_contributions(db, employer)
    unpaid = [c.challan for c in contributions if c.challan and c.challan.status == 'unpaid']
    paid = [c.challan.paid_at for c in contributions if c.challan and c.challan.paid_at]
    return {
        'employees': counts,
        'contributions_last_6_months': [{'month': month_label(c.month), 'amount': c.amount, 'paid': bool(c.challan and c.challan.status == 'paid')}
                                        for c in reversed(contributions[:6])],
        'outstanding': sum(payable_now(ch) for ch in unpaid),
        'next_due': min((ch.due_date for ch in unpaid), default=None),
        'last_payment': max(paid, default=None),
    }
