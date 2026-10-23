from app.db import get_db_connection


TEST_SUBMISSION_IDS = (1, 2)


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM submissions
            WHERE id IN (%s, %s)
            RETURNING id;
            """,
            TEST_SUBMISSION_IDS,
        )

        deleted = cursor.fetchall()

    conn.commit()

    print("Deleted test submissions:")

    for row in deleted:
        print(f"- Submission {row[0]}")

    print("\nTest data cleanup completed successfully.")

except Exception:
    conn.rollback()
    raise

finally:
    conn.close()