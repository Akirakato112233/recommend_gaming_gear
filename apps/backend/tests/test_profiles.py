from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401
from app.db.database import Base
from app.dependencies import get_db
from app.main import create_app


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
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
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def test_profile_validate_does_not_persist_profile() -> None:
    payload = {
        "game": "valorant",
        "dpi": 800,
        "grip_style": "claw",
        "hand_length_mm": 185,
        "hand_width_mm": 95.5,
        "current_mouse": {
            "mouse_name": "Logitech G Pro X Superlight",
            "likes": ["เบา", "wireless", "balance"],
            "dislikes": ["ลื่น", "click ไม่ชอบ"],
        },
        "preference": {
            "preferred_shape": "symmetric",
            "connectivity": "wireless_only",
            "budget_min_thb": 3000,
            "budget_max_thb": 6000,
            "thailand_only": True,
        },
    }

    validate_response = client.post("/api/profile/validate", json=payload)
    read_response = client.get("/api/profiles/")

    assert validate_response.status_code == 200
    assert read_response.status_code == 200
    assert read_response.json() is None


def test_complete_recommendation_persists_and_reads_latest_profile() -> None:
    payload = {
        "profile": {
            "game": "valorant",
            "dpi": 800,
            "grip_style": "claw",
            "hand_length_mm": 185,
            "hand_width_mm": 95.5,
            "current_mouse": {
                "mouse_name": "Logitech G Pro X Superlight",
                "likes": ["เบา", "wireless", "balance"],
                "dislikes": ["ลื่น", "click ไม่ชอบ"],
            },
            "preference": {
                "preferred_shape": "symmetric",
                "connectivity": "wireless_only",
                "budget_min_thb": 3000,
                "budget_max_thb": 6000,
                "thailand_only": True,
            },
        },
        "recommendation_summary": "Matched with a light symmetric wireless mouse.",
    }

    complete_response = client.post("/api/recommendations/complete", json=payload)
    read_response = client.get("/api/profiles/")

    assert complete_response.status_code == 200
    assert read_response.status_code == 200
    assert complete_response.json()["profile"]["id"] == read_response.json()["id"]
    assert complete_response.json()["profile"]["session_id"] == read_response.json()["session_id"]
    assert read_response.json()["game"] == "valorant"


def test_reads_profile_by_id() -> None:
    payload = {
        "game": "apex",
        "dpi": 1600,
        "grip_style": "fingertip",
        "hand_length_mm": 178,
        "hand_width_mm": 88,
        "current_mouse": {"mouse_name": "Razer Viper V3 Pro"},
    }

    complete_response = client.post(
        "/api/recommendations/complete",
        json={
            "profile": payload,
            "recommendation_summary": "Matched with fingertip-friendly shape.",
        },
    )
    profile_id = complete_response.json()["profile"]["id"]
    read_response = client.get(f"/api/profiles/{profile_id}")

    assert read_response.status_code == 200
    assert read_response.json()["id"] == profile_id


def test_rejects_unsupported_game() -> None:
    response = client.post(
        "/api/profile/validate",
        json={
            "game": "fortnite",
            "dpi": 800,
            "grip_style": "palm",
            "hand_length_mm": 180,
            "hand_width_mm": 90,
            "current_mouse": {"mouse_name": "Test Mouse"},
        },
    )

    assert response.status_code == 422


def test_rejects_non_positive_hand_size() -> None:
    response = client.post(
        "/api/profile/validate",
        json={
            "game": "cs2",
            "dpi": 800,
            "grip_style": "palm",
            "hand_length_mm": 0,
            "hand_width_mm": 90,
            "current_mouse": {"mouse_name": "Test Mouse"},
        },
    )

    assert response.status_code == 422
