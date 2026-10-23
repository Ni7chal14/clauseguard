from datetime import date

from app.policy_repository import get_policy_rules
from app.rules import evaluate_leave_policy


POLICY_ID = 4

policy_rules = get_policy_rules(POLICY_ID)


test_cases = [
    (10, 4),
    (12, 4),
    (14, 1),
]


for used_days, requested_days in test_cases:

    result = evaluate_leave_policy(
        leave_days=requested_days,
        leave_type="ANNUAL LEAVE",
        submission_date=date(2026, 8, 10),
        leave_start_date=date(2026, 8, 18),
        policy_rules=policy_rules,
        used_annual_leave_days=used_days,
    )

    print("\n==============================")
    print(f"Already used: {used_days} days")
    print(f"Requested: {requested_days} days")
    print(f"Status: {result['status']}")

    for reason in result["reasons"]:
        print(f"- {reason}")