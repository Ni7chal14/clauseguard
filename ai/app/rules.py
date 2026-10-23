from datetime import date, timedelta

from .policy_rules import PolicyRule

def _find_rule(
    policy_rules: list[PolicyRule],
    rule_type: str,
) -> PolicyRule | None:
    """Find a policy rule by its type."""

    for rule in policy_rules:
        if rule.rule_type == rule_type:
            return rule

    return None


def evaluate_leave_request(
    leave_days: int,
    policy_rules: list[PolicyRule],
) -> dict:
    """
    Evaluate leave duration using the organization's policy rules.
    """

    duration_rule = _find_rule(
        policy_rules,
        "LEAVE_DURATION",
    )

    if duration_rule is None:
        return {
            "compliant": False,
            "reason": (
                "No leave-duration rule was found in the "
                "active organization policy."
            ),
        }

    if duration_rule.value is None:
        return {
            "compliant": False,
            "reason": (
                "The active organization policy contains a "
                "leave-duration rule, but its threshold could "
                "not be determined."
            ),
        }

    if duration_rule.condition == "GREATER_THAN":
        if leave_days > duration_rule.value:
            return {
                "compliant": False,
                "reason": (
                    f"The leave request exceeds the organization's "
                    f"{duration_rule.value}-day consecutive leave "
                    f"threshold and requires manager approval."
                ),
            }

    return {
        "compliant": True,
        "reason": (
            "The leave request does not trigger the organization's "
            "leave-duration approval requirement."
        ),
    }


def evaluate_advance_notice(
    submission_date: date,
    leave_start_date: date,
    policy_rules: list[PolicyRule],
) -> dict:
    """
    Evaluate advance-notice requirements using the organization's
    policy rules.
    """

    notice_rule = _find_rule(
        policy_rules,
        "ADVANCE_NOTICE",
    )

    if notice_rule is None:
        return {
            "compliant": False,
            "reason": (
                "No advance-notice rule was found in the "
                "active organization policy."
            ),
        }

    if notice_rule.value is None:
        return {
            "compliant": False,
            "reason": (
                "The active organization policy contains an "
                "advance-notice rule, but its requirement could "
                "not be determined."
            ),
        }

    working_days = 0
    current_date = submission_date + timedelta(days=1)

    while current_date < leave_start_date:
        if current_date.weekday() < 5:
            working_days += 1

        current_date += timedelta(days=1)

    required_days = int(notice_rule.value)

    if working_days >= required_days:
        return {
            "compliant": True,
            "reason": (
                f"The leave request was submitted at least "
                f"{required_days} working days in advance."
            ),
        }

    return {
        "compliant": False,
        "reason": (
            f"The leave request was not submitted at least "
            f"{required_days} working days in advance."
        ),
    }


def evaluate_emergency_leave(
    policy_rules: list[PolicyRule],
) -> dict:
    """
    Evaluate the emergency-leave rule.

    Emergency leave is exempt from the normal advance-notice
    requirement when the active policy explicitly specifies
    that exemption.

    Manager approval remains required when specified by policy.
    """

    emergency_rule = _find_rule(
        policy_rules,
        "EMERGENCY_LEAVE",
    )

    if emergency_rule is None:
        return {
            "recognized": False,
            "compliant": True,
            "requires_approval": False,
            "reason": (
                "No emergency-leave rule was found in the "
                "active organization policy."
            ),
        }

    advance_notice_exempt = (
        emergency_rule.metadata or {}
    ).get(
        "advance_notice_exempt",
        False,
    )

    requires_approval = (
        emergency_rule.action
        == "MANAGER_APPROVAL_REQUIRED"
    )

    if advance_notice_exempt and requires_approval:
        return {
            "recognized": True,
            "compliant": True,
            "requires_approval": True,
            "reason": (
                "Emergency leave is exempt from the organization's "
                "advance-notice requirement, but manager approval "
                "is required."
            ),
        }

    if advance_notice_exempt:
        return {
            "recognized": True,
            "compliant": True,
            "requires_approval": False,
            "reason": (
                "Emergency leave is exempt from the organization's "
                "advance-notice requirement."
            ),
        }

    if requires_approval:
        return {
            "recognized": True,
            "compliant": True,
            "requires_approval": True,
            "reason": (
                "Emergency leave requires manager approval under "
                "the organization's policy."
            ),
        }

    return {
        "recognized": True,
        "compliant": True,
        "requires_approval": False,
        "reason": (
            "Emergency leave is permitted under the "
            "organization's policy."
        ),
    }


