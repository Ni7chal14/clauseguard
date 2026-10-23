from fastapi import APIRouter, HTTPException, Query, Depends
from datetime import datetime
from ..schemas.review import (
    LeaveReviewRequest,
    ReviewResponse,
)
from ..db import get_db_connection
from ..auth import require_role
from ..auth import get_current_user
from ..services.policy_service import get_active_policy_rules
from ..services.ai_adapter import convert_rules_to_policy_rules
from ..services.review_service import (
    create_submission,
    create_review,
    create_review_citations,
    update_submission_status,
    get_submissions,
    get_review_citations,
    get_submission,
)
from ..services.citation_service import get_policy_citations
from ..services.review_explanation_service import generate_review_explanation

from ai.app.rules import evaluate_leave_policy


router = APIRouter(
    prefix="/api/reviews",
    tags=["Reviews"],
)


@router.post("", response_model=ReviewResponse)
def create_review_endpoint(
    request: LeaveReviewRequest,
    current_user: dict = Depends(get_current_user),
):

    # ---------------------------------------------------------
    # 1. Create submission
    # ---------------------------------------------------------

    submission_id = create_submission(
        organization_id=current_user["organization_id"],
        employee_id=current_user["id"],
        leave_type=request.leave_type,
        leave_days=request.leave_days,
        submission_date=request.submission_date,
        leave_start_date=request.leave_start_date,
        description=request.description,
    )

    try:
        # -----------------------------------------------------
        # 2. Load active policy
        # -----------------------------------------------------

        policy = get_active_policy_rules(
            request.organization_id
        )

        # -----------------------------------------------------
        # 3. Convert DB rules for AI engine
        # -----------------------------------------------------

        policy_rules = convert_rules_to_policy_rules(
            policy["rules"]
        )

        # -----------------------------------------------------
        # 4. Evaluate request
        # -----------------------------------------------------

        result = evaluate_leave_policy(
            leave_type=request.leave_type,
            leave_days=request.leave_days,
            submission_date=request.submission_date,
            leave_start_date=request.leave_start_date,
            policy_rules=policy_rules,
        )

        # -----------------------------------------------------
        # 5. Retrieve supporting policy evidence
        # -----------------------------------------------------

        document_text = (
            f"{request.leave_type} policy requirements. "
            f"Leave duration of {request.leave_days} days. "
            f"Annual leave entitlement. "
            f"Manager approval requirements. "
            f"Advance notice requirements. "
            f"Submission date {request.submission_date}. "
            f"Leave start date {request.leave_start_date}."
        )

        citations = get_policy_citations(
            document_text=document_text,
            policy_id=policy["policy"]["id"],
        )

        explanation = generate_review_explanation(
            status=result["status"],
            severity=result["severity"],
            reasons=result["reasons"],
            recommended_action=result["recommended_action"],
            policy_name=policy["policy"]["name"],
            policy_version=policy["policy"]["version"],
            policy_evidence=citations,
        )

        # -----------------------------------------------------
        # 6. Save review
        # -----------------------------------------------------

        review_id = create_review(
            submission_id=submission_id,
            status=result["status"],
            explanation=explanation,
            severity=result["severity"],
            recommended_action=result["recommended_action"],
            ai_output={
                "status": result["status"],
                "severity": result["severity"],
                "reasons": result["reasons"],
                "recommended_action": result["recommended_action"],
                "policy_id": policy["policy"]["id"],
                "policy_version": policy["policy"]["version"],
            },
        )

        # -----------------------------------------------------
        # 7. Save policy citations
        # -----------------------------------------------------

        create_review_citations(
            review_id=review_id,
            policy_id=policy["policy"]["id"],
            policy_version=policy["policy"]["version"],
            citations=citations,
        )

        # -----------------------------------------------------
        # 8. Update submission status
        # -----------------------------------------------------

        update_submission_status(
            submission_id=submission_id,
            status=result["status"],
        )

        # -----------------------------------------------------
        # 9. Return API response
        # -----------------------------------------------------

        return {
            "submission_id": submission_id,
            "status": result["status"],
            "severity": result["severity"],
            "reasons": result["reasons"],
            "recommended_action": result["recommended_action"],
            "policy_id": policy["policy"]["id"],
            "policy_name": policy["policy"]["name"],
            "policy_version": policy["policy"]["version"],
        }

    except Exception:
        # -----------------------------------------------------
        # If evaluation fails, mark submission for review.
        # -----------------------------------------------------

        update_submission_status(
            submission_id=submission_id,
            status="NEEDS_REVIEW",
        )

        raise

@router.get("")
def get_reviews(
    organization_id: int = Query(1),
    employee_id: int | None = Query(None),
    current_user: dict = Depends(get_current_user),
):
    if current_user["role"] == "HR":
        return get_submissions(
            organization_id=current_user["organization_id"],
            employee_id=employee_id,
        )

    return get_submissions(
        organization_id=current_user["organization_id"],
        employee_id=current_user["id"],
    )

