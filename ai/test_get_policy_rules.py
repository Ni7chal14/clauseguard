from app.policy_repository import get_policy_rules


POLICY_ID = 3

rules = get_policy_rules(POLICY_ID)

print(f"Rules found: {len(rules)}")

for rule in rules:
    print("\n----------------------------")
    print(f"ID: {rule['id']}")
    print(f"Rule type: {rule['rule_type']}")
    print(f"Condition: {rule['condition']}")
    print(f"Value: {rule['value']}")
    print(f"Unit: {rule['unit']}")
    print(f"Action: {rule['action']}")
    print(f"Metadata: {rule['metadata']}")