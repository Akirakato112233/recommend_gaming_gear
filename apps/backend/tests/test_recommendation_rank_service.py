from app.schemas.profile import UserProfileCreate
from app.services import recommendation_rank_service


def test_get_relevant_chunks_normalizes_candidate_ids() -> None:
    profile = UserProfileCreate.model_validate(
        {
            "game": "valorant",
            "dpi": 800,
            "grip_style": "claw",
            "hand_length_mm": 185,
            "hand_width_mm": 95.5,
            "current_mouse": {
                "mouse_name": "Logitech G Pro X Superlight",
                "likes": ["wireless"],
                "dislikes": [],
            },
        }
    )

    captured = {}

    def fake_search_rag_chunks(db, query_text: str, candidate_mouse_ids: list[str], top_k: int):
        captured["candidate_mouse_ids"] = candidate_mouse_ids
        captured["query_text"] = query_text
        captured["top_k"] = top_k
        return []

    original_search_rag_chunks = recommendation_rank_service.search_rag_chunks
    recommendation_rank_service.search_rag_chunks = fake_search_rag_chunks
    try:
        recommendation_rank_service.get_relevant_chunks(
            db=object(),
            profile=profile,
            candidate_mouse_ids=[
                "logitech-g-pro-x-superlight-2",
                "razer-viper-v3-pro-wireless",
            ],
            top_k=3,
        )
    finally:
        recommendation_rank_service.search_rag_chunks = original_search_rag_chunks

    assert captured["candidate_mouse_ids"] == [
        "logitech_g_pro_x_superlight_2",
        "razer_viper_v3_pro_wireless",
    ]
    assert "claw grip" in captured["query_text"]
    assert captured["top_k"] == 3
