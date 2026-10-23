from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT DISTINCT status
            FROM submissions
            ORDER BY status;
            """
        )

        rows = cursor.fetchall()

        print("EXISTING SUBMISSION STATUSES:")

        if not rows:
            print("No submissions found.")

        for row in rows:
            print(f"- {row[0]}")

finally:
    conn.close()