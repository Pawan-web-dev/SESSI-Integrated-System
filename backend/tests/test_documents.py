"""Registration documents: upload checks, use in an application, viewing by ESSI and by the employer."""
from tests.conftest import API, PDF_BYTES, register_and_approve, registration_payload, upload


def _contact_token(client, n: int) -> str:
    return registration_payload(client, n)['contact_token']


def test_upload_checks(client):
    token = _contact_token(client, 1)
    assert upload(client, 'not-a-token', 'secp').status_code == 401
    assert upload(client, token, 'passport').json()['detail'] == 'Unknown document type.'
    assert upload(client, token, 'secp', b'MZ\x90\x00 not a pdf', 'virus.pdf').json()['detail'] == 'Upload a PDF, JPG or PNG file.'
    assert upload(client, token, 'secp', b'', 'empty.pdf').status_code == 400
    too_big = b'%PDF-' + b'0' * (5 * 1024 * 1024)
    assert 'larger than 5 MB' in upload(client, token, 'secp', too_big).json()['detail']
    ok = upload(client, token, 'secp', name='..\\..\\secp certificate.pdf')
    assert ok.status_code == 201 and ok.json()['file_name'] == 'secp certificate.pdf' and ok.json()['content_type'] == 'application/pdf'


def test_files_must_belong_to_the_applicant(client):
    other = registration_payload(client, 2)
    body = registration_payload(client, 3)
    body['documents']['secp'] = other['documents']['secp']  # someone else's upload
    r = client.post(f'{API}/registrations', json=body)
    assert r.status_code == 400 and r.json()['detail'] == 'Upload the SECP Certificate again.'


def test_admin_and_employer_can_open_documents(client, admin_headers):
    r = client.post(f'{API}/registrations', json=registration_payload(client, 4))
    app_id = next(a['id'] for a in client.get(f'{API}/admin/applications', headers=admin_headers).json()['items'])
    detail = client.get(f'{API}/admin/applications/{app_id}', headers=admin_headers).json()
    secp = next(d for d in detail['documents'] if d['doc_type'] == 'secp')
    assert secp['has_file'] and secp['label'] == 'SECP Certificate' and secp['size'] == len(PDF_BYTES)

    url = f'{API}/admin/applications/{app_id}/documents/{secp["id"]}'
    assert client.get(url).status_code == 401
    f = client.get(url, headers=admin_headers)
    assert f.status_code == 200 and f.content == PDF_BYTES and f.headers['content-type'] == 'application/pdf'
    assert f.headers['content-disposition'].startswith('inline')
    assert r.status_code == 201

    _, h = register_and_approve(client, admin_headers, 5)
    docs = {d['doc_type']: d for d in client.get(f'{API}/employer/documents', headers=h).json()}
    assert docs['ntn']['has_file'] and docs['ntn']['status'] == 'Verified' and docs['gas']['status'] == 'Not provided'
    own = client.get(f'{API}/employer/documents/{docs["ntn"]["id"]}/file', headers=h)
    assert own.status_code == 200 and own.content == PDF_BYTES
    # the first applicant's documents are not visible to this employer
    assert client.get(f'{API}/employer/documents/{secp["id"]}/file', headers=h).status_code == 404
