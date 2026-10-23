from ai.app.llm import create_llm


llm = create_llm()


def generate_review_explanation(
    status: str,
    severity: str,
    reasons: list[str],
    recommended_action: str,
    policy_name: str,
    policy_version: str,
    policy_evidence: list[dict],
) -> str:
    """
    Generate a human-readable explanation for an already-determined
    compliance review.

    The deterministic rule engine remains authoritative.
    The LLM is only responsible for explaining the result.
    """

    evidence_text = "\n\n".join(
        (
            f"Source: {item.get('section', 'Unknown source')}\n"
            f"Policy text: {item.get('citation_text', '')}"
        )
        for item in policy_evidence
    )

    reasons_text = "\n".join(
        f"- {reason}"
        for reason in reasons
    )

    prompt = f"""
You are ClauseGuard, an AI HR compliance assistant.

The deterministic ClauseGuard rule engine has already evaluated
the employee's request.

Your ONLY job is to explain the existing result clearly and
professionally.

IMPORTANT RULES:

- Do NOT change the status.
- Do NOT change the severity.
- Do NOT create new compliance rules.
- Do NOT invent policy requirements.
- Do NOT perform your own calculations.
- Do NOT override the rule engine.
- Do NOT claim a requirement was satisfied or violated unless
  it appears in the provided rule-engine reasons.
- Use the policy evidence only as supporting context.
- The rule-engine result is authoritative.
- Keep the explanation concise.

POLICY:
{policy_name}

POLICY VERSION:
{policy_version}

RULE ENGINE STATUS:
{status}

RULE ENGINE SEVERITY:
{severity}

RULE ENGINE REASONS:
{reasons_text}

RECOMMENDED ACTION:
{recommended_action}

POLICY EVIDENCE:
{evidence_text}

Return ONLY a concise professional explanation of the result.
Do not include headings such as "EXPLANATION:".
"""

    response = llm.invoke(prompt)

    return response.content.strip()