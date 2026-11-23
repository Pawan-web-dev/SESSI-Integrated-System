# System Architecture

Monorepo:

- **frontend** – React 19 + TypeScript + Vite + React Router (hash routes). Feature-based folders
  (`src/features/<feature>/pages|components|...`), shared UI in `src/components`, data access in
  `src/services`. Details: `frontend/README.md`.
- **backend** – Python + FastAPI (planned).
- **database** – PostgreSQL (planned).

## Frontend data flow

Pages → `src/services/portal` (demo data in browser localStorage today) → later `src/services/api`
(axios client, base URL from `VITE_API_BASE_URL`) → FastAPI backend.

No global state library is used: each page keeps its own state and reads/writes through the service layer.
