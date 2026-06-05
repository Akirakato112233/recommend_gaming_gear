import httpx

from app.core.config import settings


class OllamaEmbeddingClient:
    def __init__(
        self,
        base_url: str = settings.ollama_base_url,
        model: str = settings.ollama_embedding_model,
    ) -> None:
        self.base_url = base_url.rstrip("/")
        self.model = model

    def embed_texts(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []

        response = httpx.post(
            f"{self.base_url}/api/embed",
            json={"model": self.model, "input": texts},
            timeout=120,
        )
        response.raise_for_status()

        embeddings = response.json()["embeddings"]
        return [list(embedding) for embedding in embeddings]
