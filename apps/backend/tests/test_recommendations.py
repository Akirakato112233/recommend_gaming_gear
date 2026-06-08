from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

import app.models  # noqa: F401
from app.db.database import Base
from app.dependencies import get_db
from app.main import create_app
from app.models.rag import RagChunk
from app.routers import recommendations
from app.schemas.profile import Game


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


def test_recommendations_rank_returns_chunks() -> None:
    def fake_get_relevant_chunks(
        db,
        profile,
        candidate_mouse_ids: list[str],
        top_k: int,
    ) -> list[RagChunk]:
        assert candidate_mouse_ids == ["logitech-g-pro-x-superlight-2"]
        assert top_k == 8
        assert profile.game == Game.VALORANT
        return [
            RagChunk(
                id="chunk-1",
                mouse_id="logitech-g-pro-x-superlight-2",
                mouse_name="Logitech G Pro X Superlight 2",
                topic="Summary",
                content="Safe symmetrical shape for claw and relaxed claw.",
                embedding=[0.0] * 768,
            )
        ]

    original_get_relevant_chunks = recommendations.get_relevant_chunks
    recommendations.get_relevant_chunks = fake_get_relevant_chunks
    try:
        response = client.post(
            "/api/recommendations/rank",
            json={
                "profile": {
                    "game": "valorant",
                    "dpi": 800,
                    "grip_style": "claw",
                    "hand_length_mm": 185,
                    "hand_width_mm": 95.5,
                    "current_mouse": {
                        "mouse_name": "Logitech G Pro X Superlight",
                        "likes": ["wireless", "balance"],
                        "dislikes": ["ลื่น"],
                    },
                    "preference": {
                        "preferred_shape": "symmetric",
                        "connectivity": "wireless_only",
                        "budget_min_thb": 3000,
                        "budget_max_thb": 6000,
                        "thailand_only": True,
                    },
                },
                "candidate_mouse_ids": ["logitech-g-pro-x-superlight-2"],
            },
        )
    finally:
        recommendations.get_relevant_chunks = original_get_relevant_chunks

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": "chunk-1",
            "mouse_id": "logitech-g-pro-x-superlight-2",
            "mouse_name": "Logitech G Pro X Superlight 2",
            "topic": "Summary",
            "content": "Safe symmetrical shape for claw and relaxed claw.",
        }
    ]
