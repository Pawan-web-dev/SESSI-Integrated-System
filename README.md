# SESSI Integrated Management System

ESSI Sindh Employer Portal – monorepo.

| Folder              | Contents                                                              |
| ------------------- | --------------------------------------------------------------------- |
| `frontend/`         | React + TypeScript + Vite employer portal (see `frontend/README.md`)  |
| `backend/`          | Python FastAPI service (see `backend/README.md`)                      |
| `database/`         | PostgreSQL schema, ERD and data dictionary                            |
| `docs/`             | Architecture, API contracts, development guide, progress              |
| `design-reference/` | Approved design: `source/` (original HTML prototype)                  |

Quick start (needs Node.js and Python 3.11+). From the project folder:

```powershell
npm run dev            # backend (http://localhost:8000) + frontend (http://localhost:5173) together
npm run backend        # only the backend
npm run frontend       # only the frontend
```

Ctrl+C stops everything. The first run creates the Python environment, installs the packages and creates
`backend/.env` from `.env.example` (ask the team lead for the real `DATABASE_URL`). Every run updates the
database tables (`alembic upgrade head`), so pulling new code needs no extra steps.

Inside `backend/` you can also run `npm run dev`, `npm run seed`, `npm run create-admin` and `npm test`.
