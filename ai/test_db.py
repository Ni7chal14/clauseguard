from app.db import get_db_connection


conn = get_db_connection()

try:
    with conn.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) FROM policy_rules;")
        count = cursor.fetchone()[0]

        print(f"policy_rules table connected successfully.")
        print(f"Current policy rules: {count}")

finally:
    conn.close()