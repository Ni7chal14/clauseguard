from dataclasses import dataclass, field
from typing import Any


@dataclass
class PolicyRule:
    """
    Represents one structured rule extracted from a company policy.
    """

    rule_type: str
    condition: str | None = None
    value: Any = None
    unit: str | None = None
    action: str | None = None
    metadata: dict = field(default_factory=dict)


@dataclass
class PolicyRuleSet:
    """
    Collection of rules belonging to one policy.
    """

    policy_name: str
    policy_version: str | None = None
    rules: list[PolicyRule] = field(default_factory=list)