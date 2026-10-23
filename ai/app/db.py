import os

import psycopg
from dotenv import load_dotenv


load_dotenv()


def get_db_connection():
    """Create and return a PostgreSQL database connection."""

    database_url = os.getenv("DATABASE_URL")

    if not database_url:
        raise RuntimeError(
            "DATABASE_URL is not configured in the environment."
        )

    return psycopg.connect(database_url)