@router.get("/{review_id}/citations")
def get_citations(
    review_id: int,
    current_user: dict = Depends(get_current_user),
):
    conn = get_db_connection()

    try:
        with conn.cursor() as cursor:
            cursor.execute(
                """
                SELECT s.organization_id, s.employee_id
                FROM reviews r
                JOIN submissions s ON s.id = r.submission_id
                WHERE r.id = %s;
                """,
                (review_id,),
            )

            row = cursor.fetchone()

            if row is None:
                raise HTTPException(
                    status_code=404,
                    detail="Review not found.",
                )

            organization_id, employee_id = row

            if organization_id != current_user["organization_id"]:
                raise HTTPException(
                    status_code=403,
                    detail="You do not have access to this review.",
                )

            if (
                current_user["role"] != "HR"
                and employee_id != current_user["id"]
            ):
                raise HTTPException(
                    status_code=403,
                    detail="You do not have access to this review.",
                )

    finally:
        conn.close()

    return get_review_citations(review_id)

@router.post("/submissions/{submission_id}/rereview")
def rereview_submission(
    submission_id: int,
    current_user: dict = Depends(require_role("HR")),
):

    # 1. Get the existing submission
    submission = get_submission(submission_id)

    if not submission:
        return {
            "error": "Submission not found."
        }

    data = submission["submission_data"]

    submission_date = datetime.strptime(
        data["submission_date"],
        "%Y-%m-%d"
    ).date()

    leave_start_date = datetime.strptime(
        data["leave_start_date"],
        "%Y-%m-%d"
    ).date()

    # 2. Load the active policy
    policy = get_active_policy_rules(
        submission["organization_id"]
    )

    # 3. Convert policy rules
    policy_rules = convert_rules_to_policy_rules(
        policy["rules"]
    )

    # 4. Evaluate the submission again
    result = evaluate_leave_policy(
        leave_type=data["leave_type"],
        leave_days=data["leave_days"],
        submission_date=submission_date,
        leave_start_date=leave_start_date,
        policy_rules=policy_rules,
    )

    # 5. Retrieve supporting policy evidence
    document_text = (
        f"{data['leave_type']} policy requirements. "
        f"Leave duration of {data['leave_days']} days. "
        f"Annual leave entitlement. "
        f"Manager approval requirements. "
        f"Advance notice requirements. "
        f"Submission date {data['submission_date']}. "
        f"Leave start date {data['leave_start_date']}."
    )

    citations = get_policy_citations(
        document_text=document_text,
        policy_id=policy["policy"]["id"],
    )

    # 6. Create a NEW review
    review_id = create_review(
        submission_id=submission_id,
        status=result["status"],
        explanation="\n".join(result["reasons"]),
        severity=result["severity"],
        recommended_action=result["recommended_action"],
        ai_output={
            "status": result["status"],
            "severity": result["severity"],
            "reasons": result["reasons"],
            "recommended_action": result["recommended_action"],
            "policy_id": policy["policy"]["id"],
            "policy_version": policy["policy"]["version"],
        },
    )

    # 7. Save the NEW citations
    create_review_citations(
        review_id=review_id,
        policy_id=policy["policy"]["id"],
        policy_version=policy["policy"]["version"],
        citations=citations,
    )

    # 8. Update submission status
    update_submission_status(
        submission_id=submission_id,
        status=result["status"],
    )

    return {
        "submission_id": submission_id,
        "review_id": review_id,
        "status": result["status"],
        "severity": result["severity"],
        "reasons": result["reasons"],
        "recommended_action": result["recommended_action"],
        "policy_id": policy["policy"]["id"],
        "policy_name": policy["policy"]["name"],
        "policy_version": policy["policy"]["version"],
    }

@router.post("/submissions/{submission_id}/decision")
def decide_submission(
    submission_id: int,
    decision: str,
    current_user: dict = Depends(require_role("HR")),
):
    # 1. Verify submission exists
    submission = get_submission(submission_id)

    if not submission:
        raise HTTPException(
            status_code=404,
            detail="Submission not found.",
        )

    # 2. Validate HR decision
    allowed_decisions = {
        "REVIEW",
        "APPROVED",
        "REJECTED",
    }

    decision = decision.upper()

    if decision not in allowed_decisions:
        raise HTTPException(
            status_code=400,
            detail="Decision must be REVIEW, APPROVED, or REJECTED.",
        )

    # 3. Map HR decision to submission status
    status_map = {
        "REVIEW": "NEEDS_REVIEW",
        "APPROVED": "APPROVED",
        "REJECTED": "REJECTED",
    }

    new_status = status_map[decision]

    # 4. Update the submission's final status
    update_submission_status(
        submission_id=submission_id,
        status=new_status,
    )

    # 5. Record the HR decision as a new review/history entry
    review_id = create_review(
        submission_id=submission_id,
        status=new_status,
        explanation=f"HR manually marked this submission as {decision}.",
        severity="LOW",
        recommended_action=(
            "No further action required."
            if decision == "APPROVED"
            else "Review the submission and address the HR decision."
        ),
        ai_output={
            "source": "HR",
            "decision": decision,
            "status": new_status,
        },
    )

    return {
        "submission_id": submission_id,
        "decision": decision,
        "status": new_status,
        "review_id": review_id,
        "message": f"Submission {decision.lower()} successfully.",
    }