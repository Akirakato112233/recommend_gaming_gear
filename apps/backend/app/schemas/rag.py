from pydantic import BaseModel, ConfigDict, Field


class RagSearchRequest(BaseModel):
    query_text: str = Field(..., min_length=1)
    candidate_mouse_ids: list[str] = Field(..., min_length=1)
    top_k: int = Field(default=8, ge=1, le=20)


class RagChunkResponse(BaseModel):
    id: str
    mouse_id: str
    mouse_name: str
    topic: str
    content: str

    model_config = ConfigDict(from_attributes=True)
