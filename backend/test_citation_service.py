from backend.app.services.citation_service import get_policy_citations

citations = get_policy_citations(
    document_text=(
        "Annual leave request for 4 days. "
        "Submission date: 2026-08-13. "
        "Leave start date: 2026-08-18."
    ),
    policy_id=4,
)


print("==============================")
print("CITATION SERVICE TEST")
print("==============================")

print(f"Citations retrieved: {len(citations)}")

for citation in citations:
    print("\n----------------------------")
    print(f"Section: {citation['section']}")
    print(f"Text: {citation['citation_text']}")