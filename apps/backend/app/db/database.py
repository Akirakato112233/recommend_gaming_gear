from collections.abc import Generator

from sqlalchemy import create_engine, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.core.config import settings


class Base(DeclarativeBase):
    pass


engine = create_engine(settings.database_url, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_database_tables() -> None:
    import app.models  # noqa: F401

    create_vector_extension()
    Base.metadata.create_all(bind=engine)
    seed_reference_data()


def create_vector_extension() -> None:
    if engine.dialect.name != "postgresql":
        return

    with engine.begin() as connection:
        connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))


def seed_reference_data() -> None:
    from app.services.mouse_catalog_service import seed_mouse_catalog

    db = SessionLocal()
    try:
        seed_mouse_catalog(db)
    finally:
        db.close()


def get_db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
