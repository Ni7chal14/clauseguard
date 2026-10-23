from app.loaders import load_document
from app.chunker import chunk_text
from app.embeddings import embed_texts
from app.vector_store import create_collection, add_chunks


POLICY_ID = 4
FILE_PATH = "test_data/text_policy_v2.txt"


# 1. Load document
text = load_document(FILE_PATH)

# 2. Split into chunks
chunks = chunk_text(text)

# 3. Create embeddings
embeddings = embed_texts(chunks)

# 4. Make sure Qdrant collection exists
create_collection()

# 5. Store chunks + embeddings + policy ID
add_chunks(
    chunks=chunks,
    embeddings=embeddings,
    source="text_policy_v2.txt",
    policy_id=POLICY_ID,
)

print("\nV2 policy ingestion completed successfully!")