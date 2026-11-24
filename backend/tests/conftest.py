"""Test setup: a fresh SQLite database (master data + admin user) for every test."""
import os
import re
import tempfile

_db_file = os.path.join(tempfile.mkdtemp(prefix='sessi-tests-'), 'test.db')
os.environ['DATABASE_URL'] = f'sqlite:///{_db_file}'
os.environ['DEMO_MODE'] = 'true'
os.environ['UPLOAD_DIR'] = os.path.join(os.path.dirname(_db_file), 'uploads')
os.environ['SMTP_HOST'] = ''
os.environ['SMS_API_URL'] = ''
os.environ['ADMIN_PASSWORD'] = ''

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app.core.security import hash_password  # noqa: E402
from app.db.base import Base  # noqa: E402
from app.db.session import SessionLocal, engine  # noqa: E402
from app.main import app  # noqa: E402
from app.models import AdminUser  # noqa: E402
from app.services.master_data import load_master_data  # noqa: E402

API = '/api/v1'
PASSWORD = 'Secret@123'
PDF_BYTES = b'%PDF-1.4 test document %%EOF'
REQUIRED_TYPES = ('secp', 'ntn', 'srb', 'elec', 'cnic', 'bank', 'contact')


def upload(client, contact_token: str, doc_type: str, data: bytes = PDF_BYTES, name: str = 'doc.pdf'):
    return client.post(f'{API}/registrations/documents', data={'contact_token': contact_token, 'doc_type': doc_type},
                       files={'file': (name, data, 'application/pdf')})


@pytest.fixture(autouse=True)
def fresh_db():
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    with SessionLocal() as db:
        load_master_data(db)
        db.add(AdminUser(username='admin', full_name='Test Admin', password_hash=hash_password('Admin@2026'), role='admin'))
        db.commit()
    yield


@pytest.fixture
def db():
    with SessionLocal() as session:
        yield session


@pytest.fixture
def client():
    return TestClient(app)


@pytest.fixture
def admin_headers(client):
    r = client.post(f'{API}/admin/login', json={'username': 'admin', 'password': 'Admin@2026'})
    assert r.status_code == 200, r.text
    return {'Authorization': f'Bearer {r.json()["access_token"]}'}


def last_code(client, target: str) -> str:
    """Read the newest 6-digit code sent to a mobile / e-mail from the demo outbox."""
    msgs = client.get(f'{API}/demo/outbox', params={'q': target}).json()
    for m in msgs:
        found = re.search(r'\b(\d{6})\b', m['body'])
        if found:
            return found.group(1)
    raise AssertionError(f'no code sent to {target}')


def registration_payload(client, n: int = 1, district: str = 'Malir', industry: str = '91', **overrides) -> dict:
    """Verify contact details and return a complete registration body."""
    mobile, email = f'0333-11122{n:02d}', f'owner{n}@shop.example'
    assert client.post(f'{API}/registrations/contact/codes', json={'mobile': mobile, 'email': email}).status_code == 200
    r = client.post(f'{API}/registrations/contact/verify', json={
        'mobile': mobile, 'email': email, 'mobile_code': last_code(client, mobile), 'email_code': last_code(client, email)})
    assert r.status_code == 200, r.text
    token = r.json()['contact_token']
    documents = {}
    for k in REQUIRED_TYPES:
        up = upload(client, token, k, name=f'{k}.pdf')
        assert up.status_code == 201, up.text
        documents[k] = up.json()['file_id']
    body = {
        'contact_token': token, 'applicant_name': f'Owner {n}', 'cnic': f'42101-11122{n:02d}-1', 'mobile': mobile,
        'email': email, 'password': PASSWORD, 'employer_name': f'Shop {n}', 'business_address': f'Plot {n}, Main Road', 'business_type': 'Sole Proprietorship',
        'industry_code': industry, 'district': district, 'secp_no': '123456', 'ntn': '1234567-8', 'srb_no': 'SRB-123456', 'gps': '24.8, 67.0',
        'documents': documents,
        'contact_person': f'Owner {n}', 'designation': 'Owner', 'contact_mobile': mobile, 'contact_email': email,
        'expected_workers': 5, 'operations_started': '2026-01-01', 'declaration_accepted': True,
    }
    body.update(overrides)
    return body


def register_and_approve(client, admin_headers, n: int = 1, **kw) -> tuple[str, dict]:
    """Register an employer, approve it, sign in. Returns (EIN, auth headers)."""
    r = client.post(f'{API}/registrations', json=registration_payload(client, n, **kw))
    assert r.status_code == 201, r.text
    apps = client.get(f'{API}/admin/applications', headers=admin_headers).json()['items']
    app_id = next(a['id'] for a in apps if a['app_no'] == r.json()['app_no'])
    ein = client.post(f'{API}/admin/applications/{app_id}/approve', headers=admin_headers).json()['employer_no']
    login = client.post(f'{API}/auth/login', json={'login_id': ein, 'password': PASSWORD})
    assert login.status_code == 200, login.text
    return ein, {'Authorization': f'Bearer {login.json()["access_token"]}'}
