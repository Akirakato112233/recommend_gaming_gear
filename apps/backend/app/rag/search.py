from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.rag import RagChunk
from app.rag.embed import OllamaEmbeddingClient
from app.rag.ingest import EMBEDDING_PROVIDER


DEFAULT_TOP_K = 8


def search_rag_chunks(
    db: Session,
    query_text: str,
    candidate_mouse_ids: list[str],
    top_k: int = DEFAULT_TOP_K,
) -> list[RagChunk]:
    if not candidate_mouse_ids:
        return []

    query_embedding = OllamaEmbeddingClient().embed_texts([query_text])[0]

    query = (
        select(RagChunk)
        .where(RagChunk.mouse_id.in_(candidate_mouse_ids))
        .where(RagChunk.embedding_provider == EMBEDDING_PROVIDER)
        .where(RagChunk.embedding_model == settings.ollama_embedding_model)
        .order_by(RagChunk.embedding.cosine_distance(query_embedding))
        .limit(top_k)
    )

    return list(db.scalars(query))
