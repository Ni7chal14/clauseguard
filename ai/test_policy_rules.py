from app.policy_rules import PolicyRule, PolicyRuleSet


policy = PolicyRuleSet(
    policy_name="Employee Leave Policy",
    policy_version="1.0",
    rules=[
        PolicyRule(
            rule_type="ANNUAL_LEAVE_LIMIT",
            value=12,
            unit="DAYS",
            metadata={
                "period": "YEAR",
            },
        ),
        PolicyRule(
            rule_type="LEAVE_DURATION",
            condition="GREATER_THAN",
            value=3,
            unit="CONSECUTIVE_DAYS",
            action="MANAGER_APPROVAL_REQUIRED",
        ),
        PolicyRule(
            rule_type="ADVANCE_NOTICE",
            condition="LESS_THAN",
            value=2,
            unit="WORKING_DAYS",
            action="NEEDS_REVIEW",
        ),
        PolicyRule(
            rule_type="EMERGENCY_LEAVE",
            action="MANAGER_APPROVAL_REQUIRED",
            metadata={
                "advance_notice_exempt": True,
            },
        ),
    ],
)


print(f"Policy: {policy.policy_name}")
print(f"Version: {policy.policy_version}")

for rule in policy.rules:
    print("\n----------------------------")
    print(f"Rule type: {rule.rule_type}")
    print(f"Condition: {rule.condition}")
    print(f"Value: {rule.value}")
    print(f"Unit: {rule.unit}")
    print(f"Action: {rule.action}")
    print(f"Metadata: {rule.metadata}")