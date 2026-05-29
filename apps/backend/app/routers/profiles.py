from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.profile import UserProfileCreate, UserProfileResponse
from app.services.profile_service import get_latest_profile, get_profile


router = APIRouter(tags=["profiles"])
DbSession = Annotated[Session, Depends(get_db)]


@router.post("/profile/validate", response_model=UserProfileCreate)
def validate_profile(profile: UserProfileCreate) -> UserProfileCreate:
    return profile


@router.get("/profiles/", response_model=UserProfileResponse | None)
@router.get("/profile/", response_model=UserProfileResponse | None, include_in_schema=False)
def read_latest_profile(db: DbSession, session_id: str | None = None) -> UserProfileResponse | None:
    return get_latest_profile(db, session_id)


@router.get("/profiles/{profile_id}", response_model=UserProfileResponse)
def read_profile(profile_id: str, db: DbSession) -> UserProfileResponse:
    profile = get_profile(db, profile_id)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found")

    return profile
