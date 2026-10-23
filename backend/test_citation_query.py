from ai.app.retriever import retrieve_chunks


query = (
    "ANNUAL LEAVE policy requirements. "
    "Leave duration of 4 days. "
    "Annual leave entitlement. "
    "Manager approval requirements. "
    "Advance notice requirements. "
    "Submission date 2026-08-13. "
    "Leave start date 2026-08-18."
)


chunks = retrieve_chunks(
    query=query,
    policy_id=4,
)


print("==============================")
print("CITATION QUERY TEST")
print("==============================")

print(f"Chunks retrieved: {len(chunks)}")

for chunk in chunks:
    print("\n----------------------------")
    print(f"Score: {chunk['score']}")
    print(f"Source: {chunk['source']}")
    print(f"Policy ID: {chunk['policy_id']}")
    print(f"Text:\n{chunk['text']}")