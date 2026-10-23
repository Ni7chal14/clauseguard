from app.retriever import retrieve_chunks


POLICY_ID = 4

query = (
    "What are the rules for annual leave, "
    "leave duration, advance notice, and emergency leave?"
)

chunks = retrieve_chunks(
    query=query,
    policy_id=POLICY_ID,
)

print(f"Chunks retrieved: {len(chunks)}")

for chunk in chunks:
    print("\n----------------------------")
    print(f"Source: {chunk['source']}")
    print(f"Policy ID: {chunk['policy_id']}")
    print(f"Score: {chunk['score']}")
    print(f"Text:\n{chunk['text']}")