from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.recommendation import RecommendationCompleteRequest, RecommendationCompleteResponse
from app.services.profile_service import save_successful_recommendation


router = APIRouter(prefix="/recommendations", tags=["recommendations"])
DbSession = Annotated[Session, Depends(get_db)]


@router.post("/complete", response_model=RecommendationCompleteResponse)
def complete_recommendation(
    request: RecommendationCompleteRequest,
    db: DbSession,
) -> RecommendationCompleteResponse:
    return save_successful_recommendation(db, request)
