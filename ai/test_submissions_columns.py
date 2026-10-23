from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                column_name,
                data_type,
                is_nullable
            FROM information_schema.columns
            WHERE table_schema = 'public'
              AND table_name = 'submissions'
            ORDER BY ordinal_position;
            """
        )

        rows = cursor.fetchall()

        print("SUBMISSIONS TABLE COLUMNS:")

        for row in rows:
            print(
                f"- {row[0]} | "
                f"type={row[1]} | "
                f"nullable={row[2]}"
            )

finally:
    conn.close()