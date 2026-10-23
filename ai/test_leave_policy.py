from datetime import date
from pathlib import Path

from app.loaders import load_document
from app.policy_extractor import extract_policy_rules
from app.rules import evaluate_leave_policy


# ---------------------------------------------------------
# Load the actual company policy
# ---------------------------------------------------------

policy_path = Path("test_data/text_policy.txt")

policy_text = load_document(str(policy_path))

policy = extract_policy_rules(
    policy_text,
    policy_name="Employee Leave Policy",
    policy_version="1.0",
)

print(f"Policy: {policy.policy_name}")
print(f"Version: {policy.policy_version}")
print(f"Rules loaded: {len(policy.rules)}")


# ---------------------------------------------------------
# Test employee leave requests
# ---------------------------------------------------------

test_cases = [
    # 3 days + sufficient notice → APPROVED
    (
        3,
        date(2026, 8, 13),
        date(2026, 8, 18),
    ),

    # 5 days + sufficient notice → NEEDS_REVIEW
    (
        5,
        date(2026, 8, 13),
        date(2026, 8, 18),
    ),

    # 3 days + insufficient notice → NEEDS_REVIEW
    (
        3,
        date(2026, 8, 14),
        date(2026, 8, 18),
    ),

    # 5 days + insufficient notice → NEEDS_REVIEW
    (
        5,
        date(2026, 8, 14),
        date(2026, 8, 18),
    ),

    # Missing submission date → NEEDS_REVIEW
    (
        3,
        None,
        date(2026, 8, 18),
    ),
]


for leave_days, submission_date, leave_start_date in test_cases:

    result = evaluate_leave_policy(
        leave_days=leave_days,
        submission_date=submission_date,
        leave_start_date=leave_start_date,
        policy_rules=policy.rules,
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