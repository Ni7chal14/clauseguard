from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                id,
                employee_id,
                status,
                submitted_at,
                submission_data
            FROM public.submissions
            ORDER BY id;
            """
        )

        rows = cursor.fetchall()

        print("EXISTING SUBMISSIONS:")

        if not rows:
            print("No submissions found.")

        for row in rows:
            print("\n----------------------------")
            print(f"ID: {row[0]}")
            print(f"Employee ID: {row[1]}")
            print(f"Status: {row[2]}")
            print(f"Submitted At: {row[3]}")
            print(f"Submission Data: {row[4]}")

finally:
    conn.close()