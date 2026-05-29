from pydantic import BaseModel, Field

from app.schemas.profile import UserProfileCreate, UserProfileResponse


class RecommendationCompleteRequest(BaseModel):
    profile: UserProfileCreate
    recommendation_summary: str = Field(min_length=1, max_length=2000)


class RecommendationCompleteResponse(BaseModel):
    profile: UserProfileResponse
    recommendation_summary: str
