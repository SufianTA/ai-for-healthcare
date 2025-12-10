import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./surgitrack.db")

# Ensure SQLite target directory exists when using file-based SQLite (e.g., /data/surgitrack.db).
if DATABASE_URL.startswith("sqlite") and not DATABASE_URL.endswith(":memory:"):
    sqlite_path = DATABASE_URL.replace("sqlite:///", "", 1)
    sqlite_dir = os.path.dirname(sqlite_path) or "."
    if sqlite_dir and not os.path.exists(sqlite_dir):
        os.makedirs(sqlite_dir, exist_ok=True)

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
