from app.vector_store import client, COLLECTION_NAME


result = client.scroll(
    collection_name=COLLECTION_NAME,
    limit=5,
    with_payload=True,
    with_vectors=False,
)

points = result[0]

print(f"Points found: {len(points)}")

for point in points:
    print("\n----------------------------")
    print(f"ID: {point.id}")
    print(f"Payload: {point.payload}")