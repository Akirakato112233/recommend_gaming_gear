from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
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
    drop_legacy_sensitivity_column()
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


def drop_legacy_sensitivity_column() -> None:
    with engine.begin() as connection:
        inspector = inspect(connection)
        if not inspector.has_table("mouse_fit_profiles"):
            return

        column_names = {
            column["name"] for column in inspector.get_columns("mouse_fit_profiles")
        }
        if "sensitivity" not in column_names:
            return

        if connection.dialect.name == "postgresql":
            connection.execute(
                text("ALTER TABLE mouse_fit_profiles DROP COLUMN IF EXISTS sensitivity")
            )
            return

        if connection.dialect.name == "sqlite":
            connection.execute(text("ALTER TABLE mouse_fit_profiles DROP COLUMN sensitivity"))


def get_db_session() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
