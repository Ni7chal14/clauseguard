from app.extractors import extract_dates


test_documents = [
    """
    Leave Request:
    I would like to take leave from August 18, 2026 to August 20, 2026.
    Request submitted on August 14, 2026.
    """,

    """
    Leave Request:
    Starting August 24, 2026.
    Submission date: August 20, 2026.
    """,

    """
    I would like to take 3 days of leave.
    """
]


for document in test_documents:
    dates = extract_dates(document)

    print("\n--- DOCUMENT ---")
    print(document.strip())

    print("\nExtracted dates:")
    print("Submission date:", dates["submission_date"])
    print("Leave start date:", dates["leave_start_date"])