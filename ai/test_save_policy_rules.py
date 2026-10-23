from app.db import get_db_connection
from app.loaders import load_document
from app.policy_extractor import extract_policy_rules
from app.policy_repository import save_policy_rules


POLICY_ID = 3

POLICY_FILE = "test_data/text_policy.txt"


policy_text = load_document(POLICY_FILE)

policy_rule_set = extract_policy_rules(
    policy_text,
    policy_name="Employee Leave Policy",
    policy_version="1.0",
)

print(f"Policy: {policy_rule_set.policy_name}")
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


# Verify what is actually stored
conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                id,
                rule_type,
                condition,
                value,
                unit,
                action,
                metadata
            FROM public.policy_rules
            WHERE policy_id = %s
            ORDER BY id;
            """,
            (POLICY_ID,),
        )

        rows = cursor.fetchall()

        print()
        print("RULES STORED IN DATABASE:")

        for row in rows:
            print(row)

finally:
    conn.close()