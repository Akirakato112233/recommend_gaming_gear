from pydantic import BaseModel, ConfigDict


class MousePriceRef(BaseModel):
    store: str
    url: str
    checked_at: str


class MouseCatalogResponse(BaseModel):
    id: str
    name_mouse: str
    price_thb: int | None
    web_price_ref: MousePriceRef | None
    grip: list[str]

    model_config = ConfigDict(from_attributes=True)
