# Backend – SESSI Employer Portal API

FastAPI + SQLAlchemy 2 + Alembic. PostgreSQL in production; SQLite works for local development and tests
without installing anything.

## Run (Windows PowerShell)

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements-dev.txt
Copy-Item .env.example .env          # settings and credentials – see "Settings (.env)" below
alembic upgrade head                 # create / update the database tables
python -m app.seed                   # master data: Directorates, districts, Industry Classifications
python -m app.create_admin           # first ESSI admin account (asks for a password)
uvicorn app.main:app --reload --port 8000
```

- API documentation (try every endpoint): http://localhost:8000/docs
- Tests: `pytest` (each test uses its own temporary database)

The database starts **empty**: there are no demo employers, employees or payments. Everything you see
in the portal is data you entered:

1. Register an employer at `http://localhost:5173/#/register`. The SMS / e-mail verification codes
   are written to the outbox; while `DEMO_MODE=true` you can read them at `#/inbox` (no SMS gateway yet).
2. Sign in at `#/admin` with the account from `create_admin` and approve the application. This issues the
   Employer No. (EIN).
3. Log in at `#/login` with the Employer No. (or CNIC / e-mail) and the password chosen at registration.

More ESSI staff accounts: `python -m app.create_admin --username officer1 --name "Officer Name" --role officer`.
Running it again for an existing username sets a new password.

To start over with an empty database: stop the server, delete `sessi.db`, then run
`alembic upgrade head`, `python -m app.seed` and `python -m app.create_admin` again.

## Settings (.env)

All addresses and credentials are in `backend/.env` (never committed; `.env.example` lists every option).
Restart the API after changing it.

| Group | Variables | Notes |
| --- | --- | --- |
| General | `ENVIRONMENT`, `FRONTEND_URL`, `CORS_ORIGINS`, `DEMO_MODE` | `DEMO_MODE=false` in production |
| Database | `DATABASE_URL` | Neon PostgreSQL (paste the connection string as Neon shows it), or `sqlite:///./sessi.db` for offline work |
| Sign-in | `JWT_SECRET`, `ACCESS_TOKEN_MINUTES` | long random secret |
| First admin | `ADMIN_USERNAME`, `ADMIN_NAME`, `ADMIN_PASSWORD` | created at start-up when no admin exists; then clear the password |
| E-mail | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD`, `SMTP_FROM`, `SMTP_USE_TLS` | empty host = outbox only |
| SMS | `SMS_API_URL`, `SMS_API_KEY`, `SMS_SENDER_ID` | empty URL = outbox only; adapt `_send_sms` in `services/delivery.py` to the provider |
| Delivery | `DELIVERY_INTERVAL_SECONDS`, `DELIVERY_MAX_ATTEMPTS` | background sender retries failures |
| Payments | `ONELINK_API_URL`, `ONELINK_CLIENT_ID`, `ONELINK_CLIENT_SECRET`, `ONELINK_BILL_PREFIX` | not connected yet |
| Documents | `UPLOAD_DIR`, `MAX_UPLOAD_MB` | back up `UPLOAD_DIR` together with the database |

Every SMS / e-mail is first written to `outbox_messages`. When SMTP or the SMS gateway is set, a background
worker sends queued messages and records `sms_status` / `email_status` (`sent`, `failed` after the last retry)
and `last_error`.

## Database on Neon

The database is hosted on [Neon](https://console.neon.tech) (PostgreSQL). `DATABASE_URL` in `.env` holds the
connection string from Neon's *Connect* button – the pooled one (host contains `-pooler`) is fine for the app and
for migrations. After pulling new code run `alembic upgrade head` once; it updates the tables on Neon.
Neon pauses an idle database: the first request after a pause takes a second or two, the app reconnects by itself.
The tests never touch Neon – they use their own temporary SQLite database.

## Registration documents

- `POST /registrations/documents` (multipart, needs the `contact_token`) stores one file and returns a `file_id`;
  the application sends those ids in `documents`. Only PDF, JPG and PNG are accepted – checked from the file's
  content, not its name – up to `MAX_UPLOAD_MB`.
- Files are saved under `UPLOAD_DIR/registration/YYYY/MM/<random id>.<ext>`; the user's file name is only kept
  in the database.
- ESSI officers open them from the review window (`GET /admin/applications/{id}/documents/{doc_id}`, each view is
  written to the audit trail); employers see their own under Company Profile → Mandatory Documents
  (`GET /employer/documents/{doc_id}/file`).

## Folder structure

```
app/
├── main.py                 FastAPI app, CORS, error handling
├── core/                   config.py (settings from .env), security.py (passwords, tokens)
├── db/                     base.py (model base), session.py (engine, session per request)
├── models/                 database tables – one file per area
├── schemas/                request / response shapes
├── services/               business rules – no HTTP code here
│   ├── ein.py              Employer Identification Number
│   ├── registration.py     contact verification, submit, track, approve / reject
│   ├── auth.py             login, lock, one-time codes, passwords
│   ├── employees.py
│   ├── contributions.py    F-4 / C-1, challans, late payment, receipts
│   ├── change_requests.py  incl. Industry Classification change
│   ├── master_data.py      Directorates and industries
│   ├── files.py            checking and storing uploaded files
│   ├── delivery.py         sending the outbox by SMTP / SMS gateway
│   └── notify.py           SMS / e-mail outbox and audit trail
├── api/
│   ├── deps.py             signed-in employer / admin
│   └── v1/endpoints/       public.py, employer.py, admin.py
├── seed.py                 master data (Directorates, districts, industries)
└── create_admin.py         create an ESSI admin / officer account
alembic/versions/           database migrations
tests/                      pytest suite
```

## Business rules

| Rule | Where |
| --- | --- |
| EIN `DDD-II-NNNNNN[-BB]`: Directorate + Industry + serial, issued on approval, permanent, never re-issued | `services/ein.py` |
| Directorate assigned from the district; Industry Classification mandatory | `services/registration.py` |
| Approval workflow only when `industry_classifications.approval_required` is true (currently all) | `services/registration.py` |
| 5 failed logins → locked for 60 seconds | `services/auth.py`, settings |
| Contribution = 6% × min(wage, 37,000) × days / 30; challan due on the last day of the month; PKR 40 service charges | `services/contributions.py`, settings |
| Late payment: +0.5% of the contribution per day, maximum 50% (section 24(1)) | `services/contributions.py` |
| Industry change only through an approved change request; EIN unchanged; written to the audit trail | `services/change_requests.py` |

The percentages and amounts are settings (`app/core/config.py`) – confirm them with SESSI before go-live.

## Database changes

1. Change or add a model in `app/models/`.
2. `alembic revision --autogenerate -m "short description"` and review the generated file.
3. `alembic upgrade head`.
4. Regenerate `../database/schema.sql` (command at the top of that file).

## Production checklist

- `ENVIRONMENT=production`, a long random `JWT_SECRET`, `DEMO_MODE=false` (the app refuses to start otherwise).
- PostgreSQL `DATABASE_URL`; run `alembic upgrade head`, `python -m app.seed` and `python -m app.create_admin`.
- Replace placeholder Directorate / Industry codes with SESSI's official list before issuing real numbers.
- Fill in the SMTP and SMS gateway settings, and connect 1LINK to confirm payments
  (the `/challans/{no}/pay` endpoint is a demo stand-in).
- Put `UPLOAD_DIR` on backed-up storage outside the web root.
