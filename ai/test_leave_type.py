from app.loaders import load_document
from app.extractors import extract_leave_type


annual_text = load_document(
    "test_data/test_leave_request.txt"
)

emergency_text = """
EMPLOYEE LEAVE REQUEST

Employee: Test Employee

Submission Date: August 17, 2026

Leave Type: Emergency Leave

Leave Duration: 2 consecutive days

Leave Start Date: August 18, 2026

Reason: Emergency personal matter.
"""


print(
    "Annual Leave:",
    extract_leave_type(annual_text),
)

print(
    "Emergency Leave:",
    extract_leave_type(emergency_text),
)