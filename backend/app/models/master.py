"""Master tables used to build the Employer Identification Number (EIN).

Codes are permanent: once an EIN contains a code it must never change or be re-used.
"""
from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Directorate(Base):
    __tablename__ = 'directorates'

    code: Mapped[str] = mapped_column(String(3), primary_key=True)  # first EIN segment
    name: Mapped[str] = mapped_column(String(120), unique=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)

    districts: Mapped[list['DirectorateDistrict']] = relationship(back_populates='directorate', order_by='DirectorateDistrict.district')


class DirectorateDistrict(Base):
    """Which Directorate serves a district (assigned automatically at registration)."""

    __tablename__ = 'directorate_districts'

    district: Mapped[str] = mapped_column(String(80), primary_key=True)
    directorate_code: Mapped[str] = mapped_column(ForeignKey('directorates.code'), index=True)

    directorate: Mapped[Directorate] = relationship(back_populates='districts')


class IndustryClassification(Base):
    __tablename__ = 'industry_classifications'

    code: Mapped[str] = mapped_column(String(2), primary_key=True)  # second EIN segment
    name: Mapped[str] = mapped_column(String(120), unique=True)
    # True = registration goes through ESSI approval; False = instant registration
    approval_required: Mapped[bool] = mapped_column(Boolean, default=True)
    active: Mapped[bool] = mapped_column(Boolean, default=True)
