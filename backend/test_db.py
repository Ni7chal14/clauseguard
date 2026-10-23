from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute("SELECT current_database();")
        result = cursor.fetchone()

        print("Database connection successful.")
        print(f"Database: {result[0]}")

finally:
    conn.close()