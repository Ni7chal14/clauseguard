docker psfrom app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                id,
                review_id,
                policy_id,
                policy_version,
                section,
                citation_text
            FROM review_citations
            ORDER BY id;
            """
        )

        rows = cursor.fetchall()

        print("==============================")
        print("SAVED REVIEW CITATIONS")
        print("==============================")

        if not rows:
            print("No citations found.")

        for row in rows:
            print(row)

finally:
    conn.close()