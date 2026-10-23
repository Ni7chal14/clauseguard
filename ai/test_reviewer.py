from pathlib import Path

from app.loaders import load_document
from app.reviewer import review_document


submission_path = Path("test_data/test_leave_request.txt")

document_text = load_document(str(submission_path))

result = review_document(
    document_text,
    organization_id=1,
)

print("\n==============================")
print("CLAUSEGUARD REVIEW RESULT")
print("==============================")

print(f"Status: {result['status']}")
print(f"Severity: {result['severity']}")
print(f"Explanation: {result['explanation']}")
print(f"Recommended Action: {result['recommended_action']}")

print("\nSources:")

for source in result["sources"]:
    print(
        f"- {source['source']} "
        f"(score: {source['score']})"
    )