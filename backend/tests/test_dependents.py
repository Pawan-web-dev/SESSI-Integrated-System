"""Dependents saved with an employee, and the admin views of establishments, workers and dependents."""
from tests.conftest import API, register_and_approve

SPOUSE = {'name': 'Ayesha Bibi', 'relation': 'Spouse', 'cnic': '4210112345671', 'date_of_birth': '1993-08-09', 'source': 'FRC',
          'photo': 'data:image/jpeg;base64,AAAA'}
SON = {'name': 'Ali Raza', 'relation': 'Son', 'cnic': None, 'date_of_birth': '2016-02-15', 'source': 'Manual'}


def _employee(**extra) -> dict:
    return {'full_name': 'Tariq Bashir', 'father_name': 'Bashir Ahmed', 'gender': 'MALE', 'cnic': '42101-5550001-1',
            'mobile': '0300-5550001', 'designation': 'Operator', 'employment_type': 'Permanent', 'monthly_wage': 40_000} | extra


def test_dependents_saved_with_employee(client, admin_headers):
    _, h = register_and_approve(client, admin_headers)
    r = client.post(f'{API}/employer/employees', json=_employee(dependents=[SPOUSE, SON]), headers=h)
    assert r.status_code == 201, r.text
    emp = r.json()
    assert [d['name'] for d in emp['dependents']] == ['Ayesha Bibi', 'Ali Raza']
    assert emp['dependents'][0]['cnic'] == '42101-1234567-1'  # normalized
    spouse_id = emp['dependents'][0]['id']

    # the list endpoint returns them too
    listed = client.get(f'{API}/employer/employees', headers=h).json()
    assert len(listed[0]['dependents']) == 2

    # leaving `dependents` out keeps them
    kept = client.put(f'{API}/employer/employees/{emp["id"]}', json=_employee(designation='Supervisor'), headers=h).json()
    assert len(kept['dependents']) == 2

    # sending a list replaces it; a row with its id is updated in place
    edited = client.put(f'{API}/employer/employees/{emp["id"]}', json=_employee(dependents=[SPOUSE | {'id': spouse_id, 'name': 'Ayesha Tariq'}]), headers=h).json()
    assert [(d['id'], d['name']) for d in edited['dependents']] == [(spouse_id, 'Ayesha Tariq')]

    bad = client.put(f'{API}/employer/employees/{emp["id"]}', json=_employee(dependents=[SON | {'name': ' '}]), headers=h)
    assert bad.status_code == 400

    assert client.delete(f'{API}/employer/employees/{emp["id"]}', headers=h).status_code == 200


def test_admin_dashboard_workers_and_dependents(client, admin_headers):
    ein, h = register_and_approve(client, admin_headers)
    emp = client.post(f'{API}/employer/employees', json=_employee(dependents=[SPOUSE]), headers=h).json()

    dash = client.get(f'{API}/admin/dashboard', headers=admin_headers).json()
    assert dash['employers']['approved'] == 1 and dash['employees_total'] == 1 and dash['dependents_total'] == 1
    assert dash['top_employers'][0]['employees'] == 1 and len(dash['trend']) == 6

    employers = client.get(f'{API}/admin/employers', headers=admin_headers).json()
    assert employers[0]['ein'] == ein and employers[0]['employees'] == 1
    detail = client.get(f'{API}/admin/employers/{employers[0]["id"]}', headers=admin_headers).json()
    assert detail['employees_list'][0]['full_name'] == 'Tariq Bashir'

    found = client.get(f'{API}/admin/employees', params={'q': '5550001'}, headers=admin_headers).json()
    assert found['total'] == 1 and found['items'][0]['dependents'] == 1
    assert client.get(f'{API}/admin/employees', params={'q': 'nobody'}, headers=admin_headers).json()['total'] == 0

    added = client.post(f'{API}/admin/employees/{emp["id"]}/dependents', json=SON, headers=admin_headers)
    assert added.status_code == 201, added.text
    dep_id = added.json()['id']
    upd = client.put(f'{API}/admin/dependents/{dep_id}', json=SON | {'name': 'Ali Tariq'}, headers=admin_headers).json()
    assert upd['name'] == 'Ali Tariq'
    worker = client.get(f'{API}/admin/employees/{emp["id"]}', headers=admin_headers).json()
    assert [d['name'] for d in worker['dependents_list']] == ['Ayesha Bibi', 'Ali Tariq']
    assert client.delete(f'{API}/admin/dependents/{dep_id}', headers=admin_headers).status_code == 200
    assert len(client.get(f'{API}/admin/employees/{emp["id"]}', headers=admin_headers).json()['dependents_list']) == 1

    # employers see what the admin changed
    assert len(client.get(f'{API}/employer/employees/{emp["id"]}', headers=h).json()['dependents']) == 1
    # employers cannot use the admin endpoints
    assert client.get(f'{API}/admin/employees', headers=h).status_code in (401, 403)
