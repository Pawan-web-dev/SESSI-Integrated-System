"""Monthly contributions (F-4 return), their worker lines, and challans / payments."""
from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base, TimestampMixin


class Contribution(TimestampMixin, Base):
    """One month's return of contributions (F-4). Amounts are whole rupees."""

    __tablename__ = 'contributions'
    __table_args__ = (UniqueConstraint('employer_id', 'month'),)

    id: Mapped[int] = mapped_column(primary_key=True)
    ref: Mapped[str] = mapped_column(String(20), unique=True)  # CNTR-2026-00123
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), index=True)
    month: Mapped[date] = mapped_column(Date)  # first day of the contribution month
    workers: Mapped[int] = mapped_column(Integer)
    total_wages: Mapped[int] = mapped_column(Integer)
    amount: Mapped[int] = mapped_column(Integer)  # contribution under section 20(1)
    status: Mapped[str] = mapped_column(String(12), default='approved')  # submitted | approved
    submitted_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    lines: Mapped[list['ContributionLine']] = relationship(back_populates='contribution', order_by='ContributionLine.id')
    challan: Mapped['Challan | None'] = relationship(back_populates='contribution', uselist=False)


class ContributionLine(Base):
    """Worker-wise schedule (C-1): one row per employee in the month."""

    __tablename__ = 'contribution_lines'

    id: Mapped[int] = mapped_column(primary_key=True)
    contribution_id: Mapped[int] = mapped_column(ForeignKey('contributions.id'), index=True)
    employee_id: Mapped[int | None] = mapped_column(ForeignKey('employees.id'))
    worker_name: Mapped[str] = mapped_column(String(120))
    cnic: Mapped[str] = mapped_column(String(15))
    mobile: Mapped[str | None] = mapped_column(String(20))
    employment_type: Mapped[str] = mapped_column(String(20))
    wage: Mapped[int] = mapped_column(Integer)
    days: Mapped[int] = mapped_column(Integer)
    amount: Mapped[int] = mapped_column(Integer)

    contribution: Mapped[Contribution] = relationship(back_populates='lines')


class Challan(TimestampMixin, Base):
    __tablename__ = 'challans'

    id: Mapped[int] = mapped_column(primary_key=True)
    challan_no: Mapped[str] = mapped_column(String(20), unique=True, index=True)  # CH-2026-004512
    employer_id: Mapped[int] = mapped_column(ForeignKey('employers.id'), index=True)
    contribution_id: Mapped[int] = mapped_column(ForeignKey('contributions.id'), unique=True)
    amount: Mapped[int] = mapped_column(Integer)  # contribution
    service_charges: Mapped[int] = mapped_column(Integer)
    due_date: Mapped[date] = mapped_column(Date)
    status: Mapped[str] = mapped_column(String(10), default='unpaid', index=True)  # unpaid | paid

    # filled when paid
    paid_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    days_late: Mapped[int | None] = mapped_column(Integer)
    late_increase: Mapped[int | None] = mapped_column(Integer)  # section 24(1)
    total_paid: Mapped[int | None] = mapped_column(Integer)
    receipt_no: Mapped[str | None] = mapped_column(String(20), unique=True)  # RCP-2026-008590
    payment_channel: Mapped[str | None] = mapped_column(String(20))  # 1Bill
    transaction_ref: Mapped[str | None] = mapped_column(String(40))

    contribution: Mapped[Contribution] = relationship(back_populates='challan')
