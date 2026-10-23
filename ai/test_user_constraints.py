from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT
                column_name,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
            """
        )

        rows = cursor.fetchall()

        print("USERS TABLE:")
        for column_name, nullable, default in rows:
            print(
                f"- {column_name} | "
                f"nullable={nullable} | "
                f"default={default}"
            )

finally:
    conn.close()