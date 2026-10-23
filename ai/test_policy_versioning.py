from app.db import get_db_connection
from app.policy_repository import (
    activate_policy,
    get_active_policy_id,
)


ORGANIZATION_ID = 1


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO public.policies (
                organization_id,
                name,
                document_type,
                version,
                file_url,
                uploaded_by,
                is_active
            )
            VALUES (
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            RETURNING id;
            """,
            (
                ORGANIZATION_ID,
                "Employee Leave Policy",
                "TXT",
                "2.0",
                "test_data/text_policy_v2.txt",
                2,
                False,
            ),
        )

        policy_id = cursor.fetchone()[0]

    conn.commit()

    print(f"Policy v2 created. ID: {policy_id}")

finally:
    conn.close()


# Activate v2
activate_policy(
    organization_id=ORGANIZATION_ID,
    policy_id=policy_id,
)

# Verify
active_policy_id = get_active_policy_id(
    ORGANIZATION_ID
)

print(f"Active Policy ID: {active_policy_id}")

assert active_policy_id == policy_id

print("Policy versioning test passed.")