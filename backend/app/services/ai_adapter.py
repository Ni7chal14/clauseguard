from types import SimpleNamespace


def convert_rules_to_policy_rules(
    rules: list[dict],
) -> list:
    """
    Convert PostgreSQL rule dictionaries into objects
    compatible with the existing AI rule engine.

    The AI rule engine expects objects with attributes such as:
    rule_type, condition, value, unit, action, and metadata.
    """

    policy_rules = []

    for rule in rules:
        policy_rule = SimpleNamespace(
            id=rule.get("id"),
            rule_type=rule.get("rule_type"),
            condition=rule.get("condition"),
            value=rule.get("value"),
            unit=rule.get("unit"),
            action=rule.get("action"),
            metadata=rule.get("metadata") or {},
        )

        policy_rules.append(policy_rule)

    return policy_rules