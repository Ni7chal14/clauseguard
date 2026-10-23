from app.db import get_db_connection


ORGANIZATION_ID = 1
CURRENT_POLICY_ID = 3


conn = get_db_connection()

try:
    with conn.cursor() as cursor:

        # Show current active policies
        cursor.execute(
            """
            SELECT id, name, version, is_active
            FROM public.policies
            WHERE organization_id = %s
            ORDER BY id;
            """,
            (ORGANIZATION_ID,),
        )

        policies = cursor.fetchall()

        print("CURRENT POLICIES:")
        for policy in policies:
            print(policy)

finally:
    conn.close()