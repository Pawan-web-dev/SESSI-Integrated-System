"""Employer Identification Number rules."""
from sqlalchemy import delete, select

from app.models import EinRegistry, EinSequence, Employer
from app.services.ein import EinParts, format_ein, issue_ein, parse_ein, preview_next_ein
from tests.conftest import API, register_and_approve


def test_format_and_parse():
    assert format_ein(EinParts('100', '91', 1)) == '100-91-000001'
    assert format_ein(EinParts('100', '91', 145, '02')) == '100-91-000145-02'
    assert parse_ein('203-94-000221') == EinParts('203', '94', 221, None)
    assert parse_ein('100-91-000001-01').branch == '01'
    assert parse_ein('3-61-0001') is None


def test_serial_is_per_directorate_and_industry(client, admin_headers):
    assert register_and_approve(client, admin_headers, 1, district='Malir', industry='91')[0] == '100-91-000001'
    assert register_and_approve(client, admin_headers, 2, district='Malir', industry='91')[0] == '100-91-000002'
    assert register_and_approve(client, admin_headers, 3, district='Malir', industry='92')[0] == '100-92-000001'
    assert register_and_approve(client, admin_headers, 4, district='Korangi', industry='91')[0] == '101-91-000001'


def test_number_is_never_reissued(client, admin_headers, db):
    ein1, _ = register_and_approve(client, admin_headers, 1)
    ein2, _ = register_and_approve(client, admin_headers, 2)
    # even if the serial counter is lost, the registry stops a number being issued twice
    db.execute(delete(EinSequence))
    db.commit()
    ein3, _ = register_and_approve(client, admin_headers, 3)
    assert ein3 not in (ein1, ein2)
    assert ein3 == '100-91-000003'
    assert len(db.scalars(select(EinRegistry)).all()) == 3


def test_issue_is_idempotent_per_employer(client, admin_headers, db):
    ein, _ = register_and_approve(client, admin_headers, 1)
    employer = db.scalars(select(Employer).where(Employer.ein == ein)).one()
    assert issue_ein(db, employer, 'test') == ein
    assert preview_next_ein(db, '100', '91') == '100-91-000002'


def test_profile_shows_breakdown(client, admin_headers):
    _, headers = register_and_approve(client, admin_headers, 1)
    me = client.get(f'{API}/employer/me', headers=headers).json()
    assert me['ein_breakdown'] == {'ein': '100-91-000001', 'directorate_code': '100', 'directorate': 'Malir Directorate',
                                   'industry_code': '91', 'industry': 'Retail Shops', 'serial': '000001', 'branch': None}
