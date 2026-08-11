def evaluate_leave_request(leave_days: int) -> dict:
    """
    Evaluate a leave request against the current Employee Leave Policy.

    Policy:
    - Up to 3 consecutive days does not trigger the manager-approval rule.
    - More than 3 consecutive days requires manager approval.
    """

    if leave_days <= 3:
        return {
            "status": "APPROVED",
            "reason": "The leave request does not exceed 3 consecutive days.",
            "severity": "LOW",
            "recommended_action": "No additional approval is required under this rule.",
        }

    return {
        "status": "NEEDS_REVIEW",
        "reason": "Leave requests exceeding 3 consecutive days require manager approval.",
        "severity": "MEDIUM",
        "recommended_action": "Route the request to the employee's manager for approval.",
    }

from datetime import date, timedelta


def evaluate_advance_notice(submission_date: date, leave_start_date: date) -> dict:
    """
    Check whether a leave request was submitted at least
    2 working days before the leave start date.
    """

    working_days = 0
    current_date = submission_date

    while current_date < leave_start_date:
        current_date += timedelta(days=1)

        if current_date < leave_start_date and current_date.weekday() < 5:
            working_days += 1

    if working_days >= 2:
        return {
            "compliant": True,
            "reason": "The leave request was submitted at least 2 working days in advance.",
        }

    return {
        "compliant": False,
        "reason": "The leave request was not submitted at least 2 working days in advance.",
    }

def evaluate_leave_policy(
    leave_days: int,
    submission_date: date | None,
    leave_start_date: date | None,
) -> dict:
    """Evaluate all currently implemented leave-policy rules."""

    duration_result = evaluate_leave_request(leave_days)

    issues = []

    if duration_result["status"] == "NEEDS_REVIEW":
        issues.append(duration_result["reason"])

    # We cannot evaluate the advance-notice rule without both dates.
    if submission_date is None or leave_start_date is None:
        issues.append(
            "The submission date and leave start date are required "
            "to evaluate the 2-working-day advance-notice requirement."
        )
    else:
        notice_result = evaluate_advance_notice(
            submission_date,
            leave_start_date,
        )

        if not notice_result["compliant"]:
            issues.append(notice_result["reason"])

    if not issues:
        return {
            "status": "APPROVED",
            "severity": "LOW",
            "reasons": [
                "The leave duration does not trigger the manager-approval requirement.",
                "The request satisfies the 2-working-day advance-notice requirement.",
            ],
            "recommended_action": (
                "No additional action is required under the evaluated "
                "leave-policy rules."
            ),
        }

    return {
        "status": "NEEDS_REVIEW",
        "severity": "MEDIUM",
        "reasons": issues,
        "recommended_action": (
            "Review the request and address the identified policy requirements."
        ),
    }