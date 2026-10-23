from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                conname,
                pg_get_constraintdef(oid)
            FROM pg_constraint
            WHERE conrelid = 'public.submissions'::regclass;
            """
        )

        rows = cursor.fetchall()

        print("SUBMISSIONS TABLE CONSTRAINTS:")

        for row in rows:
            print(f"- {row[0]}")
            print(f"  {row[1]}")

finally:
    conn.close()