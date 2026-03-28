import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# ✅ Get DB URL from Railway environment
DATABASE_URL = os.getenv("DATABASE_URL")

# 🚨 Fix for PostgreSQL URL (Railway sometimes gives old format)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# ✅ Create engine
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # prevents stale connection errors
)

# ✅ Session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ✅ Base class for models
Base = declarative_base()


# ✅ Dependency (FastAPI use)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()