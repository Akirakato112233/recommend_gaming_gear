from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, model_validator


class Game(StrEnum):
    CS2 = "cs2"
    VALORANT = "valorant"
    PUBG = "pubg"
    OW2 = "ow2"
    APEX = "apex"


class GripStyle(StrEnum):
    PALM = "palm"
    CLAW = "claw"
    FINGERTIP = "fingertip"
    HYBRID = "hybrid"


class MouseShapePreference(StrEnum):
    SYMMETRIC = "symmetric"
    ERGONOMIC = "ergonomic"
    UNKNOWN = "unknown"


class ConnectivityPreference(StrEnum):
    WIRELESS_ONLY = "wireless_only"
    ANY = "any"


class CurrentMouseFeedback(BaseModel):
    mouse_name: str = Field(min_length=1, max_length=120)
    likes: list[str] = Field(default_factory=list)
    dislikes: list[str] = Field(default_factory=list)


class UserPreference(BaseModel):
    preferred_shape: MouseShapePreference = MouseShapePreference.UNKNOWN
    connectivity: ConnectivityPreference = ConnectivityPreference.ANY
    budget_min_thb: int | None = Field(default=None, ge=0)
    budget_max_thb: int | None = Field(default=None, ge=0)
    thailand_only: bool = True

    @model_validator(mode="after")
    def validate_budget_range(self) -> "UserPreference":
        if (
            self.budget_min_thb is not None
            and self.budget_max_thb is not None
            and self.budget_min_thb > self.budget_max_thb
        ):
            raise ValueError("budget_min_thb must be less than or equal to budget_max_thb")

        return self


class UserProfileCreate(BaseModel):
    game: Game
    dpi: float = Field(gt=0)
    sensitivity: float = Field(gt=0)
    grip_style: GripStyle
    hand_length_mm: float = Field(gt=0)
    hand_width_mm: float = Field(gt=0)
    current_mouse: CurrentMouseFeedback
    preference: UserPreference = Field(default_factory=UserPreference)


class UserProfileResponse(UserProfileCreate):
    id: str
    session_id: str

    model_config = ConfigDict(from_attributes=True)
