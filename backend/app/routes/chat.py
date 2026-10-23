from fastapi import APIRouter
from pydantic import BaseModel

from ai.app.rag import answer_question


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"],
)


class ChatRequest(BaseModel):
    message: str


@router.post("")
def chat(request: ChatRequest):
    result = answer_question(request.message)

    citation = ""
    if result.get("sources"):
        source = result["sources"][0]

        policy_name = source.get("policy_name", "Unknown Policy")
        policy_version = source.get("policy_version", "Unknown")

        citation = f"{policy_name} — v{policy_version}"

    return {
        "text": result["answer"],
        "citation": citation,
        "sources": result["sources"],
        "evidence": result.get("evidence", []),
    }