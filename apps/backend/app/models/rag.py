from datetime import datetime

from pgvector.sqlalchemy import Vector
from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.core.config import settings
from app.db.database import Base
from app.models.common import new_uuid, utc_now


class RagChunk(Base):
    __tablename__ = "rag_chunks"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    mouse_id: Mapped[str] = mapped_column(String(120), index=True)
    mouse_name: Mapped[str] = mapped_column(String(160), index=True)
    topic: Mapped[str] = mapped_column(String(120), index=True)
    content: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float]] = mapped_column(Vector(settings.embedding_dimension))
    embedding_provider: Mapped[str] = mapped_column(String(40), default="ollama")
    embedding_model: Mapped[str] = mapped_column(
        String(80),
        default=settings.ollama_embedding_model,
    )
    embedding_dimension: Mapped[int] = mapped_column(
        Integer,
        default=settings.embedding_dimension,
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
