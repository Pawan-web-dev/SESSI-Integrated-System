"""Database engine and session per request."""
from collections.abc import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import get_settings

settings = get_settings()

if settings.is_sqlite:
    engine = create_engine(settings.database_url, connect_args={'check_same_thread': False})
else:
    # PostgreSQL (e.g. Neon). Neon suspends an idle database and closes its connections, so connections are
    # checked before use and renewed every 5 minutes. On the pooled endpoint (PgBouncer) psycopg must not
    # create server-side prepared statements.
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_recycle=300,
        pool_size=5,
        max_overflow=5,
        connect_args={'prepare_threshold': None} if settings.is_pooled_postgres else {},
    )

if settings.is_sqlite:

    @event.listens_for(engine, 'connect')
    def _sqlite_foreign_keys(dbapi_connection, _record):  # pragma: no cover - driver hook
        cursor = dbapi_connection.cursor()
        cursor.execute('PRAGMA foreign_keys=ON')
        cursor.close()


SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_db() -> Iterator[Session]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
