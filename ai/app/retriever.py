from .embeddings import embed_text
from .vector_store import client, COLLECTION_NAME


SIMILARITY_THRESHOLD = 0.40
RELATIVE_SCORE_THRESHOLD = 0.75


def retrieve_chunks(
    query: str,
    policy_ids: list[int],
    limit: int = 5,
) -> list[dict]:
    """
    Retrieve relevant chunks belonging to the provided active policies.
    """

    query_vector = embed_text(query)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        query_filter={
            "must": [
                {
                    "key": "policy_id",
                    "match": {
                        "any": policy_ids,
                    },
                }
            ]
        },
        limit=limit,
        with_payload=True,
    ).points

    print("\n--- RAG RETRIEVAL DEBUG ---")
    print("Query:", query)

    # No results at all.
    if not results:
        print("No results found.")
        print("--- END DEBUG ---\n")
        return []

    # Show retrieved results.
    for result in results:
        print(
            f"Score: {result.score:.3f} | "
            f"Source: {result.payload.get('source')} | "
            f"Policy ID: {result.payload.get('policy_id')}"
        )

    # If even the best match is too weak,
    # treat the question as unsupported.
    best_score = results[0].score

    if best_score < SIMILARITY_THRESHOLD:
        print(
            f"Best score {best_score:.3f} is below "
            f"threshold {SIMILARITY_THRESHOLD}."
        )
        print("--- END DEBUG ---\n")
        return []

    chunks = []

    best_score = results[0].score

    for rank, result in enumerate(results, start=1):
        if result.score < SIMILARITY_THRESHOLD:
            continue

        if result.score < best_score * RELATIVE_SCORE_THRESHOLD:
            continue

        chunks.append(
            {
                "text": result.payload.get("text", ""),
                "source": result.payload.get("source", ""),
                "score": result.score,
                "policy_id": result.payload.get("policy_id"),
                "rank": rank,
            }
        )

    print("--- END DEBUG ---\n")

    return chunks