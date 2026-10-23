from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            DELETE FROM review_citations
            WHERE review_id = %s
            RETURNING id;
            """,
            (2,),
        )

        deleted = cursor.fetchall()

    conn.commit()

    print("Deleted test citations:")

    for row in deleted:
        print(f"- Citation {row[0]}")

    print("\nCitation cleanup completed successfully.")

except Exception:
    conn.rollback()
    raise

finally:
    conn.close()