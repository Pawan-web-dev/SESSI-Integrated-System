"""Pharmacy / hospital (HMIS) eligibility check: partner keys, both ways of writing the number, CNIC lookup, coverage."""
from app.core.security import hash_password
from app.models import AdminUser, AuditLog
from app.services.eligibility import mask_cnic
from app.services.worker_no import to_digits
from tests.conftest import API, register_and_approve

WORKER = {'full_name': 'Tariq Bashir', 'father_name': 'Bashir Ahmed', 'gender': 'MALE', 'cnic': '42101-5550001-1',
          'mobile': '0300-5550001', 'designation': 'Operator', 'employment_type': 'Permanent', 'monthly_wage': 40_000}
FAMILY = [{'name': 'Ayesha Bibi', 'relation': 'Wife', 'cnic': '42101-1234567-2', 'source': 'FRC'},
          {'name': 'Ali Raza', 'relation': 'Son', 'source': 'Manual'}]


def _partner(client, admin_headers, name='Civil Hospital – HMIS', kind='HMIS'):
    r = client.post(f'{API}/admin/partner-keys', json={'name': name, 'kind': kind}, headers=admin_headers)
    assert r.status_code == 201, r.text
    return r.json()


def test_both_forms_and_cnic_give_the_same_person(client, admin_headers):
    _, h = register_and_approve(client, admin_headers)
    emp = client.post(f'{API}/employer/employees', json=WORKER | {'dependents': FAMILY}, headers=h).json()
    no, digits = emp['worker_no'], emp['worker_no_digits']
    assert digits == to_digits(no) and len(digits) == 12 and digits == no[2:].replace('-', '')
    son = emp['dependents'][1]
    assert son['worker_no'] == no + '/02' and son['worker_no_digits'] == digits + '02'

    key = _partner(client, admin_headers)['key']
    pk = {'X-API-Key': key}

    def look(value):
        r = client.get(f'{API}/eligibility/{value}', headers=pk)
        assert r.status_code == 200, (value, r.text)
        return r.json()

    for value in (no, digits, no.lower(), WORKER['cnic'], WORKER['cnic'].replace('-', '')):
        got = look(value)
        assert (got['id'], got['id_digits'], got['person'], got['name']) == (no, digits, 'worker', 'Tariq Bashir'), value
        assert got['eligible'] is True and got['cnic_masked'] == '*****-***0001-1'
        assert [(m['id'], m['id_digits'], m['relation']) for m in got['family']] == [
            (no + '/01', digits + '01', 'Wife'), (no + '/02', digits + '02', 'Son')]
        assert 'monthly_wage' not in got and 'bank_account' not in got and 'cnic' not in got

    for value in (no + '/02', no + '-02', digits + '02'):
        got = look(value)
        assert (got['id'], got['id_digits'], got['person'], got['name'], got['relation']) == (no + '/02', digits + '02', 'family member', 'Ali Raza', 'Son')
        assert got['worker_no'] == no and got['eligible'] is True and got['family'] == []
    assert look('42101-1234567-2')['name'] == 'Ayesha Bibi'  # a family member's own CNIC

    # mistakes at the counter
    typo = digits[:-2] + digits[-1] + digits[-2]  # last two digits swapped
    if typo != digits:
        r = client.get(f'{API}/eligibility/{typo}', headers=pk)
        assert r.status_code == 400 and 'check digit' in r.json()['detail']
    assert client.get(f'{API}/eligibility/{no}/09', headers=pk).status_code == 404
    assert client.get(f'{API}/eligibility/42101-9999999-9', headers=pk).status_code == 404

    # officers find the same worker with the digits form of a family member's number
    found = client.get(f'{API}/admin/employees', params={'q': digits + '02'}, headers=admin_headers).json()
    assert found['total'] == 1 and found['items'][0]['worker_no_digits'] == digits


def test_coverage_ends_when_the_worker_leaves(client, admin_headers, db):
    _, h = register_and_approve(client, admin_headers)
    emp = client.post(f'{API}/employer/employees', json=WORKER | {'dependents': FAMILY}, headers=h).json()
    pk = {'X-API-Key': _partner(client, admin_headers, 'Al-Shifa Pharmacy', 'Pharmacy')['key']}
    client.post(f'{API}/employer/employees/{emp["id"]}/status', json={'status': 'Separated'}, headers=h)
    for value in (emp['worker_no'], emp['worker_no_digits'] + '01'):
        got = client.get(f'{API}/eligibility/{value}', headers=pk).json()
        assert got['eligible'] is False and 'Separated' in got['reason'] and got['employers'] == []
    # every lookup is in the audit trail, with the partner's name
    rows = db.query(AuditLog).filter(AuditLog.action == 'eligibility.checked').all()
    assert len(rows) == 2 and all('Al-Shifa Pharmacy' in r.actor for r in rows)


def test_partner_keys(client, admin_headers, db):
    assert client.get(f'{API}/eligibility/261020045736').status_code == 401
    assert client.get(f'{API}/eligibility/261020045736', headers={'X-API-Key': 'essi_wrong'}).status_code == 401

    created = _partner(client, admin_headers)
    assert created['key'].startswith('essi_') and created['key'].startswith(created['key_prefix'])
    listed = client.get(f'{API}/admin/partner-keys', headers=admin_headers).json()
    assert [k['name'] for k in listed] == ['Civil Hospital – HMIS'] and 'key' not in listed[0]

    pk = {'X-API-Key': created['key']}
    assert client.get(f'{API}/eligibility/261020045736', headers=pk).status_code in (400, 404)  # accepted, just unknown
    one = f'{API}/admin/partner-keys/{created["id"]}'
    assert client.delete(one, headers=admin_headers).status_code == 400  # an active key must be revoked first
    assert client.post(f'{one}/revoke', headers=admin_headers).json()['active'] is False
    assert client.get(f'{API}/eligibility/261020045736', headers=pk).status_code == 401

    # a revoked key can be deleted for good; its history stays in the audit trail
    assert client.delete(one, headers=admin_headers).status_code == 200
    assert client.get(f'{API}/admin/partner-keys', headers=admin_headers).json() == []
    assert client.delete(one, headers=admin_headers).status_code == 404
    assert db.query(AuditLog).filter(AuditLog.action == 'partner_key.deleted').count() == 1

    # an officer (not an administrator) can look up but not hand out keys
    db.add(AdminUser(username='officer1', full_name='Officer', password_hash=hash_password('Officer@2026'), role='officer'))
    db.commit()
    token = client.post(f'{API}/admin/login', json={'username': 'officer1', 'password': 'Officer@2026'}).json()['access_token']
    officer = {'Authorization': f'Bearer {token}'}
    assert client.post(f'{API}/admin/partner-keys', json={'name': 'Some Clinic', 'kind': 'HMIS'}, headers=officer).status_code == 403
    assert client.post(f'{API}/admin/partner-keys', json={'name': 'Clinic', 'kind': 'Spa'}, headers=admin_headers).status_code == 400


def test_mask_cnic():
    assert mask_cnic('42101-5550001-1') == '*****-***0001-1'
    assert mask_cnic('') is None and mask_cnic('B-123') is None
