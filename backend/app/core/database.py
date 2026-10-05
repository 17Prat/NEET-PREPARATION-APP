from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.engine import Engine
from backend.app.core.config import settings

# Engine configuration supporting both SQLite and PostgreSQL with high concurrency
connect_args = {}
if settings.DATABASE_URL.startswith("sqlite"):
    connect_args = {
        "check_same_thread": False,
        "timeout": 30  # 30-second SQLite connection timeout to prevent locks
    }

engine = create_engine(
    settings.DATABASE_URL,
    connect_args=connect_args,
    pool_size=30 if not settings.DATABASE_URL.startswith("sqlite") else 5,
    max_overflow=50 if not settings.DATABASE_URL.startswith("sqlite") else 10,
    pool_timeout=30,
    pool_recycle=1800,
    echo=False
)

# High-concurrency SQLite tuning (WAL mode, busy timeout, memory cache)
@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    if settings.DATABASE_URL.startswith("sqlite"):
        cursor = dbapi_connection.cursor()
        try:
            # WAL mode allows simultaneous readers and writers without blocking
            cursor.execute("PRAGMA journal_mode = WAL")
            # NORMAL sync mode is safe and drastically faster for high write loads
            cursor.execute("PRAGMA synchronous = NORMAL")
            # 15-second busy timeout so concurrent transactions never fail with 'database is locked'
            cursor.execute("PRAGMA busy_timeout = 15000")
            # Cache size of 64MB in memory for instant lookups
            cursor.execute("PRAGMA cache_size = -64000")
            # Store temporary tables and indices in memory
            cursor.execute("PRAGMA temp_store = MEMORY")
            # Enable foreign key enforcement
            cursor.execute("PRAGMA foreign_keys = ON")
        except Exception:
            pass
        finally:
            cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

