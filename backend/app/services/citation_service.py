from ai.app.retriever import retrieve_chunks


def get_policy_citations(
    document_text: str,
    policy_id: int,
) -> list[dict]:
    """
    Retrieve policy chunks relevant to the submitted request
    and convert them into citation records.
    """

    chunks = retrieve_chunks(
        query=document_text,
        policy_ids=[policy_id],
    )

    citations = []

    for chunk in chunks:
        citations.append(
            {
                "section": chunk.get("source") or None,
                "citation_text": chunk.get("text", ""),
            }
        )

    return citations