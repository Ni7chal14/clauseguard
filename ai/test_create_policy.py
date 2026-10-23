from app.db import get_db_connection


ORGANIZATION_ID = 1
UPLOADED_BY = 2


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
                "1.0",
                "test_data/text_policy.txt",
                UPLOADED_BY,
                True,
            ),
        )

        policy_id = cursor.fetchone()[0]

    conn.commit()

    print("Policy created successfully.")
    print(f"Policy ID: {policy_id}")

finally:
    conn.close()