from app.embeddings import embed_text
from app.vector_store import client, COLLECTION_NAME


SIMILARITY_THRESHOLD = 0.60


def retrieve_chunks(
    query: str,
    limit: int = 3,
) -> list[dict]:
    """Retrieve sufficiently relevant policy chunks."""

    query_vector = embed_text(query)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=limit,
        with_payload=True,
    ).points

    chunks = []

    for result in results:
        if result.score < SIMILARITY_THRESHOLD:
            continue

        chunks.append(
            {
                "text": result.payload.get("text", ""),
                "source": result.payload.get("source", ""),
                "score": result.score,
            }
        )

    return chunks