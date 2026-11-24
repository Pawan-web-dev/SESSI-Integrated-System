# Database – PostgreSQL

The tables are defined in code (`backend/app/models`) and created with Alembic migrations
(`backend/alembic/versions`). Do not create or change tables by hand.

| File | Contents |
| --- | --- |
| `schema.sql` | Full PostgreSQL DDL, generated from the migrations (for review / DBA use) |
| `documentation/DATABASE_SCHEMA.md` | Tables grouped by area, keys and rules |
| `documentation/ERD.md` | Entity relationship diagram |
| `documentation/DATA_DICTIONARY.md` | Meaning and format of the important fields |

## Create the database

```sql
CREATE USER sessi WITH PASSWORD 'CHANGE_ME';
CREATE DATABASE sessi OWNER sessi;
```

Then in `backend/.env` set `DATABASE_URL=postgresql+psycopg://sessi:CHANGE_ME@localhost:5432/sessi` and run:

```powershell
cd backend
alembic upgrade head
python -m app.seed --master
```

Use `python -m app.seed` (without `--master`) on a development database to add the demo accounts.
