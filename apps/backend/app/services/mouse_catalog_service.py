from collections.abc import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.data import MOUSE_SEED
from app.data.mouse_seed import MouseSeedItem
from app.models.mouse import MouseCatalog


def seed_mouse_catalog(
    db: Session,
    seed_items: Sequence[MouseSeedItem] = MOUSE_SEED,
) -> int:
    for seed_item in seed_items:
        mouse = db.get(MouseCatalog, seed_item["id"])
        if mouse is None:
            db.add(_create_mouse_catalog(seed_item))
            continue

        _update_mouse_catalog(mouse, seed_item)

    db.commit()
    return len(seed_items)


def list_mouse_catalog(db: Session) -> list[MouseCatalog]:
    return list(db.scalars(select(MouseCatalog).order_by(MouseCatalog.name_mouse)))


def _create_mouse_catalog(seed_item: MouseSeedItem) -> MouseCatalog:
    return MouseCatalog(
        id=seed_item["id"],
        name_mouse=seed_item["name_mouse"],
        price_thb=seed_item["price_thb"],
        web_price_ref=seed_item["web_price_ref"],
        grip=seed_item["grip"],
    )


def _update_mouse_catalog(mouse: MouseCatalog, seed_item: MouseSeedItem) -> None:
    mouse.name_mouse = seed_item["name_mouse"]
    mouse.price_thb = seed_item["price_thb"]
    mouse.web_price_ref = seed_item["web_price_ref"]
    mouse.grip = seed_item["grip"]
