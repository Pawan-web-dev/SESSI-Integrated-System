"""Load the master data the system needs (Directorates, districts, Industry Classifications).

    python -m app.seed

Safe to run again: only missing rows are added. No demo accounts are created; create the first
ESSI administrator with:  python -m app.create_admin
"""
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.services.master_data import load_master_data


def main() -> None:
    Base.metadata.create_all(engine)  # no-op for tables already created by Alembic migrations
    with SessionLocal() as db:
        load_master_data(db)
        db.commit()
    print('Master data loaded (Directorates, districts, Industry Classifications).')


if __name__ == '__main__':
    main()
