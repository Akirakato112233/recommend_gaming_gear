from sqlalchemy import select
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Session
from sqlalchemy.sql import cast

from app.models.mouse import MouseCatalog

PRICE_TOLERANCE_THB = 500


def filter_mice(
    db: Session,
    grip_style: str | None = None,
    min_price_thb: int | None = None,
    max_price_thb: int | None = None,
) -> list[MouseCatalog]:
    query = select(MouseCatalog)

    if grip_style is not None:
        normalized_grip = grip_style.strip().lower()
        query = query.where(cast(MouseCatalog.grip, JSONB).contains([normalized_grip]))

    if min_price_thb is not None or max_price_thb is not None:
        query = query.where(MouseCatalog.price_thb.is_not(None))

    if min_price_thb is not None:
        min_price = max(0, min_price_thb - PRICE_TOLERANCE_THB)
        query = query.where(MouseCatalog.price_thb >= min_price)

    if max_price_thb is not None:
        max_price = max_price_thb + PRICE_TOLERANCE_THB
        query = query.where(MouseCatalog.price_thb <= max_price)

    return list(db.scalars(query.order_by(MouseCatalog.name_mouse)))
