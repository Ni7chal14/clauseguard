from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT pg_get_constraintdef(oid)
            FROM pg_constraint
            WHERE conname = 'chk_users_role';
            """
        )

        result = cursor.fetchone()

        print("ROLE CONSTRAINT:")
        print(result[0] if result else "Constraint not found.")

finally:
    conn.close()