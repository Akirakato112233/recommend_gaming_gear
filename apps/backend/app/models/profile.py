from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.database import Base
from app.models.session import new_uuid, utc_now


class MouseFitProfile(Base):
    __tablename__ = "mouse_fit_profiles"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=new_uuid)
    session_id: Mapped[str] = mapped_column(ForeignKey("user_sessions.id"), index=True)
    game: Mapped[str] = mapped_column(String(32), index=True)
    dpi: Mapped[float] = mapped_column(Float)
    grip_style: Mapped[str] = mapped_column(String(32), index=True)
    hand_length_mm: Mapped[float] = mapped_column(Float)
    hand_width_mm: Mapped[float] = mapped_column(Float)
    current_mouse_name: Mapped[str] = mapped_column(String(120))
    liked_features: Mapped[list[str]] = mapped_column(JSON, default=list)
    disliked_features: Mapped[list[str]] = mapped_column(JSON, default=list)
    preference: Mapped[dict] = mapped_column(JSON, default=dict)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)

    session = relationship("UserSession", back_populates="profiles")
    diagnostic_results = relationship(
        "DiagnosticResult",
        back_populates="profile",
        cascade="all, delete-orphan",
    )
