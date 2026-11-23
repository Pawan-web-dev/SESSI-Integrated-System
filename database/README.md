# Database – PostgreSQL

Status: **planned**. Design notes are in `documentation/`:

- `DATABASE_SCHEMA.md` – tables and columns
- `ERD.md` – entity relationships
- `DATA_DICTIONARY.md` – field definitions

Master data that must exist from day one (currently defined in
`frontend/src/services/portal/masterData.ts`):

- **Directorates** – 3-digit code, name, districts served
- **Industry Classifications** – 2-digit code, name, approval-required flag
- **EIN registry** – every Employer Identification Number ever issued (never deleted or re-used)

Migrations will live in `backend/alembic/versions/`.
