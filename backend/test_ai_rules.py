import sys
from pathlib import Path
from datetime import date


# Add the ClauseGuard project root to Python's import path.
PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from app.services.policy_service import get_active_policy_rules
from app.services.ai_adapter import convert_rules_to_policy_rules

from ai.app.rules import evaluate_leave_policy


# ---------------------------------------------------------
# 1. Load active policy from PostgreSQL
# ---------------------------------------------------------

policy = get_active_policy_rules(1)

# ---------------------------------------------------------
# 2. Convert database rules into AI PolicyRule objects
# ---------------------------------------------------------

policy_rules = convert_rules_to_policy_rules(
    policy["rules"]
)

# ---------------------------------------------------------
# 3. Evaluate leave request
# ---------------------------------------------------------

result = evaluate_leave_policy(
    leave_type="ANNUAL LEAVE",
    leave_days=4,
    submission_date=date(2026, 8, 13),
    leave_start_date=date(2026, 8, 18),
    policy_rules=policy_rules,
)

# ---------------------------------------------------------
# 4. Print result
# ---------------------------------------------------------

print("==============================")
print("FASTAPI → AI RULE ENGINE TEST")
print("==============================")

print(
    f"Policy: {policy['policy']['name']} "
    f"v{policy['policy']['version']}"
)

print("\nLeave request:")
print("Leave days: 4")
print("Submission date: 2026-08-13")
print("Leave start: 2026-08-18")

print("\nRESULT:")
print(f"Status: {result['status']}")
print(f"Severity: {result['severity']}")

print("\nReasons:")

for reason in result["reasons"]:
    print(f"- {reason}")

print(f"\nAction: {result['recommended_action']}")