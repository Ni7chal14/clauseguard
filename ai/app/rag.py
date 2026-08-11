from app.retriever import retrieve_chunks
from app.llm import create_llm


llm = create_llm()


def answer_question(question: str) -> dict:
    """Answer a policy question using retrieved policy context."""

    results = retrieve_chunks(question)

    if not results:
        return {
            "answer": "I could not find relevant information in the available policies.",
            "sources": [],
        }

    context = "\n\n".join(
        f"Source: {result['source']}\n{result['text']}"
        for result in results
    )

    prompt = f"""
You are ClauseGuard, an AI assistant for company policy questions.

Answer the user's question using ONLY the policy information provided below.

Rules:
- Do not use outside knowledge.
- Do not invent or assume policy rules.
- If the policy does not contain enough information, say so clearly.
- Give a concise, professional answer.
- Mention the relevant policy source.

POLICY CONTEXT:
{context}

USER QUESTION:
{question}

ANSWER:
"""

    response = llm.invoke(prompt)

    sources = [
        {
            "source": result["source"],
            "score": result["score"],
        }
        for result in results
    ]

    return {
        "answer": response.content,
        "sources": sources,
    }