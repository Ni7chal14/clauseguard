from datetime import date

from app.policy_repository import get_policy_rules
from app.rules import evaluate_leave_policy


POLICY_ID = 4

policy_rules = get_policy_rules(POLICY_ID)


result = evaluate_leave_policy(
    leave_days=2,
    leave_type="EMERGENCY LEAVE",
    submission_date=date(2026, 8, 17),
    leave_start_date=date(2026, 8, 18),
    policy_rules=policy_rules,
)


print("==============================")
print("EMERGENCY LEAVE TEST")
print("==============================")
print(f"Status: {result['status']}")
print(f"Severity: {result['severity']}")

print("\nReasons:")
for reason in result["reasons"]:
    print(f"- {reason}")

print(f"\nAction: {result['recommended_action']}")