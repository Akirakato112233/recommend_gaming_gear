from fastapi.testclient import TestClient

from app.main import create_app
from app.models.rag import RagChunk
from app.routers import rag


app = create_app(create_tables=False)
client = TestClient(app)


def test_rag_search_returns_ranked_chunks() -> None:
    def fake_search_rag_chunks(
        db,
        query_text: str,
        candidate_mouse_ids: list[str],
        top_k: int,
    ) -> list[RagChunk]:
        assert query_text == "Grip: claw\nDislikes: unstable flick"
        assert candidate_mouse_ids == ["attack_shark_x3"]
        assert top_k == 3
        return [
            RagChunk(
                id="chunk-1",
                mouse_id="attack_shark_x3",
                mouse_name="Attack Shark X3",
                topic="Summary",
                content="Small claw/fingertip budget mouse.",
                embedding=[0.0] * 768,
            )
        ]

    original_search = rag.search_rag_chunks
    rag.search_rag_chunks = fake_search_rag_chunks
    try:
        response = client.post(
            "/api/rag/search",
            json={
                "query_text": "Grip: claw\nDislikes: unstable flick",
                "candidate_mouse_ids": ["attack_shark_x3"],
                "top_k": 3,
            },
        )
    finally:
        rag.search_rag_chunks = original_search

    assert response.status_code == 200
    assert response.json() == [
        {
            "id": "chunk-1",
            "mouse_id": "attack_shark_x3",
            "mouse_name": "Attack Shark X3",
            "topic": "Summary",
            "content": "Small claw/fingertip budget mouse.",
        }
    ]


def test_rag_search_requires_candidate_mouse_ids() -> None:
    response = client.post(
        "/api/rag/search",
        json={"query_text": "Grip: claw", "candidate_mouse_ids": []},
    )

    assert response.status_code == 422
