from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:

        print("==============================")
        print("SAVED SUBMISSIONS")
        print("==============================")

        cursor.execute(
            """
            SELECT
                id,
                organization_id,
                employee_id,
                document_type,
                submission_data,
                status
            FROM submissions
            ORDER BY id;
            """
        )

        for row in cursor.fetchall():
            print(row)

        print("\n==============================")
        print("SAVED REVIEWS")
        print("==============================")

        cursor.execute(
            """
            SELECT
                id,
                submission_id,
                review_number,
                status,
                severity,
                explanation,
                recommended_action,
                ai_output
            FROM reviews
            ORDER BY id;
            """
        )

        for row in cursor.fetchall():
            print(row)

finally:
    conn.close()