from fastapi import APIRouter, HTTPException

from ..db import get_db_connection


router = APIRouter(
    prefix="/api/organizations/{organization_id}/policies",
    tags=["Policy Rules"],
)


@router.get("/active/rules")
def get_active_policy_rules(
    organization_id: int,
):
    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            # Find the active policy for this organization.
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    version
                FROM policies
                WHERE organization_id = %s
                  AND is_active = TRUE
                ORDER BY created_at DESC
                LIMIT 1;
                """,
                (organization_id,),
            )

            policy = cursor.fetchone()

            if policy is None:
                raise HTTPException(
                    status_code=404,
                    detail="No active policy found.",
                )

            policy_id = policy[0]

            # Get rules belonging to the active policy.
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
                FROM policy_rules
                WHERE policy_id = %s
                ORDER BY id;
                """,
                (policy_id,),
            )

            rules = cursor.fetchall()

            return {
                "organization_id": organization_id,
                "policy": {
                    "id": policy[0],
                    "name": policy[1],
                    "version": policy[2],
                },
                "rules": [
                    {
                        "id": rule[0],
                        "rule_type": rule[1],
                        "condition": rule[2],
                        "value": float(rule[3])
                        if rule[3] is not None
                        else None,
                        "unit": rule[4],
                        "action": rule[5],
                        "metadata": rule[6],
                    }
                    for rule in rules
                ],
            }

    finally:
        conn.close()