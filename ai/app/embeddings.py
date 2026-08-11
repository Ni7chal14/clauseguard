from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

_embedding_model = SentenceTransformer(MODEL_NAME)


def embed_text(text: str) -> list[float]:
    """Convert text into a numerical embedding vector."""
    return _embedding_model.encode(text).tolist()


def embed_texts(texts: list[str]) -> list[list[float]]:
    """Convert multiple texts into numerical embedding vectors."""
    return _embedding_model.encode(texts).tolist()