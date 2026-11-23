# SESSI Integrated Management System

Sindh Employees' Social Security Institution (SESSI) – Employer Portal and supporting services.

| Folder              | Contents                                                                    | Status      |
| ------------------- | --------------------------------------------------------------------------- | ----------- |
| `frontend/`         | Employer Portal – React 19, TypeScript, Vite, Tailwind CSS                  | Working     |
| `backend/`          | REST API – Python, FastAPI                                                   | Scaffold    |
| `database/`         | PostgreSQL schema, ERD, data dictionary                                      | Planned     |
| `docs/`             | Architecture, development guide, API contracts, progress                    | –           |
| `design-reference/` | Approved UI design (single HTML file) that the frontend reproduces          | Reference   |

## Quick start

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 – demo logins are listed on the login page.

## Documentation

- [frontend/README.md](frontend/README.md) – folder structure, Tailwind theme, Employer Number, printing
- [docs/DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) – setup, scripts, conventions, git workflow
- [docs/SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md) – how the parts fit together
- [docs/API_INTEGRATION.md](docs/API_INTEGRATION.md) – connecting the frontend to the backend
- [docs/PROGRESS.md](docs/PROGRESS.md) – what is done and what is next
