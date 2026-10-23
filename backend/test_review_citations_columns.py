from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'review_citations'
            ORDER BY ordinal_position;
            """
        )

        rows = cursor.fetchall()

        print("REVIEW_CITATIONS TABLE COLUMNS:")

        for row in rows:
            print(
                f"- {row[0]} | "
                f"type={row[1]} | "
                f"nullable={row[2]} | "
                f"default={row[3]}"
            )

finally:
    conn.close()