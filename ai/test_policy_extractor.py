from pathlib import Path

from app.policy_extractor import extract_policy_rules


policy_path = Path("test_data/text_policy.txt")

policy_text = policy_path.read_text(encoding="utf-8")

policy = extract_policy_rules(
    policy_text,
    policy_name="Employee Leave Policy",
    policy_version="1.0",
)

print(f"Policy: {policy.policy_name}")
print(f"Version: {policy.policy_version}")
print(f"Rules found: {len(policy.rules)}")

for rule in policy.rules:
    print("\n----------------------------")
    print(f"Rule type: {rule.rule_type}")
    print(f"Condition: {rule.condition}")
    print(f"Value: {rule.value}")
    print(f"Unit: {rule.unit}")
    print(f"Action: {rule.action}")
    print(f"Metadata: {rule.metadata}")