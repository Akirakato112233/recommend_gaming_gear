from uuid import uuid4

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.profile import MouseFitProfile
from app.models.session import UserSession
from app.schemas.profile import CurrentMouseFeedback, UserPreference, UserProfileCreate, UserProfileResponse
from app.schemas.recommendation import RecommendationCompleteRequest, RecommendationCompleteResponse


def save_successful_recommendation(
    db: Session,
    request: RecommendationCompleteRequest,
) -> RecommendationCompleteResponse:
    profile = create_profile(db, request.profile)

    return RecommendationCompleteResponse(
        profile=profile,
        recommendation_summary=request.recommendation_summary,
    )


def create_profile(db: Session, profile: UserProfileCreate) -> UserProfileResponse:
    session = UserSession(anonymous_id=str(uuid4()))
    db.add(session)
    db.flush()

    profile_row = MouseFitProfile(
        session_id=session.id,
        game=profile.game.value,
        dpi=profile.dpi,
        sensitivity=profile.sensitivity,
        grip_style=profile.grip_style.value,
        hand_length_mm=profile.hand_length_mm,
        hand_width_mm=profile.hand_width_mm,
        current_mouse_name=profile.current_mouse.mouse_name,
        liked_features=profile.current_mouse.likes,
        disliked_features=profile.current_mouse.dislikes,
        preference=profile.preference.model_dump(mode="json"),
    )
    db.add(profile_row)
    db.commit()
    db.refresh(profile_row)

    return serialize_profile(profile_row)


def get_profile(db: Session, profile_id: str) -> UserProfileResponse | None:
    profile_row = db.get(MouseFitProfile, profile_id)
    if profile_row is None:
        return None

    return serialize_profile(profile_row)


def get_latest_profile(db: Session, session_id: str | None = None) -> UserProfileResponse | None:
    statement = select(MouseFitProfile).order_by(MouseFitProfile.created_at.desc())
    if session_id is not None:
        statement = statement.where(MouseFitProfile.session_id == session_id)

    profile_row = db.scalars(statement).first()
    if profile_row is None:
        return None

    return serialize_profile(profile_row)


def serialize_profile(profile: MouseFitProfile) -> UserProfileResponse:
    return UserProfileResponse(
        id=profile.id,
        session_id=profile.session_id,
        game=profile.game,
        dpi=profile.dpi,
        sensitivity=profile.sensitivity,
        grip_style=profile.grip_style,
        hand_length_mm=profile.hand_length_mm,
        hand_width_mm=profile.hand_width_mm,
        current_mouse=CurrentMouseFeedback(
            mouse_name=profile.current_mouse_name,
            likes=profile.liked_features,
            dislikes=profile.disliked_features,
        ),
        preference=UserPreference(**profile.preference),
    )
