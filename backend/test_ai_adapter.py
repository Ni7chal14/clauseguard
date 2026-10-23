from app.services.policy_service import get_active_policy_rules
from app.services.ai_adapter import convert_rules_to_policy_rules


policy = get_active_policy_rules(1)

policy_rules = convert_rules_to_policy_rules(
    policy["rules"]
)

print("==============================")
print("AI ADAPTER TEST")
print("==============================")

print(
    f"Policy: {policy['policy']['name']} "
    f"v{policy['policy']['version']}"
)

print(f"Rules converted: {len(policy_rules)}")

for rule in policy_rules:
    print(
        f"- {rule.rule_type}: "
        f"value={rule.value}, "
        f"unit={rule.unit}, "
        f"action={rule.action}"
    )