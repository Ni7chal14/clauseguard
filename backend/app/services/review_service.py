from datetime import datetime, timezone
import json
from ..db import get_db_connection


def create_submission(
    organization_id: int,
    employee_id: int,
    leave_type: str,
    leave_days: int,
    submission_date,
    leave_start_date,
    description: str,
) -> int:
    """
    Create a submission record and return its ID.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            submission_data = {
                "leave_type": leave_type,
                "leave_days": leave_days,
                "description": description,
                "submission_date": (
                    submission_date.isoformat()
                    if submission_date
                    else None
                ),
                "leave_start_date": (
                    leave_start_date.isoformat()
                    if leave_start_date
                    else None
                ),
            }

            cursor.execute(
                """
                INSERT INTO submissions (
                    organization_id,
                    employee_id,
                    document_type,
                    file_url,
                    submission_data,
                    status,
                    submitted_at,
                    updated_at
                )
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
                RETURNING id;
                """,
                (
                    organization_id,
                    employee_id,
                    "LEAVE_REQUEST",
                    "api://leave-request",
                    json.dumps(submission_data),
                    "PENDING",
                    datetime.now(timezone.utc),
                    datetime.now(timezone.utc),
                ),
            )

            submission_id = cursor.fetchone()[0]

        conn.commit()

        return submission_id

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


def create_review(
    submission_id: int,
    status: str,
    explanation: str,
    severity: str,
    recommended_action: str,
    ai_output: dict,
) -> int:
    """
    Create a review for a submission and return the review ID.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            # Determine the next review number for this submission.
            cursor.execute(
                """
                SELECT COALESCE(MAX(review_number), 0) + 1
                FROM reviews
                WHERE submission_id = %s;
                """,
                (submission_id,),
            )

            review_number = cursor.fetchone()[0]

            cursor.execute(
                """
                INSERT INTO reviews (
                    submission_id,
                    review_number,
                    status,
                    explanation,
                    severity,
                    recommended_action,
                    ai_output
                )
                VALUES (
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s,
                    %s
                )
                RETURNING id;
                """,
                (
                    submission_id,
                    review_number,
                    status,
                    explanation,
                    severity,
                    recommended_action,
                    json.dumps(ai_output),
                ),
            )

            review_id = cursor.fetchone()[0]

        conn.commit()

        return review_id

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()


def update_submission_status(
    submission_id: int,
    status: str,
) -> None:
    """
    Update the final status of a submission.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE submissions
                SET
                    status = %s,
                    updated_at = %s
                WHERE id = %s;
                """,
                (
                    status,
                    datetime.now(timezone.utc),
                    submission_id,
                ),
            )

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

def create_review_citations(
    review_id: int,
    policy_id: int,
    policy_version: str,
    citations: list[dict],
) -> None:
    """
    Store the policy evidence used by a review.
    """

    if not citations:
        return

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            for citation in citations:
                cursor.execute(
                    """
                    INSERT INTO review_citations (
                        review_id,
                        policy_id,
                        policy_version,
                        section,
                        citation_text
                    )
                    VALUES (
                        %s,
                        %s,
                        %s,
                        %s,
                        %s
                    );
                    """,
                    (
                        review_id,
                        policy_id,
                        policy_version,
                        citation.get("section"),
                        citation.get("citation_text", ""),
                    ),
                )

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()

