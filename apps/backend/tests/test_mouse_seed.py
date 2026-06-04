import json
from pathlib import Path

from app.data import MOUSE_SEED


ALLOWED_GRIPS = {"palm", "claw", "fingertip"}
REQUIRED_KEYS = {"id", "name_mouse", "price_thb", "web_price_ref", "grip"}
DATA_DIR = Path(__file__).resolve().parents[1] / "app" / "data"


def test_mouse_seed_ids_are_unique() -> None:
    ids = [mouse["id"] for mouse in MOUSE_SEED]

    assert len(ids) == len(set(ids))


def test_mouse_seed_has_required_fields() -> None:
    for mouse in MOUSE_SEED:
        assert REQUIRED_KEYS.issubset(mouse.keys())
        assert mouse["id"]
        assert mouse["name_mouse"]
        assert mouse["grip"]


def test_mouse_seed_price_references_match_price_status() -> None:
    for mouse in MOUSE_SEED:
        price = mouse["price_thb"]
        price_ref = mouse["web_price_ref"]

        assert price is None or isinstance(price, int)

        if price is None:
            assert price_ref is None
        else:
            assert price > 0

        if price_ref is not None:
            assert price_ref["store"]
            assert price_ref["url"].startswith("https://")
            assert price_ref["checked_at"] == "2026-06-04"


def test_mouse_seed_grips_use_supported_labels() -> None:
    for mouse in MOUSE_SEED:
        assert set(mouse["grip"]).issubset(ALLOWED_GRIPS)


def test_mouse_seed_loads_from_merged_json_files() -> None:
    priced_seed = json.loads((DATA_DIR / "mouse_seed_priced.json").read_text())
    missing_price_seed = json.loads((DATA_DIR / "mouse_seed_missing_price.json").read_text())
    merged_json_seed = priced_seed + missing_price_seed

    assert merged_json_seed == MOUSE_SEED
