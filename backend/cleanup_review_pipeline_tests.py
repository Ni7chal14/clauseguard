from app.db import get_db_connection


TEST_SUBMISSION_IDS = [3, 4, 5, 6, 7, 8]


conn = get_db_connection()

try:
    with conn.cursor() as cursor:

        # Check what we're about to delete.
        cursor.execute(
            """
            SELECT id, organization_id, employee_id, document_type
            FROM submissions
            WHERE id = ANY(%s);
            """,
            (TEST_SUBMISSION_IDS,),
        )

        rows = cursor.fetchall()

        print("==============================")
        print("TEST SUBMISSIONS TO DELETE")
        print("==============================")

        for row in rows:
            print(row)

        if not rows:
            print("No matching test submissions found.")
        else:
            cursor.execute(
                """
                DELETE FROM submissions
                WHERE id = ANY(%s)
                RETURNING id;
                """,
                (TEST_SUBMISSION_IDS,),
            )

            deleted = cursor.fetchall()

            conn.commit()

            print("\nDeleted test submissions:")

            for row in deleted:
                print(f"- Submission {row[0]}")

            print("\nReviews and review citations linked to these submissions")
            print("were deleted automatically through ON DELETE CASCADE.")

except Exception:
    conn.rollback()
    raise

finally:
    conn.close()