def get_submissions(
    organization_id: int,
    employee_id: int | None = None,
) -> list[dict]:
    """
    Retrieve submissions for an organization.
    Optionally filter by employee.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:

            if employee_id is not None:
                cursor.execute(
                    """
                    SELECT
                        s.id,
                        s.organization_id,
                        s.employee_id,
                        s.document_type,
                        s.submission_data,
                        s.status,
                        s.submitted_at,
                        s.updated_at,
                        s.file_url,
                        r.id,
                        r.status,
                        r.severity,
                        r.explanation,
                        r.recommended_action
                    FROM submissions s
                    LEFT JOIN reviews r
                        ON r.id = (
                            SELECT r2.id
                            FROM reviews r2
                            WHERE r2.submission_id = s.id
                            ORDER BY r2.review_number DESC
                            LIMIT 1
                        )
                    WHERE s.organization_id = %s
                      AND s.employee_id = %s
                    ORDER BY s.submitted_at DESC;
                    """,
                    (organization_id, employee_id),
                )
            else:
                cursor.execute(
                    """
                    SELECT
                        s.id,
                        s.organization_id,
                        s.employee_id,
                        s.document_type,
                        s.submission_data,
                        s.status,
                        s.submitted_at,
                        s.updated_at,
                        s.file_url,
                        r.id,
                        r.status,
                        r.severity,
                        r.explanation,
                        r.recommended_action
                    FROM submissions s
                    LEFT JOIN reviews r
                        ON r.id = (
                            SELECT r2.id
                            FROM reviews r2
                            WHERE r2.submission_id = s.id
                            ORDER BY r2.review_number DESC
                            LIMIT 1
                        )
                    WHERE s.organization_id = %s
                    ORDER BY s.submitted_at DESC;
                    """,
                    (organization_id,),
                )

            rows = cursor.fetchall()

            print("DEBUG REVIEW ROW:", rows[0] if rows else "NO ROWS")
            print(
                "DEBUG REVIEW ROW TYPES:",
                [type(value) for value in rows[0]] if rows else "NO ROWS"
            )

            submissions = []

            for row in rows:
                submissions.append(
                    {
                        "id": row[0],
                        "organization_id": row[1],
                        "employee_id": row[2],
                        "document_type": row[3],
                        "submission_data": row[4],
                        "status": row[5],
                        "submitted_at": row[6].isoformat()
                        if row[6]
                        else None,
                        "updated_at": row[7].isoformat()
                        if row[7]
                        else None,
                        "file_url": row[8],
                        "review_id": row[9],
                        "review_status": row[10],
                        "severity": row[11],
                        "explanation": row[12],
                        "recommended_action": row[13],
                        "citations": get_review_citations(row[9]) if row[9] else [],
                    }
                )

            return submissions

    finally:
        conn.close()

def get_review_citations(review_id: int) -> list[dict]:
    """
    Retrieve policy citations saved for a review.
    """

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
                ORDER BY id ASC;
                """,
                (review_id,),
            )

            rows = cursor.fetchall()

            return [
                {
                    "id": row[0],
                    "review_id": row[1],
                    "policy_id": row[2],
                    "policy_version": row[3],
                    "section": row[4],
                    "citation_text": row[5],
                }
                for row in rows
            ]

    finally:
        conn.close()

def get_submission(
    submission_id: int,
) -> dict | None:
    """
    Retrieve a single submission by ID.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT
                    id,
                    organization_id,
                    employee_id,
                    document_type,
                    submission_data,
                    status,
                    submitted_at,
                    updated_at
                FROM submissions
                WHERE id = %s;
                """,
                (submission_id,),
            )

            row = cursor.fetchone()

            if not row:
                return None

            return {
                "id": row[0],
                "organization_id": row[1],
                "employee_id": row[2],
                "document_type": row[3],
                "submission_data": row[4],
                "status": row[5],
                "submitted_at": row[6],
                "updated_at": row[7],
            }

    finally:
        conn.close()

def update_submission_file_url(
    submission_id: int,
    file_url: str,
) -> None:
    """
    Store the uploaded certificate path for a submission.
    """

    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                UPDATE submissions
                SET
                    file_url = %s,
                    updated_at = %s
                WHERE id = %s;
                """,
                (
                    file_url,
                    datetime.now(timezone.utc),
                    submission_id,
                ),
            )

            if cursor.rowcount == 0:
                raise ValueError("Submission not found.")

        conn.commit()

    except Exception:
        conn.rollback()
        raise

    finally:
        conn.close()