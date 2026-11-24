"""Registration: contact verification, submission, tracking and ESSI review."""
from tests.conftest import API, PASSWORD, registration_payload


def _submit(client, n=1, **kw):
    return client.post(f'{API}/registrations', json=registration_payload(client, n, **kw))


def test_submit_track_progress_approve(client, admin_headers):
    r = _submit(client)
    assert r.status_code == 201, r.text
    app_no = r.json()['app_no']
    assert r.json()['status'] == 'pending' and r.json()['employer_no'] is None

    # cannot log in before approval
    login = client.post(f'{API}/auth/login', json={'login_id': 'owner1@shop.example', 'password': PASSWORD})
    assert login.status_code == 403 and app_no in login.json()['detail']

    # tracking needs the right CNIC
    assert client.post(f'{API}/registrations/track', json={'app_no': app_no, 'cnic': '42101-1112201-1'}).status_code == 200
    assert client.post(f'{API}/registrations/track', json={'app_no': app_no, 'cnic': '42101-9999999-9'}).status_code == 404

    items = client.get(f'{API}/admin/applications', headers=admin_headers).json()
    app_id = items['items'][0]['id']
    assert items['counts']['pending'] == 1
    detail = client.get(f'{API}/admin/applications/{app_id}', headers=admin_headers).json()
    assert detail['employer_no_on_approval'] == '100-91-000001'
    assert detail['directorate'] == 'Malir Directorate' and detail['industry'] == 'Retail Shops'

    progressed = client.post(f'{API}/admin/applications/{app_id}/progress', json={'stage': 2, 'note': 'All documents clear'}, headers=admin_headers)
    assert progressed.json()['stage'] == 2

    approved = client.post(f'{API}/admin/applications/{app_id}/approve', headers=admin_headers).json()
    assert approved['status'] == 'approved' and approved['employer_no'] == '100-91-000001'
    assert [e['code'] for e in approved['events']] == ['final', 'docs', 'submitted']

    # log in with EIN, CNIC, e-mail or mobile
    for login_id in ('100-91-000001', '42101-1112201-1', 'owner1@shop.example', '03331112201'):
        assert client.post(f'{API}/auth/login', json={'login_id': login_id, 'password': PASSWORD}).status_code == 200, login_id

    # the applicant was notified
    subjects = [m['subject'] for m in client.get(f'{API}/demo/outbox', params={'q': 'owner1@shop.example'}).json()]
    assert {'Application received', 'Application update', 'Registration approved'} <= set(subjects)


def test_reject_then_register_again(client, admin_headers):
    _submit(client)
    app_id = client.get(f'{API}/admin/applications', headers=admin_headers).json()['items'][0]['id']
    assert client.post(f'{API}/admin/applications/{app_id}/reject', json={'reason': 'x'}, headers=admin_headers).status_code == 422
    r = client.post(f'{API}/admin/applications/{app_id}/reject', json={'reason': 'SECP certificate not readable'}, headers=admin_headers)
    assert r.json()['status'] == 'rejected'
    login = client.post(f'{API}/auth/login', json={'login_id': 'owner1@shop.example', 'password': PASSWORD})
    assert login.status_code == 403 and 'SECP certificate not readable' in login.json()['detail']
    # a rejected applicant may apply again with the same CNIC / e-mail
    assert _submit(client).status_code == 201


def test_validation_rules(client):
    assert _submit(client, 1, industry_code='00').json()['detail'] == 'Choose a valid Industry Classification.'
    assert _submit(client, 2, district='Lahore').json()['detail'] == 'Choose a valid district.'
    missing = _submit(client, 3, documents={'secp': 'a.pdf'})
    assert missing.status_code == 400 and missing.json()['detail'].startswith('Please upload: NTN')
    assert _submit(client, 4, password='weak').status_code == 400
    assert _submit(client, 5, declaration_accepted=False).status_code == 400
    assert _submit(client, 6, contact_token='bad').status_code == 401


def test_duplicate_cnic_rejected(client):
    assert _submit(client, 1).status_code == 201
    dup = _submit(client, 2, cnic='42101-1112201-1')
    assert dup.status_code == 409


def test_contact_codes_must_match(client):
    client.post(f'{API}/registrations/contact/codes', json={'mobile': '0333-1112299', 'email': 'a@b.example'})
    r = client.post(f'{API}/registrations/contact/verify', json={'mobile': '0333-1112299', 'email': 'a@b.example', 'mobile_code': '000000', 'email_code': '000000'})
    assert r.status_code == 400


def test_admin_endpoints_need_sign_in(client):
    assert client.get(f'{API}/admin/applications').status_code == 401
    assert client.post(f'{API}/admin/login', json={'username': 'admin', 'password': 'wrong'}).status_code == 401
