from psycopg.types.json import Jsonb

from .db import get_db_connection
from .policy_rules import PolicyRule, PolicyRuleSet


def save_policy_rules(
    policy_id: int,
    policy_rule_set: PolicyRuleSet,
) -> int:
    """
    Save extracted policy rules to PostgreSQL.

    Returns the number of rules inserted.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            for rule in policy_rule_set.rules:
                cursor.execute(
                    """
                    INSERT INTO public.policy_rules (
                        policy_id,
                        rule_type,
                        condition,
                        value,
                        unit,
                        action,
                        metadata
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    """,
                    (
                        policy_id,
                        rule.rule_type,
                        rule.condition,
                        rule.value,
                        rule.unit,
                        rule.action,
                        Jsonb(rule.metadata)
                        if rule.metadata is not None
                        else None,
                    ),
                )

        conn.commit()

        return len(policy_rule_set.rules)

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


def get_policy_rules(
    policy_id: int,
) -> list[PolicyRule]:
    """
    Retrieve all rules belonging to a policy
    as PolicyRule objects.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
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
                (policy_id,),
            )

            rows = cursor.fetchall()

            return [
                PolicyRule(
                    rule_type=row[0],
                    condition=row[1],
                    value=int(row[2]) if row[2] is not None else None,
                    unit=row[3],
                    action=row[4],
                    metadata=row[5] or {},
                )
                for row in rows
            ]

    finally:
        conn.close()

def get_active_policy_id(organization_id: int) -> int | None:
    """
    Get the ID of the currently active policy for an organization.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT id
                FROM public.policies
                WHERE organization_id = %s
                  AND is_active = TRUE
                ORDER BY created_at DESC
                LIMIT 1;
                """,
                (organization_id,),
            )

            row = cursor.fetchone()

            if row is None:
                return None

            return row[0]

    finally:
        conn.close()

def activate_policy(
    organization_id: int,
    policy_id: int,
) -> None:
    """
    Make one policy the active policy for an organization.

    The operation is transactional:
    - deactivate all existing policies
    - activate the selected policy
    - rollback everything if an error occurs
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            # Make sure the selected policy belongs
            # to the organization.
            cursor.execute(
                """
                SELECT id
                FROM public.policies
                WHERE id = %s
                  AND organization_id = %s;
                """,
                (policy_id, organization_id),
            )

            if cursor.fetchone() is None:
                raise ValueError(
                    "The selected policy does not belong "
                    "to the specified organization."
                )

            # Deactivate all policies for this organization.
            cursor.execute(
                """
                UPDATE public.policies
                SET is_active = FALSE
                WHERE organization_id = %s;
                """,
                (organization_id,),
            )

            # Activate the selected policy.
            cursor.execute(
                """
                UPDATE public.policies
                SET is_active = TRUE
                WHERE id = %s
                  AND organization_id = %s;
                """,
                (policy_id, organization_id),
            )

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()