from app.rules import evaluate_leave_request


test_cases = [3, 5, 2]

for days in test_cases:
    result = evaluate_leave_request(days)

    print(f"\nLeave days: {days}")
    print(f"Status: {result['status']}")
    print(f"Reason: {result['reason']}")
    print(f"Severity: {result['severity']}")
    print(f"Action: {result['recommended_action']}")