from .retriever import retrieve_chunks
from .llm import create_llm
from .extractors import (
    extract_leave_days,
    extract_dates,
    extract_leave_type,
)
from .rules import evaluate_leave_policy
from .policy_repository import (
    get_active_policy_id,
    get_policy_rules,
)


llm = create_llm()


def parse_review(response_text: str) -> dict:
    """Extract the explanation and recommended action from the LLM response."""

    result = {
        "explanation": "",
        "recommended_action": "",
    }

    for line in response_text.splitlines():
        line = line.strip()

        if line.startswith("EXPLANATION:"):
            result["explanation"] = line.replace(
                "EXPLANATION:",
                "",
                1,
            ).strip()

        elif line.startswith("RECOMMENDED_ACTION:"):
            result["recommended_action"] = line.replace(
                "RECOMMENDED_ACTION:",
                "",
                1,
            ).strip()

    return result


def review_document(
    document_text: str,
    organization_id: int,
) -> dict:
    """
    Review a submitted document against the organization's
    currently active policy.

    The deterministic rule engine is authoritative for
    status and severity.

    The LLM is used only to explain the already-determined result.
    """

    # ---------------------------------------------------------
    # 1. Find the organization's active policy
    # ---------------------------------------------------------

    policy_id = get_active_policy_id(
        organization_id
    )

    if policy_id is None:
        return {
            "status": "NEEDS_REVIEW",
            "explanation": (
                "No active policy was found for the current organization."
            ),
            "severity": "UNKNOWN",
            "recommended_action": (
                "Upload or activate an organization policy before "
                "reviewing submissions."
            ),
            "sources": [],
        }

    # ---------------------------------------------------------
    # 2. Load rules belonging to the active policy
    # ---------------------------------------------------------

    policy_rules = get_policy_rules(
        policy_id
    )

    if not policy_rules:
        return {
            "status": "NEEDS_REVIEW",
            "explanation": (
                "The active organization policy does not contain "
                "any extracted rules."
            ),
            "severity": "UNKNOWN",
            "recommended_action": (
                "Review or reprocess the active organization policy."
            ),
            "sources": [],
        }

    # ---------------------------------------------------------
    # 3. Retrieve policy context ONLY from the active policy
    # ---------------------------------------------------------

    policy_chunks = retrieve_chunks(
        query=document_text,
        policy_id=policy_id,
    )

    if not policy_chunks:
        return {
            "status": "NEEDS_REVIEW",
            "explanation": (
                "No sufficiently relevant policy information "
                "was found for the active policy."
            ),
            "severity": "UNKNOWN",
            "recommended_action": (
                "Send the submission for manual review."
            ),
            "sources": [],
        }

    # ---------------------------------------------------------
    # 4. Extract submission information
    # ---------------------------------------------------------

    leave_days = extract_leave_days(
        document_text
    )

    leave_type = extract_leave_type(
        document_text
    )

    dates = extract_dates(
        document_text
    )

    if leave_days is None:
        return {
            "status": "NEEDS_REVIEW",
            "explanation": (
                "The requested leave duration could not be "
                "determined from the submitted document."
            ),
            "severity": "UNKNOWN",
            "recommended_action": (
                "Send the request for manual review."
            ),
            "sources": [
                {
                    "source": chunk["source"],
                    "score": chunk["score"],
                }
                for chunk in policy_chunks
            ],
        }

    if leave_type is None:
        return {
            "status": "NEEDS_REVIEW",
            "explanation": (
                "The leave type could not be determined from "
                "the submitted document."
            ),
            "severity": "UNKNOWN",
            "recommended_action": (
                "Send the request for manual review."
            ),
            "sources": [
                {
                    "source": chunk["source"],
                    "score": chunk["score"],
                }
                for chunk in policy_chunks
            ],
        }

    # ---------------------------------------------------------
    # 5. Evaluate using the active policy rules
    # ---------------------------------------------------------

    rule_result = evaluate_leave_policy(
        leave_days=leave_days,
        leave_type=leave_type,
        submission_date=dates["submission_date"],
        leave_start_date=dates["leave_start_date"],
        policy_rules=policy_rules,
    )

    # ---------------------------------------------------------
    # 6. Build policy context for the LLM
    # ---------------------------------------------------------

    policy_context = "\n\n".join(
        f"Source: {chunk['source']}\n{chunk['text']}"
        for chunk in policy_chunks
    )

    # ---------------------------------------------------------
    # 7. Ask LLM ONLY to explain deterministic decision
    # ---------------------------------------------------------

    prompt = f"""
You are ClauseGuard, an AI HR and compliance assistant.

The ClauseGuard rule engine has already made the compliance decision.

Your ONLY job is to explain that decision clearly and professionally.

IMPORTANT:

- Do NOT change the decision.
- Do NOT create your own compliance decision.
- Do NOT calculate working days yourself.
- Do NOT recalculate dates.
- Do NOT override the rule engine.
- Do NOT invent policy requirements.
- Do NOT evaluate policy requirements that the rule engine has not evaluated.
- Do NOT claim that a requirement was satisfied or violated unless
  the rule engine explicitly determined that.
- Treat the RULE ENGINE RESULT below as authoritative.
- Explain only the reasons explicitly provided by the rule engine.
- Keep the explanation concise and professional.

The authoritative rule-engine result is:

STATUS:

{rule_result["status"]}

SEVERITY:

{rule_result["severity"]}

REASONS:

{chr(10).join(f"- {reason}" for reason in rule_result["reasons"])}

RECOMMENDED ACTION:

{rule_result["recommended_action"]}

POLICY CONTEXT:

{policy_context}

SUBMITTED DOCUMENT:

{document_text}

Return EXACTLY this format:

EXPLANATION: <brief explanation based ONLY on the rule-engine reasons>

RECOMMENDED_ACTION: {rule_result["recommended_action"]}
"""

    response = llm.invoke(
        prompt
    )

    parsed_review = parse_review(
        response.content
    )

    # ---------------------------------------------------------
    # 8. Rule engine remains authoritative
    # ---------------------------------------------------------

    return {
        "status": rule_result["status"],
        "explanation": parsed_review["explanation"],
        "severity": rule_result["severity"],
        "recommended_action": rule_result["recommended_action"],
        "sources": [
            {
                "source": chunk["source"],
                "score": chunk["score"],
            }
            for chunk in policy_chunks
        ],
    }