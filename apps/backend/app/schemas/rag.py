from pydantic import BaseModel, ConfigDict


class RagChunkResponse(BaseModel):
    id: str
    mouse_id: str
    mouse_name: str
    topic: str
    content: str

    model_config = ConfigDict(from_attributes=True)
