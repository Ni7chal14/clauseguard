from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO organizations (
                name
            )
            VALUES (
                %s
            )
            RETURNING id;
            """,
            (
                "ClauseGuard Demo Company",
            ),
        )

        organization_id = cursor.fetchone()[0]

    conn.commit()

    print("Organization created successfully.")
    print(f"Organization ID: {organization_id}")

finally:
    conn.close()