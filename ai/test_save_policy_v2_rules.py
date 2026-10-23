from app.loaders import load_document
from app.policy_extractor import extract_policy_rules
from app.policy_repository import save_policy_rules


POLICY_ID = 4
POLICY_FILE = "test_data/text_policy_v2.txt"


policy_text = load_document(POLICY_FILE)

policy_rule_set = extract_policy_rules(
    policy_text,
    policy_name="Employee Leave Policy",
    policy_version="2.0",
)

print(f"Policy: {policy_rule_set.policy_name}")
print(f"Version: {policy_rule_set.policy_version}")
print(f"Rules extracted: {len(policy_rule_set.rules)}")

for rule in policy_rule_set.rules:
    print(
        f"- {rule.rule_type}: "
        f"value={rule.value}, "
        f"unit={rule.unit}, "
        f"action={rule.action}"
    )


inserted = save_policy_rules(
    policy_id=POLICY_ID,
    policy_rule_set=policy_rule_set,
)

print()
print(f"Rules inserted into PostgreSQL: {inserted}")