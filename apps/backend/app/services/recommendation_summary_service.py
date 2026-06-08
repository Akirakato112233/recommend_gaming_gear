from collections.abc import Sequence
from collections import Counter
import logging

import httpx

from app.core.config import settings
from app.models.rag import RagChunk
from app.schemas.recommendation import DiagnosticFeedbackInput
from app.schemas.profile import Game, GripStyle, UserProfileCreate


DEFAULT_MODEL = "qwen3:8b"
LOGGER = logging.getLogger(__name__)
OLLAMA_TIMEOUT = httpx.Timeout(connect=10.0, read=30.0, write=30.0, pool=10.0)
OLLAMA_OPTIONS = {
    "temperature": 0.2,
    "num_predict": 192,
}
SYSTEM_PROMPT = (
    "You are a gaming mouse recommendation assistant. "
    "Use only the provided candidate mice and evidence. "
    "Do not invent specs, prices, or availability. "
    "Choose up to 3 mice. "
    "Explain briefly in Thai. "
    "If evidence is weak, say what is uncertain."
)


async def generate_answer(
    system_prompt: str,
    user_prompt: str,
    model: str = DEFAULT_MODEL,
) -> str:
    async with httpx.AsyncClient(timeout=OLLAMA_TIMEOUT) as client:
        response = await client.post(
            f"{settings.ollama_base_url}/api/chat",
            json={
                "model": model,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "stream": False,
                "options": OLLAMA_OPTIONS,
            },
        )
        response.raise_for_status()

    data = response.json()
    message = data.get("message") or {}
    content = message.get("content")
    if isinstance(content, str) and content.strip():
        return content.strip()
    raise RuntimeError("Ollama response did not include message content")


async def generate_recommendation_summary(
    profile: UserProfileCreate,
    candidate_mouse_ids: list[str],
    chunks: Sequence[RagChunk],
    diagnostic_progress: dict[str, str] | None = None,
    diagnostic_feedback: dict[str, DiagnosticFeedbackInput] | None = None,
    client_context: str = "",
    model: str = DEFAULT_MODEL,
) -> str:
    system_prompt, user_prompt = build_recommendation_prompt(
        profile=profile,
        candidate_mouse_ids=candidate_mouse_ids,
        chunks=chunks,
        diagnostic_progress=diagnostic_progress,
        diagnostic_feedback=diagnostic_feedback,
        client_context=client_context,
    )
    try:
        return await generate_answer(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            model=model,
        )
    except (httpx.HTTPError, RuntimeError) as exc:
        LOGGER.warning("Falling back to heuristic summary after Ollama failure: %s", exc)
        return build_fallback_recommendation_summary(profile, candidate_mouse_ids, chunks)


