from app.rag import answer_question


question = "Can unused annual leave be carried over to the next year?"

result = answer_question(question)

print("\n--- ANSWER ---")
print(result["answer"])

print("\n--- SOURCES ---")
for source in result["sources"]:
    print(f"Source: {source['source']}")
    print(f"Similarity score: {source['score']}")