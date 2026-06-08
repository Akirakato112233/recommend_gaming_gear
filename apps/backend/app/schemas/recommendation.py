from pydantic import BaseModel, Field, AliasChoices

from app.schemas.profile import UserProfileCreate, UserProfileResponse
from app.schemas.rag import RagChunkResponse


class RecommendationCompleteRequest(BaseModel):
    profile: UserProfileCreate
    recommendation_summary: str = Field(min_length=1, max_length=2000)


class RecommendationCompleteResponse(BaseModel):
    profile: UserProfileResponse
    recommendation_summary: str


class DiagnosticFeedbackInput(BaseModel):
    feel: str
    note: str
    updated_at: str = Field(
        validation_alias=AliasChoices("updated_at", "updatedAt"),
    )


class RecommendationSummaryRequest(BaseModel):
    profile: UserProfileCreate
    candidate_mouse_ids: list[str] = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=20)
    diagnostic_progress: dict[str, str] = Field(default_factory=dict)
    diagnostic_feedback: dict[str, DiagnosticFeedbackInput] = Field(default_factory=dict)
    client_context: str = ""


class RecommendationSummaryResponse(BaseModel):
    summary: str
    candidate_mouse_ids: list[str]
    evidence_chunks: list[RagChunkResponse]
