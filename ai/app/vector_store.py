from qdrant_client import QdrantClient
from qdrant_client.models import Distance, VectorParams


QDRANT_URL = "http://localhost:6333"
COLLECTION_NAME = "clauseguard_policies"


client = QdrantClient(url=QDRANT_URL)


def create_collection():
    """Create the ClauseGuard policy vector collection."""

    if not client.collection_exists(COLLECTION_NAME):
        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE,
            ),
        )
        print(f"Collection '{COLLECTION_NAME}' created.")
    else:
        print(f"Collection '{COLLECTION_NAME}' already exists.")

from qdrant_client.models import PointStruct


def add_chunks(chunks: list[str], embeddings: list[list[float]], source: str):
    """Store policy chunks and their embeddings in Qdrant."""

    points = []

    for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        points.append(
            PointStruct(
                id=i,
                vector=embedding,
                payload={
                    "text": chunk,
                    "source": source,
                    "document_type": "policy",
                },
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    print(f"Stored {len(points)} chunks in Qdrant.")