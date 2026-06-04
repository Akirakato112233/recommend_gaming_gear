from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select, text
from sqlalchemy.orm import Session, sessionmaker

import app.models  # noqa: F401
from app.core.config import settings
from app.data import MOUSE_SEED
from app.db.database import Base
from app.dependencies import get_db
from app.main import create_app
from app.models.mouse import MouseCatalog
from app.services.mouse_catalog_service import seed_mouse_catalog


TEST_SCHEMA = "test_mouse_catalog"
engine = create_engine(
    settings.database_url,
    connect_args={"options": f"-csearch_path={TEST_SCHEMA}"},
    pool_pre_ping=True,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
app = create_app(create_tables=False)


def override_get_db() -> Session:
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


def setup_function() -> None:
    reset_test_schema()
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        seed_mouse_catalog(db)
    finally:
        db.close()


def reset_test_schema() -> None:
    admin_engine = create_engine(settings.database_url, pool_pre_ping=True)
    try:
        with admin_engine.begin() as connection:
            connection.execute(text(f"DROP SCHEMA IF EXISTS {TEST_SCHEMA} CASCADE"))
            connection.execute(text(f"CREATE SCHEMA {TEST_SCHEMA}"))
    finally:
        admin_engine.dispose()

    engine.dispose()


def test_seed_mouse_catalog_persists_seed_items() -> None:
    db = TestingSessionLocal()
    try:
        mice = list(db.scalars(select(MouseCatalog)))
    finally:
        db.close()

    assert len(mice) == len(MOUSE_SEED)
    assert {mouse.id for mouse in mice} == {seed_item["id"] for seed_item in MOUSE_SEED}


def test_seed_mouse_catalog_is_idempotent() -> None:
    db = TestingSessionLocal()
    try:
        seed_mouse_catalog(db)
        mice = list(db.scalars(select(MouseCatalog)))
    finally:
        db.close()

    assert len(mice) == len(MOUSE_SEED)


def test_read_mice_returns_seeded_catalog() -> None:
    response = client.get("/api/mice/")
    mice = response.json()

    assert response.status_code == 200
    assert len(mice) == len(MOUSE_SEED)
    assert {"id", "name_mouse", "price_thb", "web_price_ref", "grip"}.issubset(
        mice[0].keys()
    )


def test_filters_mice_by_grip_style() -> None:
    response = client.get("/api/mice/filter", params={"grip_style": "palm"})
    mice = response.json()

    assert response.status_code == 200
    assert mice
    assert all("palm" in mouse["grip"] for mouse in mice)


def test_filters_mice_by_max_price() -> None:
    response = client.get("/api/mice/filter", params={"max_price_thb": 1000})
    mice = response.json()

    assert response.status_code == 200
    assert mice
    assert all(mouse["price_thb"] is not None for mouse in mice)
    assert all(mouse["price_thb"] <= 1500 for mouse in mice)


def test_filters_mice_by_min_price() -> None:
    response = client.get("/api/mice/filter", params={"min_price_thb": 3000})
    mice = response.json()

    assert response.status_code == 200
    assert mice
    assert all(mouse["price_thb"] is not None for mouse in mice)
    assert all(mouse["price_thb"] >= 2500 for mouse in mice)


def test_filters_mice_by_grip_and_max_price() -> None:
    response = client.get(
        "/api/mice/filter",
        params={"grip_style": "claw", "min_price_thb": 1000, "max_price_thb": 3000},
    )
    mice = response.json()

    assert response.status_code == 200
    assert mice
    assert all("claw" in mouse["grip"] for mouse in mice)
    assert all(mouse["price_thb"] is not None for mouse in mice)
    assert all(500 <= mouse["price_thb"] <= 3500 for mouse in mice)
