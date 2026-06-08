from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.services.web_search_service import WebSearchError, search_web


router = APIRouter(prefix="/web-search", tags=["web-search"])


class WebSearchRequest(BaseModel):
    query: str = Field(..., min_length=1)
    max_results: int = Field(default=5, ge=1, le=10)


class WebSearchResultResponse(BaseModel):
    title: str
    url: str
    snippet: str


@router.post("", response_model=list[WebSearchResultResponse])
def web_search(request: WebSearchRequest) -> list[WebSearchResultResponse]:
    try:
        return search_web(
            query=request.query,
            max_results=request.max_results,
        )
    except WebSearchError as exc:
        raise HTTPException(status_code=502, detail=str(exc)) from exc
