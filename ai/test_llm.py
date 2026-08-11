from app.llm import create_llm


llm = create_llm()

response = llm.invoke(
    "Say 'ClauseGuard LLM connection successful' and nothing else."
)

print(response.content)