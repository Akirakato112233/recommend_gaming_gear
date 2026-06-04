from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.schemas.mouse import MouseCatalogResponse
from app.services.filter_mouse import filter_mice
from app.services.mouse_catalog_service import list_mouse_catalog


router = APIRouter(prefix="/mice", tags=["mice"])
DbSession = Annotated[Session, Depends(get_db)]


@router.get("/", response_model=list[MouseCatalogResponse])
def read_mice(db: DbSession) -> list[MouseCatalogResponse]:
    return list_mouse_catalog(db)


@router.get("/filter", response_model=list[MouseCatalogResponse])
def filter_mouse_catalog(
    db: DbSession,
    grip_style: str | None = None,
    min_price_thb: int | None = None,
    max_price_thb: int | None = None,
) -> list[MouseCatalogResponse]:
    return filter_mice(
        db,
        grip_style=grip_style,
        min_price_thb=min_price_thb,
        max_price_thb=max_price_thb,
    )
