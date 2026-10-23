from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:

        print("==============================")
        print("SUBMISSIONS")
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

        submissions = cursor.fetchall()

        for row in submissions:
            print(row)

        print("\n==============================")
        print("REVIEWS")
        print("==============================")

        cursor.execute(
            """
            SELECT
                id,
                submission_id,
                review_number,
                status,
                explanation,
                severity,
                recommended_action,
                ai_output
            FROM reviews
            ORDER BY id;
            """
        )

        reviews = cursor.fetchall()

        for row in reviews:
            print(row)

finally:
    conn.close()