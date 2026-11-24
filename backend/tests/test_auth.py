"""Sign-in lock, password reset and password change."""
from tests.conftest import API, PASSWORD, last_code, register_and_approve


def test_lock_after_five_failed_attempts(client, admin_headers):
    ein, _ = register_and_approve(client, admin_headers)
    for left in (4, 3, 2, 1):
        r = client.post(f'{API}/auth/login', json={'login_id': ein, 'password': 'Wrong@123'})
        assert r.status_code == 401 and f'{left} attempt' in r.json()['detail']
    assert client.post(f'{API}/auth/login', json={'login_id': ein, 'password': 'Wrong@123'}).status_code == 429
    # locked even with the right password
    assert client.post(f'{API}/auth/login', json={'login_id': ein, 'password': PASSWORD}).status_code == 429


def test_password_reset(client, admin_headers):
    ein, _ = register_and_approve(client, admin_headers)
    r = client.post(f'{API}/auth/password-reset/request', json={'login_id': ein})
    assert r.status_code == 200 and r.json()['sent_to'] == '0333-XXX2201'
    code = last_code(client, '0333-1112201')
    bad = client.post(f'{API}/auth/password-reset/confirm', json={'login_id': ein, 'code': '000000', 'new_password': 'Better@456'})
    assert bad.status_code == 400
    ok = client.post(f'{API}/auth/password-reset/confirm', json={'login_id': ein, 'code': code, 'new_password': 'Better@456'})
    assert ok.status_code == 200
    assert client.post(f'{API}/auth/login', json={'login_id': ein, 'password': 'Better@456'}).status_code == 200
    # a code works only once
    again = client.post(f'{API}/auth/password-reset/confirm', json={'login_id': ein, 'code': code, 'new_password': 'Other@789'})
    assert again.status_code == 400


def test_change_password(client, admin_headers):
    ein, headers = register_and_approve(client, admin_headers)
    assert client.post(f'{API}/employer/password', json={'current_password': 'nope', 'new_password': 'Better@456'}, headers=headers).status_code == 400
    assert client.post(f'{API}/employer/password', json={'current_password': PASSWORD, 'new_password': 'Better@456'}, headers=headers).status_code == 200
    assert client.post(f'{API}/auth/login', json={'login_id': ein, 'password': 'Better@456'}).status_code == 200


def test_employer_endpoints_need_sign_in(client):
    assert client.get(f'{API}/employer/me').status_code == 401
    assert client.get(f'{API}/employer/me', headers={'Authorization': 'Bearer nonsense'}).status_code == 401
