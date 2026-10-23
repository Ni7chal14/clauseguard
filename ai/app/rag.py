from .retriever import retrieve_chunks
from .llm import create_llm

from backend.app.services.policy_service import (
    get_active_policy_ids,
    get_policy_metadata,
)

llm = create_llm()


def answer_question(
    question: str,
    organization_id: int = 1,
) -> dict:
    """
    Answer a policy question using active policies
    belonging to the organization.
    """

    # Get currently active policy IDs from PostgreSQL.
    active_policy_ids = get_active_policy_ids(
        organization_id
    )

    if not active_policy_ids:
        return {
            "answer": "There are currently no active policies available for this organization.",
            "sources": [],
        }

    print(
        "\nActive policy IDs:",
        active_policy_ids,
    )

    # Search Qdrant only within active policies.
    results = retrieve_chunks(
        query=question,
        policy_ids=active_policy_ids,
    )

    if not results:
        return {
            "answer": "I could not find relevant information in the available policies.",
            "sources": [],
        }

    context_parts = []

    for result in results:
        policy = get_policy_metadata(result["policy_id"])

        policy_name = policy["name"] if policy else "Unknown Policy"
        policy_version = policy["version"] if policy else "Unknown"

        context_parts.append(
            f"Policy: {policy_name}\n"
            f"Version: {policy_version}\n"
            f"Source file: {result['source']}\n"
            f"Evidence: {result['text']}"
        )

    context = "\n\n".join(context_parts)

    prompt = f"""
You are ClauseGuard, an AI assistant for company policy questions.

Answer the user's question using ONLY the policy information provided below.

Rules:
- Do not use outside knowledge.
- Do not invent or assume policy rules.
- If the policy does not contain enough information, say so clearly.
- Give a concise, professional answer.
- Mention the relevant policy name and version.
- After the answer, provide a short "Evidence" section containing the exact policy statement that supports the answer.
- Use only statements present in the provided policy context as evidence.
- Treat the Policy and Version fields provided in the context as authoritative metadata.
- Never infer the policy name or version from the source filename.

POLICY CONTEXT:
{context}

USER QUESTION:
{question}

ANSWER:
"""

    response = llm.invoke(prompt)

    sources = []

    for r in results:
        policy = get_policy_metadata(r["policy_id"])

        sources.append(
            {
                "source": r["source"],
                "score": r["score"],
                "policy_id": r["policy_id"],
                "policy_name": policy["name"] if policy else "Unknown Policy",
                "policy_version": policy["version"] if policy else "Unknown",
                "rank": r.get("rank"),
            }
        )

    return {
        "answer": response.content,
        "sources": sources,
        "evidence": [
            {
                "text": result["text"],
                "policy_name": (
                    get_policy_metadata(result["policy_id"])["name"]
                    if get_policy_metadata(result["policy_id"])
                    else "Unknown Policy"
                ),
                "policy_version": (
                    get_policy_metadata(result["policy_id"])["version"]
                    if get_policy_metadata(result["policy_id"])
                    else "Unknown"
                ),
                "score": result["score"],
            }
            for result in results
        ],
    }