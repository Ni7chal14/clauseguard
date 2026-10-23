from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'users'
            ORDER BY ordinal_position;
            """
        )

        columns = cursor.fetchall()

        print("USERS TABLE COLUMNS:")
        for column in columns:
            print(f"- {column[0]} ({column[1]})")

finally:
    conn.close()