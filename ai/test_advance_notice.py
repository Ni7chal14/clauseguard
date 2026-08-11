from datetime import date
from app.rules import evaluate_advance_notice


test_cases = [
    # 2 working days in advance
    (date(2026, 8, 13), date(2026, 8, 18)),

    # Only 1 working day in advance
    (date(2026, 8, 14), date(2026, 8, 18)),

    # Same-day request
    (date(2026, 8, 18), date(2026, 8, 18)),
]


for submission_date, leave_start_date in test_cases:
    result = evaluate_advance_notice(
        submission_date,
        leave_start_date,
    )

    print(f"\nSubmission date: {submission_date}")
    print(f"Leave start date: {leave_start_date}")
    print(f"Compliant: {result['compliant']}")
    print(f"Reason: {result['reason']}")