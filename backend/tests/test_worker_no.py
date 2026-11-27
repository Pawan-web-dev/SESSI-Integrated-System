"""ESSI worker numbers: format and check digit, one number per person across employers, family-member suffixes."""
from datetime import date

from app.services.worker_no import WorkerNoParts, format_worker_no, is_valid_worker_no, luhn_digit
from tests.conftest import API, register_and_approve

WORKER = {'full_name': 'Tariq Bashir', 'father_name': 'Bashir Ahmed', 'gender': 'MALE', 'cnic': '42101-5550001-1',
          'mobile': '0300-5550001', 'designation': 'Operator', 'employment_type': 'Permanent', 'monthly_wage': 40_000}
WIFE = {'name': 'Ayesha Bibi', 'relation': 'Wife', 'cnic': '42101-1234567-2', 'source': 'FRC'}
SON = {'name': 'Ali Raza', 'relation': 'Son', 'source': 'Manual'}


def test_check_digit_and_format():
    assert luhn_digit('26102004573') == 6  # the worked example: total 34 -> 40 - 34
    assert luhn_digit('26102004537') == 1  # 7 and 3 swapped give a different digit
    assert format_worker_no(WorkerNoParts(26, '102', 4573)) == 'W-26-102-004573-6'
    assert is_valid_worker_no('W-26-102-004573-6') and is_valid_worker_no('w-26-102-004573-6/01')
    assert not is_valid_worker_no('W-26-102-004537-6')  # typo caught by the check digit
    assert not is_valid_worker_no('102-93-000001') and not is_valid_worker_no('')


def test_numbers_issued_in_order_and_kept(client, admin_headers):
    ein, h = register_and_approve(client, admin_headers)
    directorate, yy = ein.split('-')[0], f'{date.today().year % 100:02d}'
    first = client.post(f'{API}/employer/employees', json=WORKER | {'dependents': [WIFE, SON]}, headers=h).json()
    second = client.post(f'{API}/employer/employees', json=WORKER | {'cnic': '42101-5550002-2', 'mobile': '0300-5550002'}, headers=h).json()
    assert first['worker_no'] == format_worker_no(WorkerNoParts(int(yy), directorate, 1))
    assert first['worker_no'].startswith(f'W-{yy}-{directorate}-000001-')
    assert second['worker_no'] == format_worker_no(WorkerNoParts(int(yy), directorate, 2))
    assert [d['worker_no'] for d in first['dependents']] == [first['worker_no'] + '/01', first['worker_no'] + '/02']

    # editing the employee (and re-saving the family) keeps every number; a new child gets the next suffix
    deps = first['dependents'] + [{'name': 'Sara', 'relation': 'Daughter', 'source': 'Manual'}]
    edited = client.put(f'{API}/employer/employees/{first["id"]}', json=WORKER | {'designation': 'Supervisor', 'dependents': deps}, headers=h).json()
    assert edited['worker_no'] == first['worker_no']
    assert [d['worker_no'][-3:] for d in edited['dependents']] == ['/01', '/02', '/03']

    # a mistyped CNIC corrected later: still the same person, same number
    fixed = client.put(f'{API}/employer/employees/{second["id"]}', json=WORKER | {'cnic': '42101-5550003-3', 'mobile': '0300-5550002'}, headers=h).json()
    assert fixed['worker_no'] == second['worker_no']

    # officers find the worker by number, with or without dashes, and by a family member's number
    for q in (first['worker_no'], first['worker_no'].replace('-', '')[1:], first['worker_no'] + '/02'):
        found = client.get(f'{API}/admin/employees', params={'q': q}, headers=admin_headers).json()
        assert found['total'] == 1 and found['items'][0]['worker_no'] == first['worker_no'], q


def test_same_worker_keeps_number_with_new_employer(client, admin_headers):
    _, h1 = register_and_approve(client, admin_headers, n=1)
    _, h2 = register_and_approve(client, admin_headers, n=2, district='Hyderabad')
    at_first = client.post(f'{API}/employer/employees', json=WORKER | {'dependents': [WIFE, SON]}, headers=h1).json()
    # joins a second employer: same CNIC -> same worker number, and the same family members keep their suffixes
    at_second = client.post(f'{API}/employer/employees', json=WORKER | {'dependents': [SON, WIFE]}, headers=h2).json()
    assert at_second['worker_no'] == at_first['worker_no']
    assert {d['name']: d['worker_no'] for d in at_second['dependents']} == {d['name']: d['worker_no'] for d in at_first['dependents']}
