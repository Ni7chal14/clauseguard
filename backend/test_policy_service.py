from app.services.policy_service import get_active_policy_rules


result = get_active_policy_rules(1)


print("==============================")
print("ACTIVE POLICY")
print("==============================")

print(f"Policy ID: {result['policy']['id']}")
print(f"Name: {result['policy']['name']}")
print(f"Version: {result['policy']['version']}")

print("\nRULES:")

for rule in result["rules"]:
    print(
        f"- {rule['rule_type']}: "
        f"value={rule['value']}, "
        f"unit={rule['unit']}, "
        f"action={rule['action']}"
    )