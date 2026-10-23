from app.policy_repository import (
    activate_policy,
    get_active_policy_id,
)


ORGANIZATION_ID = 1
POLICY_ID = 3


activate_policy(
    organization_id=ORGANIZATION_ID,
    policy_id=POLICY_ID,
)

active_policy_id = get_active_policy_id(
    ORGANIZATION_ID
)

print(f"Active Policy ID: {active_policy_id}")

assert active_policy_id == POLICY_ID

print("Policy activation test passed.")