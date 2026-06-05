from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.rag.search import search_rag_chunks
from app.schemas.rag import RagChunkResponse, RagSearchRequest


router = APIRouter(prefix="/rag", tags=["rag"])
DbSession = Annotated[Session, Depends(get_db)]


@router.post("/search", response_model=list[RagChunkResponse])
def search_rag(request: RagSearchRequest, db: DbSession) -> list[RagChunkResponse]:
    return search_rag_chunks(
        db=db,
        query_text=request.query_text,
        candidate_mouse_ids=request.candidate_mouse_ids,
    )
