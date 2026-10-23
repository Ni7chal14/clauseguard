from app.services.review_service import (
    create_submission,
    create_review,
    update_submission_status,
)


print("==============================")
print("REVIEW SERVICE TEST")
print("==============================")


# ---------------------------------------------------------
# 1. Create a test submission
# ---------------------------------------------------------

submission_id = create_submission(
    organization_id=1,
    employee_id=2,
    leave_type="ANNUAL LEAVE",
    leave_days=4,
    submission_date=None,
    leave_start_date=None,
)

print(f"Submission created: {submission_id}")


# ---------------------------------------------------------
# 2. Create a test review
# ---------------------------------------------------------

review_id = create_review(
    submission_id=submission_id,
    status="NEEDS_REVIEW",
    explanation="Test review created by ClauseGuard backend.",
    severity="MEDIUM",
    recommended_action="Review the request.",
    ai_output={
        "test": True,
        "status": "NEEDS_REVIEW",
    },
)

print(f"Review created: {review_id}")


# ---------------------------------------------------------
# 3. Update submission status
# ---------------------------------------------------------

update_submission_status(
    submission_id=submission_id,
    status="NEEDS_REVIEW",
)

print(
    f"Submission {submission_id} status updated to NEEDS_REVIEW."
)

print("\nPersistence test completed successfully.")