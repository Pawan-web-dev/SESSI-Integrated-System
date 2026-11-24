"""Employees, contributions (F-4 / C-1), challans, late payment and receipts."""
from datetime import datetime, timezone

from sqlalchemy import select

from app.models import Challan, Employer
from app.services import contributions
from app.services.contributions import contribution_for, late_increase
from tests.conftest import API, register_and_approve


def _employee(n: int, wage: int, etype: str = 'Permanent') -> dict:
    return {'full_name': f'Worker {n}', 'father_name': f'Father {n}', 'gender': 'MALE', 'cnic': f'42101-55500{n:02d}-1',
            'mobile': f'0300-55500{n:02d}', 'designation': 'Operator', 'employment_type': etype, 'monthly_wage': wage}


def test_contribution_rule():
    assert contribution_for(37_000, 30) == 2220  # 6% of the minimum wage
    assert contribution_for(50_000, 30) == 2220  # wages above the ceiling are capped
    assert contribution_for(30_000, 30) == 1800
    assert contribution_for(37_000, 15) == 1110
    assert late_increase(99_900, datetime(2026, 8, 31).date(), datetime(2026, 9, 7).date()) == (7, 3497)  # 3.5%
    assert late_increase(10_000, datetime(2026, 1, 31).date(), datetime(2026, 9, 1).date())[1] == 5000  # capped at 50%


def test_employee_crud(client, admin_headers):
    _, h = register_and_approve(client, admin_headers)
    r = client.post(f'{API}/employer/employees', json=_employee(1, 40_000), headers=h)
    assert r.status_code == 201, r.text
    emp_id = r.json()['id']
    assert client.post(f'{API}/employer/employees', json=_employee(1, 40_000), headers=h).status_code == 409  # same CNIC
    bad = _employee(2, 1) | {'cnic': '123'}
    assert client.post(f'{API}/employer/employees', json=bad, headers=h).status_code == 400
    updated = client.put(f'{API}/employer/employees/{emp_id}', json=_employee(1, 45_000) | {'designation': 'Supervisor'}, headers=h).json()
    assert updated['designation'] == 'Supervisor' and updated['monthly_wage'] == 45_000
    assert client.post(f'{API}/employer/employees/{emp_id}/status', json={'status': 'Inactive'}, headers=h).json()['status'] == 'Inactive'
    assert client.delete(f'{API}/employer/employees/{emp_id}', headers=h).status_code == 200


def test_contribution_challan_payment_receipt(client, admin_headers, db):
    ein, h = register_and_approve(client, admin_headers)
    for n, wage in ((1, 40_000), (2, 37_000), (3, 30_000)):
        client.post(f'{API}/employer/employees', json=_employee(n, wage), headers=h)

    r = client.post(f'{API}/employer/contributions', json={'month': '2026-10'}, headers=h)
    assert r.status_code == 201, r.text
    c = r.json()
    assert c['workers'] == 3 and c['amount'] == 2220 + 2220 + 1800
    assert c['challan']['due_date'] == '2026-10-31' and c['challan']['service_charges'] == 40
    assert len(c['lines']) == 3
    assert client.post(f'{API}/employer/contributions', json={'month': '2026-10'}, headers=h).status_code == 409
    assert client.post(f'{API}/employer/contributions', json={'month': '2099-01'}, headers=h).status_code == 400

    # F-4 with the C-1 schedule
    f4 = client.get(f'{API}/employer/contributions/{c["id"]}/f4', headers=h).json()
    assert f4['employer_no'] == ein and f4['industry'] == 'Retail Shops' and f4['total'] == 6280
    assert f4['total_in_words'] == 'SIX THOUSAND TWO HUNDRED EIGHTY'

    # pay 7 days late -> 3.5% increase on the contribution
    employer = db.scalars(select(Employer).where(Employer.ein == ein)).one()
    ch = db.scalars(select(Challan).where(Challan.challan_no == c['challan']['challan_no'])).one()
    contributions.pay_challan(db, employer, ch, '1Bill', 'test', paid_at=datetime(2026, 11, 7, tzinfo=timezone.utc))
    receipt = client.get(f'{API}/employer/challans/{ch.challan_no}/receipt', headers=h).json()
    assert receipt['days_late'] == 7 and receipt['late_increase'] == round(6240 * 0.035)
    assert receipt['total_paid'] == 6240 + 40 + receipt['late_increase']
    assert receipt['employer_no'] == ein and receipt['receipt_no'].startswith('RCP-')
    assert client.post(f'{API}/employer/challans/{ch.challan_no}/pay', json={}, headers=h).status_code == 409

    # an employee in a submitted contribution cannot be deleted
    emp_id = client.get(f'{API}/employer/employees', headers=h).json()[0]['id']
    assert client.delete(f'{API}/employer/employees/{emp_id}', headers=h).status_code == 409


def test_pay_on_time_has_no_increase(client, admin_headers):
    _, h = register_and_approve(client, admin_headers)
    client.post(f'{API}/employer/employees', json=_employee(1, 37_000), headers=h)
    month = datetime.now(timezone.utc).strftime('%Y-%m')
    c = client.post(f'{API}/employer/contributions', json={'month': month}, headers=h).json()
    receipt = client.post(f'{API}/employer/challans/{c["challan"]["challan_no"]}/pay', json={'channel': '1Bill'}, headers=h).json()
    assert receipt['late_increase'] == 0 and receipt['total_paid'] == 2260
    dash = client.get(f'{API}/employer/dashboard', headers=h).json()
    assert dash['outstanding'] == 0 and dash['employees']['Active'] == 1


def test_cannot_see_other_employers_data(client, admin_headers):
    _, h1 = register_and_approve(client, admin_headers, 1)
    _, h2 = register_and_approve(client, admin_headers, 2)
    emp = client.post(f'{API}/employer/employees', json=_employee(1, 37_000), headers=h1).json()
    assert client.get(f'{API}/employer/employees/{emp["id"]}', headers=h2).status_code == 404


def test_preview_notifications_documents(client, admin_headers):
    _, h = register_and_approve(client, admin_headers)
    client.post(f'{API}/employer/employees', json=_employee(1, 40_000), headers=h)
    month = datetime.now(timezone.utc).strftime('%Y-%m')
    p = client.get(f'{API}/employer/contributions/preview', params={'month': month}, headers=h).json()
    assert p['workers'] == 1 and p['amount'] == 2220 and p['total'] == 2260 and p['lines'][0]['worker_name'] == 'Worker 1'
    # previewing does not submit
    assert client.get(f'{API}/employer/contributions', headers=h).json() == []
    subjects = [n['subject'] for n in client.get(f'{API}/employer/notifications', headers=h).json()]
    assert 'Registration approved' in subjects
    docs = {d['doc_type']: d for d in client.get(f'{API}/employer/documents', headers=h).json()}
    assert docs['secp']['status'] == 'Verified' and docs['gas']['status'] == 'Not provided'
