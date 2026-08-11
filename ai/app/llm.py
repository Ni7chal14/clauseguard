from langchain_ollama import ChatOllama


MODEL_NAME = "llama3.2:3b"


def create_llm() -> ChatOllama:
    """Create the local ClauseGuard LLM."""

    return ChatOllama(
        model=MODEL_NAME,
        temperature=0,
    )