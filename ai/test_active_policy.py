from app.policy_repository import get_active_policy_id


ORGANIZATION_ID = 1

policy_id = get_active_policy_id(ORGANIZATION_ID)

print(f"Organization ID: {ORGANIZATION_ID}")
print(f"Active Policy ID: {policy_id}")