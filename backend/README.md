# Backend – SESSI API (FastAPI)

Status: **scaffold only**. The Employer Portal currently runs on demo data in the browser
(`frontend/src/services/portal`). This service will replace it.

## Run

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

## Layout

```
app/
├── main.py              FastAPI application
├── api/v1/endpoints/    route modules (employers, registrations, contributions, payments, ...)
├── core/                settings, security
├── db/                  database session, base model
├── models/              SQLAlchemy models
├── schemas/             Pydantic request/response models
├── services/            business logic (e.g. Employer Identification Number issuing)
└── tests/
alembic/versions/        database migrations
scripts/                 one-off admin scripts
```

The frontend expects the API at `VITE_API_BASE_URL` (default `http://localhost:8000/api/v1`).
See `../docs/API_INTEGRATION.md`.
