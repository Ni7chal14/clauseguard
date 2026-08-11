from app.retriever import retrieve_chunks
from app.llm import create_llm
from app.extractors import extract_leave_days, extract_dates
from app.rules import evaluate_leave_policy

llm = create_llm()

def parse_review(response_text: str) -> dict:
    """Convert the LLM's structured text response into fields."""

    result = {
        "status": "NEEDS_REVIEW",
        "explanation": "",
        "severity": "UNKNOWN",
        "recommended_action": "",
    }

    for line in response_text.splitlines():
        line = line.strip()

        if line.startswith("STATUS:"):
            result["status"] = line.replace("STATUS:", "", 1).strip()

        elif line.startswith("EXPLANATION:"):
            result["explanation"] = line.replace(
                "EXPLANATION:", "", 1
            ).strip()

        elif line.startswith("SEVERITY:"):
            result["severity"] = line.replace(
                "SEVERITY:", "", 1
            ).strip()

        elif line.startswith("RECOMMENDED_ACTION:"):
            result["recommended_action"] = line.replace(
                "RECOMMENDED_ACTION:", "", 1
            ).strip()

    return result

def review_document(document_text: str) -> dict:
    """Review a submitted document against company policies."""

    policy_chunks = retrieve_chunks(document_text)

    if not policy_chunks:
        return {
            "status": "NEEDS_REVIEW",
            "explanation": "No sufficiently relevant policy information was found.",
            "severity": "UNKNOWN",
            "recommended_action": "Send the submission for manual review.",
            "sources": [],
        }

    leave_days = extract_leave_days(document_text)
    dates = extract_dates(document_text)

    if leave_days is None:
        return {
            "status": "NEEDS_REVIEW",
            "explanation": "The requested leave duration could not be determined from the submitted document.",
            "severity": "UNKNOWN",
            "recommended_action": "Send the request for manual review.",
            "sources": [
                {
                    "source": chunk["source"],
                    "score": chunk["score"],
                }
                for chunk in policy_chunks
            ],
        }

    rule_result = evaluate_leave_policy(
        leave_days=leave_days,
        submission_date=dates["submission_date"],
        leave_start_date=dates["leave_start_date"],
    )

    policy_context = "\n\n".join(
        f"Source: {chunk['source']}\n{chunk['text']}"
        for chunk in policy_chunks
    )

    prompt = f"""
You are ClauseGuard, an AI HR and compliance assistant.

Your job is to explain a policy decision that has already been determined
by the ClauseGuard rule engine.

IMPORTANT:
- Do NOT change the decision.
- Do NOT override the rule engine.
- Do NOT invent policy rules.
- Do NOT evaluate policy requirements that the rule engine has not evaluated.
- Do NOT claim that a requirement was satisfied or violated unless the rule engine explicitly determined that.
- Use the rule engine result as the authoritative compliance decision.
- If information needed to evaluate another policy requirement is missing, explicitly say that it could not be evaluated.
- Explain only the facts supported by the submitted document and rule engine result.
- Keep the explanation concise and professional.
- Do not describe a policy requirement as a "maximum allowed" or "prohibition" unless the policy explicitly uses that language.
- When a policy says that exceeding a threshold "requires approval", describe it as an approval requirement, not as a maximum limit.

Return your response in EXACTLY this format:

STATUS: {rule_result["status"]}
EXPLANATION: <brief explanation of why this decision was made>
SEVERITY: {rule_result["severity"]}
RECOMMENDED_ACTION: {rule_result["recommended_action"]}

POLICY CONTEXT:
{policy_context}

SUBMITTED DOCUMENT:
{document_text}

RULE ENGINE RESULT:
Status: {rule_result["status"]}
Reasons:
{chr(10).join(f"- {reason}" for reason in rule_result["reasons"])}
Severity: {rule_result["severity"]}
Recommended Action: {rule_result["recommended_action"]}

Only discuss the policy condition represented by the rule engine result.
Do not independently infer violations of other policy requirements.

REVIEW:
"""

    response = llm.invoke(prompt)

    parsed_review = parse_review(response.content)

    return {
        "status": parsed_review["status"],
        "explanation": parsed_review["explanation"],
        "severity": parsed_review["severity"],
        "recommended_action": parsed_review["recommended_action"],
        "sources": [
            {
                "source": chunk["source"],
                "score": chunk["score"],
            }
            for chunk in policy_chunks
        ],
    }