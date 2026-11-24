"""Initial master data (same codes as the frontend, frontend/src/services/portal/masterData.ts).

Codes 100 (Malir), 91 (Retail Shops), 92 (Textile), 94 (Construction) and 203 follow the SESSI requirement;
all other codes are placeholders until SESSI notifies the official list. Never change a code once in use.
"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Directorate, DirectorateDistrict, IndustryClassification

DIRECTORATES: list[tuple[str, str, list[str]]] = [
    ('100', 'Malir Directorate', ['Malir']),
    ('101', 'Landhi Directorate', ['Korangi']),
    ('102', 'City Directorate', ['Karachi South', 'Karachi Central']),
    ('103', 'SITE East Directorate', ['Karachi East']),
    ('104', 'SITE West Directorate', ['Karachi West', 'Keamari']),
    ('201', 'Hyderabad Directorate', ['Hyderabad', 'Jamshoro', 'Thatta']),
    ('202', 'Mirpurkhas Directorate', ['Mirpurkhas']),
    ('203', 'Shaheed Benazirabad Directorate', ['Shaheed Benazirabad']),
    ('204', 'Sukkur Directorate', ['Sukkur']),
    ('205', 'Larkana Directorate', ['Larkana']),
]

INDUSTRIES: list[tuple[str, str]] = [
    ('92', 'Textile Industry'), ('93', 'Garments'), ('95', 'Hosiery'), ('91', 'Retail Shops'), ('96', 'Wholesale Trade'),
    ('94', 'Construction'), ('10', 'Engineering'), ('11', 'Pharmaceutical'), ('12', 'Hospitals'), ('13', 'Educational Institutions'),
    ('14', 'Hotels'), ('15', 'Restaurants'), ('16', 'Banking'), ('17', 'Insurance'), ('18', 'Information Technology'),
    ('19', 'Transport & Logistics'), ('20', 'Ports & Shipping'), ('21', 'Oil & Gas'), ('22', 'Chemicals'), ('23', 'Plastic'),
    ('24', 'Food Processing'), ('25', 'Rice Mills'), ('26', 'Flour Mills'), ('27', 'Sugar Mills'), ('28', 'Steel Industry'),
    ('29', 'Cement'), ('30', 'Automobile'), ('31', 'Leather & Tanneries'), ('32', 'Fisheries'), ('33', 'Agriculture'),
    ('34', 'Mining'), ('35', 'Power Generation'), ('36', 'Telecommunications'), ('37', 'Aviation'), ('38', 'Warehousing'),
    ('39', 'Security Services'), ('40', 'Cleaning & Janitorial Services'), ('99', 'Other (as notified by SESSI)'),
]


def load_master_data(db: Session) -> None:
    """Insert missing Directorates, districts and industries (safe to run again)."""
    existing_dirs = set(db.scalars(select(Directorate.code)))
    existing_districts = set(db.scalars(select(DirectorateDistrict.district)))
    for code, name, districts in DIRECTORATES:
        if code not in existing_dirs:
            db.add(Directorate(code=code, name=name, active=True))
        for district in districts:
            if district not in existing_districts:
                db.add(DirectorateDistrict(district=district, directorate_code=code))
    existing_ind = set(db.scalars(select(IndustryClassification.code)))
    for code, name in INDUSTRIES:
        if code not in existing_ind:
            db.add(IndustryClassification(code=code, name=name, approval_required=True, active=True))
    db.flush()


def directorate_for_district(db: Session, district: str) -> Directorate | None:
    row = db.get(DirectorateDistrict, district)
    return row.directorate if row and row.directorate.active else None
