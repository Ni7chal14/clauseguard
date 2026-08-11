from datetime import date
from app.rules import evaluate_leave_policy


test_cases = [
    # 3 days + sufficient notice → APPROVED
    (3, date(2026, 8, 13), date(2026, 8, 18)),

    # 5 days + sufficient notice → NEEDS_REVIEW
    (5, date(2026, 8, 13), date(2026, 8, 18)),

    # 3 days + insufficient notice → NEEDS_REVIEW
    (3, date(2026, 8, 14), date(2026, 8, 18)),

    # 5 days + insufficient notice → NEEDS_REVIEW
    (5, date(2026, 8, 14), date(2026, 8, 18)),

    # Missing submission date → NEEDS_REVIEW
    (3, None, date(2026, 8, 18)),   
]


for leave_days, submission_date, leave_start_date in test_cases:
    result = evaluate_leave_policy(
        leave_days,
        submission_date,
        leave_start_date,
    )

    print("\n----------------------------")
    print(f"Leave days: {leave_days}")
    print(f"Submission: {submission_date}")
    print(f"Leave start: {leave_start_date}")
    print(f"Status: {result['status']}")
    print(f"Severity: {result['severity']}")

    print("Reasons:")
    for reason in result["reasons"]:
        print(f"- {reason}")

    print(f"Action: {result['recommended_action']}")