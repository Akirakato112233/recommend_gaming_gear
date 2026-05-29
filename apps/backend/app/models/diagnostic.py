from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.session import new_uuid, utc_now


class DiagnosticResult(Base):
    __tablename__ = "diagnostic_results"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    profile_id: Mapped[str] = mapped_column(ForeignKey("mouse_fit_profiles.id"), index=True)
    test_version: Mapped[str] = mapped_column(String(32))
    raw_metrics: Mapped[dict] = mapped_column(JSON, default=dict)
    trait_labels: Mapped[dict] = mapped_column(JSON, default=dict)
    confidence_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    summary: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    profile = relationship("MouseFitProfile", back_populates="diagnostic_results")
