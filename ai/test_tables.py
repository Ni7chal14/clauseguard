from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute(
            """
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            ORDER BY table_name;
            """
        )

        tables = cursor.fetchall()

        print("PUBLIC TABLES:")

        for table in tables:
            print(f"- {table[0]}")

finally:
    conn.close()