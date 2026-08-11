from app.extractors import extract_leave_days


test_documents = [
    "I would like to take 5 consecutive days of annual leave.",
    "I am requesting 3 days of leave.",
    "Please approve my 2 days of annual leave.",
    "I would like to request some leave next week.",
]

for document in test_documents:
    days = extract_leave_days(document)

    print(f"\nDocument: {document}")
    print(f"Extracted leave days: {days}")