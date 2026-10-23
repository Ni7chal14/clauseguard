import re

from .policy_rules import PolicyRule, PolicyRuleSet

def extract_policy_rules(
    policy_text: str,
    policy_name: str = "Employee Leave Policy",
    policy_version: str | None = None,
) -> PolicyRuleSet:
    """
    Extract structured leave-policy rules from policy text.

    This extractor currently supports the policy patterns used by
    the ClauseGuard MVP leave-policy format.
    """

    rules = []

    # ---------------------------------------------------------
    # Annual leave entitlement
    # Example:
    # "Employees are entitled to 12 days of annual leave per year."
    # ---------------------------------------------------------

    annual_leave_match = re.search(
        r"(?:entitled\s+to|may\s+take|allowed|receive)\s+"
        r"(\d+)\s+days?\s+of\s+annual\s+leave"
        r"(?:\s+per\s+year)?",
        policy_text,
        re.IGNORECASE,
    )

    if annual_leave_match:
        rules.append(
            PolicyRule(
                rule_type="ANNUAL_LEAVE_LIMIT",
                value=int(annual_leave_match.group(1)),
                unit="DAYS",
                metadata={
                    "period": "YEAR",
                },
            )
        )

    # ---------------------------------------------------------
    # Leave duration / manager approval
    #
    # Example:
    # "Leave requests exceeding 3 consecutive days require
    # manager approval."
    # ---------------------------------------------------------

    duration_match = re.search(
        r"(?:leave requests?|requests?)\s+"
        r"(?:exceeding|over|greater than|more than)\s+"
        r"(\d+)\s+"
        r"(?:consecutive\s+)?days?"
        r".*?"
        r"(?:require|need|must have)\s+"
        r"manager\s+approval",
        policy_text,
        re.IGNORECASE | re.DOTALL,
    )

    if duration_match:
        rules.append(
            PolicyRule(
                rule_type="LEAVE_DURATION",
                condition="GREATER_THAN",
                value=int(duration_match.group(1)),
                unit="CONSECUTIVE_DAYS",
                action="MANAGER_APPROVAL_REQUIRED",
            )
        )

    # ---------------------------------------------------------
    # Advance notice
    #
    # Example:
    # "Employees must submit leave requests at least
    # 2 working days before..."
    # ---------------------------------------------------------

    notice_match = re.search(
        r"(?:submit|submitted).*?"
        r"(?:at least|minimum(?:\s+of)?)\s+"
        r"(\d+)\s+"
        r"(?:working|business)\s+days?"
        r".*?"
        r"(?:before|prior to|in advance)",
        policy_text,
        re.IGNORECASE | re.DOTALL,
    )

    if notice_match:
        rules.append(
            PolicyRule(
                rule_type="ADVANCE_NOTICE",
                condition="LESS_THAN",
                value=int(notice_match.group(1)),
                unit="WORKING_DAYS",
                action="NEEDS_REVIEW",
            )
        )

    # ---------------------------------------------------------
    # Emergency leave
    #
    # Example:
    # "Emergency leave may be submitted without the 2-day
    # advance requirement, subject to manager approval."
    # ---------------------------------------------------------

    emergency_match = re.search(
        r"emergency\s+leave.*?"
        r"(?:without|no)\s+"
        r"(?:any\s+)?"
        r"(?:advance|prior)\s+(?:notice|requirement).*?"
        r"(?:requires?|subject\s+to|needs?)\s+"
        r"manager\s+approval",
        policy_text,
        re.IGNORECASE | re.DOTALL,
    )

    if emergency_match:
        rules.append(
            PolicyRule(
                rule_type="EMERGENCY_LEAVE",
                action="MANAGER_APPROVAL_REQUIRED",
                metadata={
                    "advance_notice_exempt": True,
                },
            )
        )

    return PolicyRuleSet(
        policy_name=policy_name,
        policy_version=policy_version,
        rules=rules,
    )