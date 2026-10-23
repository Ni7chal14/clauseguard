import re

from datetime import datetime


def extract_leave_type(document_text: str) -> str | None:
    """
    Extract the leave type from a leave request.

    Example:
        Leave Type: Annual Leave
        Leave Type: Emergency Leave
    """

    patterns = [
        r"leave\s+type\s*:\s*([A-Za-z][A-Za-z\s-]*)",
        r"type\s+of\s+leave\s*:\s*([A-Za-z][A-Za-z\s-]*)",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            document_text,
            re.IGNORECASE,
        )

        if match:
            return match.group(1).strip().upper()

    return None


def extract_leave_days(document_text: str) -> int | None:
    """Extract the requested number of leave days from a document."""

    patterns = [
        r"(\d+)\s+consecutive\s+days",
        r"(\d+)\s+days\s+of\s+(?:annual\s+)?leave",
        r"(\d+)\s+days\s+leave",
    ]

    for pattern in patterns:
        match = re.search(
            pattern,
            document_text,
            re.IGNORECASE,
        )

        if match:
            return int(match.group(1))

    return None


def extract_dates(document_text: str) -> dict:
    """
    Extract submission date and leave start date from a document.
    """

    result = {
        "submission_date": None,
        "leave_start_date": None,
    }

    submission_patterns = [
        r"(?:submitted|submission date|request submitted)\s*(?:on|:)?\s*"
        r"([A-Za-z]+\s+\d{1,2}(?:,\s*\d{4})?)",
    ]

    leave_patterns = [
        r"(?:leave\s+start\s+date|from|starting|start\s+date)\s*:?\s*"
        r"([A-Za-z]+\s+\d{1,2}(?:,\s*\d{4})?)",
    ]

    for pattern in submission_patterns:
        match = re.search(
            pattern,
            document_text,
            re.IGNORECASE,
        )

        if match:
            result["submission_date"] = _parse_date(
                match.group(1)
            )
            break

    for pattern in leave_patterns:
        match = re.search(
            pattern,
            document_text,
            re.IGNORECASE,
        )

        if match:
            result["leave_start_date"] = _parse_date(
                match.group(1)
            )
            break

    return result


def _parse_date(date_text: str):
    """Convert extracted date text into a date object."""

    formats = [
        "%B %d, %Y",
        "%B %d %Y",
        "%B %d",
    ]

    for fmt in formats:
        try:
            return datetime.strptime(
                date_text,
                fmt,
            ).date()

        except ValueError:
            continue

    return None