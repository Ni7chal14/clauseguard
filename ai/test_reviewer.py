from app.reviewer import review_document


document = """
Employee: Rahul Sharma

Leave Request:
I would like to take 5 consecutive days of annual leave
from August 18, 2026 to August 22, 2026.

Request submitted on August 14, 2026.
"""

result = review_document(document)

print("\n--- REVIEW RESULT ---")
print("Status:", result["status"])
print("Explanation:", result["explanation"])
print("Severity:", result["severity"])
print("Recommended action:", result["recommended_action"])

print("\n--- SOURCES ---")
for source in result["sources"]:
    print(f"Source: {source['source']}")
    print(f"Similarity score: {source['score']}")