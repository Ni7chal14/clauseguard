from app.db import get_db_connection


ORGANIZATION_ID = 1

conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            INSERT INTO public.users (
                organization_id,
                name,
                email,
                password_hash,
                role
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
                ORGANIZATION_ID,
                "ClauseGuard Admin",
                "admin@clauseguard.demo",
                "DEMO_ONLY_NOT_A_REAL_PASSWORD",
                "HR",
            ),
        )

        user_id = cursor.fetchone()[0]

    conn.commit()

    print("User created successfully.")
    print(f"User ID: {user_id}")

finally:
    conn.close()