def build_recommendation_user_prompt(
    profile: UserProfileCreate,
    candidate_mouse_ids: list[str],
    chunks: Sequence[RagChunk],
    diagnostic_progress: dict[str, str] | None = None,
    diagnostic_feedback: dict[str, DiagnosticFeedbackInput] | None = None,
    client_context: str = "",
) -> str:
    lines = [
        "User profile:",
        f"- game: {profile.game.value} ({_describe_game_aim(profile.game)})",
        f"- grip: {_describe_grip(profile.grip_style)}",
        f"- hand size: {_describe_hand_size(profile.hand_length_mm)}",
        f"- hand width: {_describe_hand_width(profile.hand_width_mm)}",
        f"- current mouse: {profile.current_mouse.mouse_name}",
    ]

    if profile.current_mouse.likes:
        lines.append(f"- likes: {', '.join(profile.current_mouse.likes)}")
    if profile.current_mouse.dislikes:
        lines.append(f"- dislikes: {', '.join(profile.current_mouse.dislikes)}")

    if profile.preference.preferred_shape.value != "unknown":
        lines.append(f"- preferred shape: {profile.preference.preferred_shape.value}")
    if profile.preference.connectivity.value == "wireless_only":
        lines.append("- connectivity: wireless only")

    if diagnostic_progress:
        lines.extend(["", "Diagnostic progress:"])
        for key, status in sorted(diagnostic_progress.items()):
            lines.append(f"- {key}: {status}")

    if diagnostic_feedback:
        lines.extend(["", "Diagnostic feedback:"])
        for key, feedback in sorted(diagnostic_feedback.items()):
            lines.extend(
                [
                    f"- {key}: {feedback.feel}",
                    f"  note: {feedback.note}",
                    f"  updated_at: {feedback.updated_at}",
                ]
            )

    if client_context.strip():
        lines.extend(["", "Extra client context:", client_context.strip()])

    lines.extend(
        [
            "",
            "Allowed candidate mouse ids:",
            *[f"- {mouse_id}" for mouse_id in candidate_mouse_ids],
            "",
            "Evidence chunks:",
        ]
    )

    for index, chunk in enumerate(chunks, start=1):
        lines.extend(
            [
                f"{index}. [{chunk.mouse_id}] {chunk.mouse_name} - {chunk.topic}",
                _clip_text(chunk.content, 500),
            ]
        )

    lines.extend(
        [
            "",
            "Task:",
            "Pick the best 3 mice from the allowed candidates only.",
            "Explain why each one fits the user.",
            "Mention any uncertainty or tradeoff.",
            "Return concise Thai.",
        ]
    )
    return "\n".join(lines)


def build_fallback_recommendation_summary(
    profile: UserProfileCreate,
    candidate_mouse_ids: list[str],
    chunks: Sequence[RagChunk],
) -> str:
    if not chunks:
        return "ยังไม่มี evidence chunks เพียงพอสำหรับสรุป"

    counts = Counter(chunk.mouse_id for chunk in chunks)
    chunk_by_mouse: dict[str, RagChunk] = {}
    for chunk in chunks:
        chunk_by_mouse.setdefault(chunk.mouse_id, chunk)

    lines = [
        "สรุปสำรองจาก evidence ชุดนี้",
        f"ผู้ใช้: {profile.game.value} / {profile.grip_style.value} / {_describe_hand_size(profile.hand_length_mm)}",
        "ตัวที่น่าลองก่อน:",
    ]

    for rank, (mouse_id, chunk_count) in enumerate(counts.most_common(3), start=1):
        chunk = chunk_by_mouse[mouse_id]
        lines.append(
            f"{rank}. {chunk.mouse_name} - เห็น evidence {chunk_count} ชิ้น, โฟกัส {chunk.topic}"
        )

    lines.extend(
        [
            "",
            "หมายเหตุ: เลือกจาก candidate ที่ผ่าน filter แล้ว",
            f"candidate ids: {', '.join(candidate_mouse_ids)}",
        ]
    )
    return "\n".join(lines)


def build_recommendation_prompt(
    profile: UserProfileCreate,
    candidate_mouse_ids: list[str],
    chunks: Sequence[RagChunk],
    diagnostic_progress: dict[str, str] | None = None,
    diagnostic_feedback: dict[str, DiagnosticFeedbackInput] | None = None,
    client_context: str = "",
) -> tuple[str, str]:
    return SYSTEM_PROMPT, build_recommendation_user_prompt(
        profile=profile,
        candidate_mouse_ids=candidate_mouse_ids,
        chunks=chunks,
        diagnostic_progress=diagnostic_progress,
        diagnostic_feedback=diagnostic_feedback,
        client_context=client_context,
    )


def _describe_hand_size(hand_length_mm: float) -> str:
    if hand_length_mm < 170:
        return "small_hands / small hands"
    if hand_length_mm <= 190:
        return "medium_hands / medium hands"
    return "large_hands / large hands"


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
        return "palm grip"
    if grip_style == GripStyle.CLAW:
        return "claw grip"
    if grip_style == GripStyle.FINGERTIP:
        return "fingertip grip"
    return "hybrid grip"


def _clip_text(text: str, limit: int) -> str:
    if len(text) <= limit:
        return text
    return f"{text[: limit - 1].rstrip()}…"