def evaluate_annual_leave_limit(
    leave_days: int,
    used_annual_leave_days: int,
    policy_rules: list[PolicyRule],
) -> dict:
    """
    Evaluate the organization's annual leave entitlement.

    The annual allowance comes from the active policy.
    The number of already-used days will eventually come
    from approved leave submissions in PostgreSQL.
    """

    annual_rule = _find_rule(
        policy_rules,
        "ANNUAL_LEAVE_LIMIT",
    )

    if annual_rule is None:
        return {
            "compliant": True,
            "reason": (
                "No annual leave entitlement rule was found "
                "in the active organization policy."
            ),
        }

    if annual_rule.value is None:
        return {
            "compliant": False,
            "reason": (
                "The active organization policy contains an "
                "annual leave entitlement rule, but its limit "
                "could not be determined."
            ),
        }

    annual_limit = int(annual_rule.value)
    projected_usage = (
        used_annual_leave_days + leave_days
    )

    if projected_usage > annual_limit:
        remaining_days = max(
            annual_limit - used_annual_leave_days,
            0,
        )

        return {
            "compliant": False,
            "reason": (
                f"The requested {leave_days} days would exceed "
                f"the organization's annual leave entitlement "
                f"of {annual_limit} days. The employee has "
                f"{remaining_days} annual leave days remaining."
            ),
        }

    remaining_after_request = (
        annual_limit - projected_usage
    )

    return {
        "compliant": True,
        "reason": (
            f"The requested leave remains within the "
            f"organization's annual entitlement of "
            f"{annual_limit} days. "
            f"{remaining_after_request} annual leave days "
            f"would remain after this request."
        ),
    }


def evaluate_leave_policy(
    leave_days: int,
    leave_type: str,
    submission_date: date | None,
    leave_start_date: date | None,
    policy_rules: list[PolicyRule],
    used_annual_leave_days: int = 0,
) -> dict:
    """
    Evaluate a leave request using the organization's policy rules.

    All policy-specific limits come from policy_rules.

    used_annual_leave_days represents approved annual leave
    already used by the employee during the applicable year.
    """

    issues = []
    compliant_reasons = []

    # Validate leave date order
    if (
        submission_date is not None
        and leave_start_date is not None
        and leave_start_date < submission_date
    ):
        return {
            "status": "NEEDS_REVIEW",
            "severity": "MEDIUM",
            "reasons": [
                "The leave start date cannot be earlier than the submission date."
            ],
            "recommended_action": (
                "Review the leave dates and submit a valid request."
            ),
        }

    normalized_leave_type = (
        leave_type.strip().upper()
        if leave_type
        else None
    )

    # ---------------------------------------------------------
    # Annual leave entitlement
    # ---------------------------------------------------------

    if normalized_leave_type == "ANNUAL LEAVE":
        annual_result = evaluate_annual_leave_limit(
            leave_days=leave_days,
            used_annual_leave_days=used_annual_leave_days,
            policy_rules=policy_rules,
        )

        if annual_result["compliant"]:
            compliant_reasons.append(
                annual_result["reason"]
            )
        else:
            issues.append(
                annual_result["reason"]
            )

    # ---------------------------------------------------------
    # Emergency leave
    # ---------------------------------------------------------

    if normalized_leave_type == "EMERGENCY LEAVE":
        emergency_result = evaluate_emergency_leave(
            policy_rules=policy_rules,
        )

        if not emergency_result["recognized"]:
            issues.append(
                emergency_result["reason"]
            )
        else:
            compliant_reasons.append(
                emergency_result["reason"]
            )

        # Emergency leave bypasses the normal
        # advance-notice requirement.

        duration_result = evaluate_leave_request(
            leave_days=leave_days,
            policy_rules=policy_rules,
        )

        if duration_result["compliant"]:
            compliant_reasons.append(
                duration_result["reason"]
            )
        else:
            issues.append(
                duration_result["reason"]
            )

    # ---------------------------------------------------------
    # Normal leave
    # ---------------------------------------------------------

    else:
        duration_result = evaluate_leave_request(
            leave_days=leave_days,
            policy_rules=policy_rules,
        )

        if duration_result["compliant"]:
            compliant_reasons.append(
                duration_result["reason"]
            )
        else:
            issues.append(
                duration_result["reason"]
            )

        # -----------------------------------------------------
        # Advance notice
        # -----------------------------------------------------

        if (
            submission_date is None
            or leave_start_date is None
        ):
            issues.append(
                "The submission date and leave start date are "
                "required to evaluate the organization's "
                "advance-notice requirement."
            )
        else:
            notice_result = evaluate_advance_notice(
                submission_date=submission_date,
                leave_start_date=leave_start_date,
                policy_rules=policy_rules,
            )

            if notice_result["compliant"]:
                compliant_reasons.append(
                    notice_result["reason"]
                )
            else:
                issues.append(
                    notice_result["reason"]
                )

    # ---------------------------------------------------------
    # Final decision
    # ---------------------------------------------------------

    if not issues:
        return {
            "status": "APPROVED",
            "severity": "LOW",
            "reasons": compliant_reasons,
            "recommended_action": (
                "No additional action is required under "
                "the evaluated leave-policy rules."
            ),
        }

    return {
        "status": "NEEDS_REVIEW",
        "severity": "MEDIUM",
        "reasons": issues + compliant_reasons,
        "recommended_action": (
            "Review the request and address the "
            "identified policy requirements."
        ),
    }