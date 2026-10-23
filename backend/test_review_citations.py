from app.db import get_db_connection

from app.services.review_service import create_review_citations


# Use the review and policy that already exist in the database.
REVIEW_ID = 2
POLICY_ID = 4
POLICY_VERSION = "2.0"


citations = [
    {
        "section": "Employee Leave Policy",
        "citation_text": (
            "Employees must submit leave requests at least "
            "3 working days before the requested leave date."
        ),
    }
]


create_review_citations(
    review_id=REVIEW_ID,
    policy_id=POLICY_ID,
    policy_version=POLICY_VERSION,
    citations=citations,
)


print("==============================")
print("REVIEW CITATION TEST")
print("==============================")
print("Citation created successfully.")


# Verify the inserted citation.
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
            WHERE review_id = %s
            ORDER BY id;
            """,
            (REVIEW_ID,),
        )

        rows = cursor.fetchall()

        print("\nSAVED CITATIONS:")

        for row in rows:
            print(row)

finally:
    conn.close()