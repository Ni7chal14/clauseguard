export const policies = [
  { id: "pol-1", name: "Leave Policy", activeVersion: "v2.0", docType: "Leave Request", chunkCount: 14, lastUpdated: "Jul 15, 2026" },
  { id: "pol-2", name: "Medical Leave Policy", activeVersion: "v1.2", docType: "Sick Leave Request", chunkCount: 8, lastUpdated: "Jun 28, 2026" },
  { id: "pol-3", name: "Travel Policy", activeVersion: "v3.1", docType: "Expense Claim", chunkCount: 22, lastUpdated: "Aug 02, 2026" },
  { id: "pol-4", name: "Expense Policy", activeVersion: "v2.4", docType: "Expense Claim", chunkCount: 19, lastUpdated: "May 14, 2026" },
  { id: "pol-5", name: "Employee Handbook", activeVersion: "v4.0", docType: "General Guidelines", chunkCount: 45, lastUpdated: "Jan 10, 2026" }
];

export const reviewerSubmissions = [
  {
    id: "sub-101",
    docType: "Expense Claim",
    title: "Client Dinner Food Expenses",
    amount: "₹3,500",
    submittedBy: "Rahul",
    date: "Aug 10, 2026",
    status: "Flagged",
    reason: "Expense exceeds daily food allowance limit.",
    citation: "Travel Policy, Section 4.2",
    explanation: "Standard daily food allowance is limited to ₹2,000 per day. Your submission of ₹3,500 violates compliance benchmarks.",
    severity: "Medium",
    recommendedAction: "Resubmit with an adjusted amount of ₹2,000, or upload a signed manager surcharge waiver."
  },
  {
    id: "sub-102",
    docType: "Sick Leave Request",
    title: "Medical Sick Leave (3 Days)",
    amount: "3 Days",
    submittedBy: "Rahul",
    date: "Aug 08, 2026",
    status: "Needs Review",
    reason: "Missing medical certificate for continuous leave exceeding 2 days.",
    citation: "Medical Leave Policy, Section 3.2",
    explanation: "A medical certificate signed by a registered practitioner is required for medical leaves exceeding 2 continuous days.",
    severity: "High",
    recommendedAction: "Please upload your medical certificate to clear this validation hold.",
    workflowHistory: [
      { timestamp: "Aug 08, 2026 - 10:15 AM", message: "Sick leave requested by Rahul. Compliance system flagged: certificate required." }
    ]
  },
  {
    id: "sub-103",
    docType: "Expense Claim",
    title: "Local Travel Taxi fare",
    amount: "₹800",
    submittedBy: "Alex",
    date: "Aug 09, 2026",
    status: "Approved",
    reason: "Fully compliant.",
    citation: "Travel Policy, Section 2.1",
    explanation: "Local taxi fares under ₹1,500 are automatically approved if location logs match travel diary.",
    severity: "Low",
    recommendedAction: "No action required. Reimbursement processed."
  }
];

export const employeeChatPresets = [
  { q: "When is a medical certificate required?", a: "A medical certificate is required for medical/sick leave exceeding 2 continuous days. See Medical Leave Policy, Section 3.2." },
  { q: "What is the daily food allowance for business travel?", a: "The daily food allowance for business travel is limited to ₹2,000 per day. See Travel Policy, Section 4.2." },
  { q: "How many leaves do I have remaining?", a: "Your current remaining leave balance is 14 days (11 casual leaves and 3 sick leaves). See Leave Policy, Section 1.4." },
  { q: "Why was my food expense claim flagged?", a: "Your food expense claim of ₹3,500 was flagged because it exceeded the daily limit of ₹2,000 defined in Section 4.2 of the Travel Policy." }
];

export const hrChatPresets = [
  { q: "What is the company's international travel policy?", a: "For international travel, flights must be booked in economy class. Daily meals and incidentals are capped at $75 USD/day. Stays must use approved vendor list. See Travel Policy, Section 6.1." },
  { q: "What are the rules for medical leave?", a: "Medical leave offers up to 10 paid days annually. Leave exceeding 2 days requires doctor certification uploaded within 48 hours. See Medical Leave Policy, Section 3.2." },
  { q: "Which policy applies to high-value expenses?", a: "All expenses above ₹25,000 require vice-president authorization before upload and are subjected to pre-audit. See Expense Policy, Section 5.3." }
];

export const communityPosts = [
  {
    id: "post-1",
    author: "Neha Sharma",
    role: "Senior HR Specialist",
    content: "Hi everyone! Friendly reminder that the deadline to submit your tax declaration documents for Q2 is August 20. Please upload them in the Compliance Hub under Category: Tax Declarations.",
    likes: 12,
    comments: 3,
    category: "Announcements",
    time: "2 hours ago"
  },
  {
    id: "post-2",
    author: "Vikram Malhotra",
    role: "Engineering Manager",
    content: "Has anyone successfully updated their medical insurance dependents recently? The form page seems to keep loading. Do we upload it here or send it to the HR email directly?",
    likes: 4,
    comments: 5,
    category: "Q&A",
    time: "5 hours ago",
    commentList: [
      { author: "Neha Sharma", role: "HR", text: "Hi Vikram, please try clearing your browser cache. If it still fails, upload it to the Compliance Hub under Leave/Medical with a note." }
    ]
  }
];

export const performanceInsights = [
  { name: "Rahul", goalCompletion: "94%", projectContributions: "High", peerFeedback: "Positive", performanceTrend: "Strong", status: "Active Recommendation" },
  { name: "Alex", goalCompletion: "89%", projectContributions: "Stable", peerFeedback: "Excellent", performanceTrend: "Optimal", status: "Stable" },
  { name: "Priya", goalCompletion: "96%", projectContributions: "Exceptional", peerFeedback: "Outstanding", performanceTrend: "Very Strong", status: "Active Recommendation" }
];

export const auditLogs = [
  { id: "log-501", docType: "Expense Claim", employee: "Rahul", status: "Flagged", policy: "Travel Policy v3.1", chunks: "Section 4.2 (Food Caps)", timestamp: "Aug 10, 2026 - 04:12 PM" },
  { id: "log-502", docType: "Sick Leave", employee: "Rahul", status: "Needs Review", policy: "Medical Policy v1.2", chunks: "Section 3.2 (Certs)", timestamp: "Aug 08, 2026 - 10:15 AM" },
  { id: "log-503", docType: "Expense Claim", employee: "Alex", status: "Approved", policy: "Travel Policy v3.1", chunks: "Section 2.1 (Taxis)", timestamp: "Aug 09, 2026 - 11:32 AM" }
];
