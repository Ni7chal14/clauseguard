from fastapi import HTTPException

from ..db import get_db_connection

def get_active_policy_rules(organization_id: int) -> dict:
    """
    Load the active policy for an organization and convert its
    PostgreSQL rules into the structure expected by the AI engine.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            # -------------------------------------------------
            # Find active policy
            # -------------------------------------------------

            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    version
                FROM policies
                WHERE organization_id = %s
                  AND is_active = TRUE
                  AND name = 'Employee Leave Policy'
                ORDER BY created_at DESC
                LIMIT 1;
                """,
                (organization_id,),
            )

            policy = cursor.fetchone()

            if policy is None:
                raise HTTPException(
                    status_code=404,
                    detail="No active policy found for this organization.",
                )

            policy_id = policy[0]

            # -------------------------------------------------
            # Load policy rules
            # -------------------------------------------------

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

            rows = cursor.fetchall()

            return {
                "policy": {
                    "id": policy[0],
                    "name": policy[1],
                    "version": policy[2],
                },
                "rules": [
                    {
                        "id": row[0],
                        "rule_type": row[1],
                        "condition": row[2],
                        "value": float(row[3])
                        if row[3] is not None
                        else None,
                        "unit": row[4],
                        "action": row[5],
                        "metadata": row[6] or {},
                    }
                    for row in rows
                ],
            }

    finally:
        conn.close()

def get_active_policy_ids(organization_id: int) -> list[int]:
    """
    Return all active policy IDs for an organization.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id
                FROM policies
                WHERE organization_id = %s
                  AND is_active = TRUE
                ORDER BY created_at DESC;
                """,
                (organization_id,),
            )

            rows = cursor.fetchall()

            return [row[0] for row in rows]

    finally:
        conn.close()

def get_policy_metadata(policy_id: int) -> dict | None:
    """
    Return basic metadata for a policy.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    name,
                    version
                FROM policies
                WHERE id = %s;
                """,
                (policy_id,),
            )

            policy = cursor.fetchone()

            if policy is None:
                return None

            return {
                "id": policy[0],
                "name": policy[1],
                "version": policy[2],
            }

    finally:
        conn.close()