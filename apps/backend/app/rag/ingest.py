from collections.abc import Iterable
from pathlib import Path
from typing import TypeVar

from sqlalchemy import delete

from app.core.config import settings
from app.db.database import SessionLocal, create_vector_extension, engine
from app.models.rag import RagChunk
from app.rag.chunker import build_research_chunks
from app.rag.embed import OllamaEmbeddingClient


DEFAULT_RESEARCH_PATH = Path("app/data/research.md")
DEFAULT_BATCH_SIZE = 16
EMBEDDING_PROVIDER = "ollama"
T = TypeVar("T")


def batched(items: list[T], batch_size: int) -> Iterable[list[T]]:
    for start in range(0, len(items), batch_size):
        yield items[start : start + batch_size]


def ingest_research_chunks(
    research_path: Path = DEFAULT_RESEARCH_PATH,
    batch_size: int = DEFAULT_BATCH_SIZE,
) -> int:
    create_vector_extension()
    RagChunk.__table__.create(bind=engine, checkfirst=True)

    chunks = build_research_chunks(str(research_path))
    embedding_client = OllamaEmbeddingClient()

    db = SessionLocal()
    try:
        db.execute(
            delete(RagChunk).where(
                RagChunk.embedding_provider == EMBEDDING_PROVIDER,
                RagChunk.embedding_model == settings.ollama_embedding_model,
            )
        )

        for chunk_batch in batched(chunks, batch_size):
            embeddings = embedding_client.embed_texts(
                [chunk["content"] for chunk in chunk_batch]
            )

            for chunk, embedding in zip(chunk_batch, embeddings, strict=True):
                if len(embedding) != settings.embedding_dimension:
                    raise ValueError(
                        "Embedding dimension mismatch: "
                        f"expected {settings.embedding_dimension}, got {len(embedding)}"
                    )

                db.add(
                    RagChunk(
                        mouse_id=chunk["mouse_id"],
                        mouse_name=chunk["mouse_name"],
                        topic=chunk["topic"],
                        content=chunk["content"],
                        embedding=embedding,
                        embedding_provider=EMBEDDING_PROVIDER,
                        embedding_model=settings.ollama_embedding_model,
                        embedding_dimension=settings.embedding_dimension,
                    )
                )

        db.commit()
        return len(chunks)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    ingested_count = ingest_research_chunks()
    print(f"Ingested {ingested_count} RAG chunks")
