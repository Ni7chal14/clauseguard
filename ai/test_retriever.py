from app.retriever import retrieve_chunks


query = "How many days of annual leave are employees entitled to?"

results = retrieve_chunks(query)

print(f"Retrieved {len(results)} chunks.\n")

for i, result in enumerate(results, start=1):
    print(f"--- Result {i} ---")
    print(f"Score: {result['score']}")
    print(f"Source: {result['source']}")
    print(f"Text:\n{result['text']}\n")