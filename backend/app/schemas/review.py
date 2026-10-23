from datetime import date

from pydantic import BaseModel, Field


class LeaveReviewRequest(BaseModel):
    organization_id: int = Field(gt=0)
    employee_id: int = Field(gt=0)

    leave_type: str = Field(
        min_length=1,
        max_length=100,
    )

    leave_days: int = Field(
        gt=0,
    )

    description: str = Field(
        min_length=1,
        max_length=2000,
    )

    submission_date: date | None = None
    leave_start_date: date | None = None


class ReviewResponse(BaseModel):
    submission_id: int
    status: str
    severity: str
    reasons: list[str]
    recommended_action: str
    policy_id: int
    policy_name: str
    policy_version: str