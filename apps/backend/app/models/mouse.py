from datetime import datetime

from sqlalchemy import DateTime, Integer, JSON, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.database import Base
from app.models.session import utc_now


class MouseCatalog(Base):
    __tablename__ = "mouse_catalog"

    id: Mapped[str] = mapped_column(String(120), primary_key=True)
    name_mouse: Mapped[str] = mapped_column(String(160), index=True)
    price_thb: Mapped[int | None] = mapped_column(Integer, nullable=True)
    web_price_ref: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    grip: Mapped[list[str]] = mapped_column(JSON, default=list)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=utc_now,
        onupdate=utc_now,
    )
