import json
from pathlib import Path
from typing import NotRequired, TypedDict, cast


class MousePriceRef(TypedDict):
    store: str
    url: str
    checked_at: str


class MouseSeedItem(TypedDict):
    id: str
    name_mouse: str
    price_thb: int | None
    web_price_ref: NotRequired[MousePriceRef | None]
    grip: list[str]


DATA_DIR = Path(__file__).resolve().parent
PRICED_SEED_PATH = DATA_DIR / "mouse_seed_priced.json"
MISSING_PRICE_SEED_PATH = DATA_DIR / "mouse_seed_missing_price.json"


def load_mouse_seed() -> list[MouseSeedItem]:
    return _load_json_seed(PRICED_SEED_PATH) + _load_json_seed(MISSING_PRICE_SEED_PATH)


def _load_json_seed(path: Path) -> list[MouseSeedItem]:
    with path.open(encoding="utf-8") as seed_file:
        return cast(list[MouseSeedItem], json.load(seed_file))


MOUSE_SEED: list[MouseSeedItem] = load_mouse_seed()
