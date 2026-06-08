from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.profile import UserProfileCreate
from app.schemas.rag import RagChunkResponse
from app.schemas.recommendation import (
    RecommendationSummaryRequest,
    RecommendationSummaryResponse,
    RecommendationCompleteRequest,
    RecommendationCompleteResponse,
)
from app.services.profile_service import save_successful_recommendation
from app.services.recommendation_rank_service import get_relevant_chunks
from app.services.recommendation_summary_service import generate_recommendation_summary


router = APIRouter(prefix="/recommendations", tags=["recommendations"])
DbSession = Annotated[Session, Depends(get_db)]


class RecommendationRankRequest(BaseModel):
    profile: UserProfileCreate
    candidate_mouse_ids: list[str] = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=20)


@router.post("/complete", response_model=RecommendationCompleteResponse)
def complete_recommendation(
    request: RecommendationCompleteRequest,
    db: DbSession,
) -> RecommendationCompleteResponse:
    return save_successful_recommendation(db, request)


@router.post("/rank", response_model=list[RagChunkResponse])
def rank_recommendations(
    request: RecommendationRankRequest,
    db: DbSession,
) -> list[RagChunkResponse]:
    chunks = get_relevant_chunks(
        db=db,
        profile=request.profile,
        candidate_mouse_ids=request.candidate_mouse_ids,
        top_k=request.top_k,
    )
    return [RagChunkResponse.model_validate(item) for item in chunks]


@router.post("/summary", response_model=RecommendationSummaryResponse)
async def summarize_recommendations(
    request: RecommendationSummaryRequest,
    db: DbSession,
) -> RecommendationSummaryResponse:
    chunks = get_relevant_chunks(
        db=db,
        profile=request.profile,
        candidate_mouse_ids=request.candidate_mouse_ids,
        top_k=request.top_k,
    )
    summary = await generate_recommendation_summary(
        profile=request.profile,
        candidate_mouse_ids=request.candidate_mouse_ids,
        chunks=chunks,
        diagnostic_progress=request.diagnostic_progress,
        diagnostic_feedback=request.diagnostic_feedback,
        client_context=request.client_context,
    )
    return RecommendationSummaryResponse(
        summary=summary,
        candidate_mouse_ids=request.candidate_mouse_ids,
        evidence_chunks=[RagChunkResponse.model_validate(item) for item in chunks],
    )
