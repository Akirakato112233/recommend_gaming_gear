from sqlalchemy.orm import Session

from app.models.rag import RagChunk
from app.rag.search import search_rag_chunks
from app.schemas.profile import Game, GripStyle, UserProfileCreate


DEFAULT_TOP_K = 8


def get_relevant_chunks(
    db: Session,
    profile: UserProfileCreate,
    candidate_mouse_ids: list[str],
    top_k: int = DEFAULT_TOP_K,
) -> list[RagChunk]:
    return search_rag_chunks(
        db=db,
        query_text=build_recommendation_query_text(profile),
        candidate_mouse_ids=candidate_mouse_ids,
        top_k=top_k,
    )


def build_recommendation_query_text(profile: UserProfileCreate) -> str:
    preference = profile.preference
    current_mouse = profile.current_mouse

    parts: list[str] = [
        f"User plays {profile.game.value}, a {_describe_game_aim(profile.game)} game.",
        f"User uses {_describe_grip(profile.grip_style)}.",
        f"User has {_describe_hand_size(profile.hand_length_mm)} and {_describe_hand_width(profile.hand_width_mm)}.",
        f"User currently uses {current_mouse.mouse_name}.",
    ]

    if current_mouse.likes:
        parts.append(f"They like {', '.join(current_mouse.likes)}.")
    if current_mouse.dislikes:
        parts.append(f"They dislike {', '.join(current_mouse.dislikes)}.")

    if preference.preferred_shape.value != "unknown":
        parts.append(f"They prefer a {preference.preferred_shape.value} shape.")
    if preference.connectivity.value == "wireless_only":
        parts.append("They prefer a wireless mouse.")

    return " ".join(parts)


def _describe_hand_size(hand_length_mm: float) -> str:
    if hand_length_mm < 170:
        return "small_hands small hands"
    if hand_length_mm <= 190:
        return "medium_hands medium hands"
    return "large_hands large hands"


def _describe_hand_width(hand_width_mm: float) -> str:
    if hand_width_mm < 85:
        return "narrow hand width"
    if hand_width_mm <= 100:
        return "medium hand width"
    return "wide hand width"


def _describe_game_aim(game: Game) -> str:
    if game in {Game.CS2, Game.VALORANT}:
        return "tactical FPS focused on stability, stopping power, flicking, and micro-adjustment"
    if game in {Game.APEX, Game.OW2}:
        return "tracking-heavy FPS focused on fast tracking and smooth aim"
    if game == Game.PUBG:
        return "battle royale FPS focused on stable tracking, recoil control, and flicking"
    return "FPS"


def _describe_grip(grip_style: GripStyle) -> str:
    if grip_style == GripStyle.PALM:
        return "palm_grip, palm grip"
    if grip_style == GripStyle.CLAW:
        return "claw_grip, claw grip, relaxed claw"
    if grip_style == GripStyle.FINGERTIP:
        return "fingertip, fingertip grip, finger freedom"
    return "hybrid grip, flexible grip"
