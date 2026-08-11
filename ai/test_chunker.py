from app.loaders import load_document
from app.chunker import chunk_text


file_path = "test_data/text_policy.txt"

text = load_document(file_path)

chunks = chunk_text(text)

print(f"Total chunks: {len(chunks)}")

for i, chunk in enumerate(chunks, start=1):
    print(f"\n--- Chunk {i} ---")
    print(chunk)