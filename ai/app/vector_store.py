from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)


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


def delete_policy_chunks(policy_id: int):
    """Remove all existing Qdrant chunks belonging to a policy."""

    if not client.collection_exists(COLLECTION_NAME):
        return

    client.delete(
        collection_name=COLLECTION_NAME,
        points_selector=Filter(
            must=[
                FieldCondition(
                    key="policy_id",
                    match=MatchValue(value=policy_id),
                )
            ]
        ),
    )

    print(f"Removed existing chunks for policy {policy_id}.")


def add_chunks(
    chunks: list[str],
    embeddings: list[list[float]],
    source: str,
    policy_id: int,
):
    """
    Store policy chunks and their embeddings in Qdrant.

    Existing chunks for the same policy are removed first
    so that re-indexing never leaves stale chunks behind.
    """

    # Remove any previous indexing for this policy.
    delete_policy_chunks(policy_id)

    points = []

    for i, (chunk, embedding) in enumerate(
        zip(chunks, embeddings)
    ):
        points.append(
            PointStruct(
                id=(policy_id * 1000000) + i,
                vector=embedding,
                payload={
                    "text": chunk,
                    "source": source,
                    "document_type": "policy",
                    "policy_id": policy_id,
                },
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    print(
        f"Stored {len(points)} chunks for policy "
        f"{policy_id} in Qdrant."
    )