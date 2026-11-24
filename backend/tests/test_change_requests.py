"""Change requests, including an Industry Classification change (EIN stays the same, audit trail kept)."""
from tests.conftest import API, register_and_approve


def _request(client, h, **body):
    return client.post(f'{API}/employer/change-requests', json=body, headers=h)


def test_industry_change_keeps_ein_and_is_audited(client, admin_headers):
    ein, h = register_and_approve(client, admin_headers)
    assert _request(client, h, field='industry_code', new_value='96', reason='Now sells mainly in bulk to other shops.').status_code == 400  # no document
    r = _request(client, h, field='industry_code', new_value='96', reason='Now sells mainly in bulk to other shops.', document='ntn.pdf')
    assert r.status_code == 201, r.text
    req = r.json()
    assert req['old_value'] == 'Retail Shops (91)' and req['new_value'] == 'Wholesale Trade (96)' and req['status'] == 'Pending Review'
    # only one open request per field
    assert _request(client, h, field='industry_code', new_value='93', reason='Something else entirely.', document='x.pdf').status_code == 409

    pending = client.get(f'{API}/admin/change-requests', headers=admin_headers).json()
    assert [p['ref'] for p in pending] == [req['ref']]
    done = client.post(f'{API}/admin/change-requests/{req["id"]}/decision', json={'status': 'Approved'}, headers=admin_headers).json()
    assert done['status'] == 'Approved'
    assert f'Employer No. {ein} remains unchanged' in done['events'][-1]['text']

    me = client.get(f'{API}/employer/me', headers=h).json()
    assert me['industry'] == 'Wholesale Trade' and me['ein'] == ein  # EIN is permanent

    audit = client.get(f'{API}/admin/audit', params={'ein': ein}, headers=admin_headers).json()
    change = next(a for a in audit if a['action'] == 'industry.changed')
    assert change['details']['from'] == '91' and change['details']['to'] == '96' and change['details']['ein'] == ein


def test_rejection_needs_remarks(client, admin_headers):
    _, h = register_and_approve(client, admin_headers)
    req = _request(client, h, field='office_phone', new_value='021-1234567', reason='New office telephone line.').json()
    url = f'{API}/admin/change-requests/{req["id"]}/decision'
    assert client.post(url, json={'status': 'Rejected'}, headers=admin_headers).status_code == 400
    r = client.post(url, json={'status': 'Rejected', 'remarks': 'Number could not be verified.'}, headers=admin_headers).json()
    assert r['status'] == 'Rejected' and r['remarks'] == 'Number could not be verified.'
    assert client.post(url, json={'status': 'Approved'}, headers=admin_headers).status_code == 409


def test_validation(client, admin_headers):
    _, h = register_and_approve(client, admin_headers)
    assert _request(client, h, field='ein', new_value='999-99-999999', reason='I want a nicer number.').status_code == 400
    assert _request(client, h, field='name', new_value='Shop 1', reason='Same name as before really.', document='a.pdf').status_code == 400
    assert _request(client, h, field='district', new_value='Lahore', reason='Moved to a new city.', document='a.pdf').status_code == 400
