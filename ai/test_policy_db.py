from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO policies (
                organization_id,
                name,
                version,
                status,
                description
            )
            VALUES (
                %s,
                %s,
                %s,
                %s,
                %s
            )
            RETURNING id;
            """,
            (
                1,
                "Employee Leave Policy",
                "1.0",
                "ACTIVE",
                "Employee leave policy for ClauseGuard demo.",
            ),
        )

        policy_id = cursor.fetchone()[0]

    conn.commit()

    print(f"Policy created successfully.")
    print(f"Policy ID: {policy_id}")

finally:
    conn.close()