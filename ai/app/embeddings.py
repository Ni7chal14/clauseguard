
from functools import lru_cache

from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """Load the embedding model only when first needed."""
    return SentenceTransformer(MODEL_NAME)


def embed_text(text: str) -> list[float]:
    """Convert text into a numerical embedding vector."""
    return get_embedding_model().encode(text).tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Convert multiple texts into numerical embedding vectors."""
    return get_embedding_model().encode(texts).tolist()
