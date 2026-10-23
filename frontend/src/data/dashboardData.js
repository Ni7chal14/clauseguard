export const user = {
  name: "Alex",
  role: "Senior Data Analyst",
  status: "optimal",
  leaveBalance: 14,
  expenseStatus: "Clear",
};

export const tasks = [
  {
    id: "medical-cert",
    icon: "medical_information",
    title: "Medical Certificate Required",
    description: "Please upload documentation for your recent sick leave (Oct 12-14).",
    actionLabel: "Upload Now",
  },
];

export const salaryTrend = {
  yoyChange: "+12.5% YOY",
  // 0-100 coordinate space matching the source design
  points: [
    { x: 0, y: 80 },
    { x: 25, y: 75 },
    { x: 50, y: 60 },
    { x: 75, y: 40 },
    { x: 100, y: 20 },
  ],
};

export const skills = [
  { label: "Technical", value: 92, color: "primary" },
  { label: "Soft Skills", value: 78, color: "secondary" },
  { label: "Compliance", value: 85, color: "tertiary" },
];

export const careerProfile = {
  tenure: "2 yrs 3 months",
  projectsContributed: 18,
  goalCompletionRate: 87,
  complianceRating: "Strong",
  submissionsProcessed: 42,
  submissionApprovalRate: 95,
  peerFeedbackRating: "4.7 / 5",
};

export const documentTrack = {
  referenceId: "EXP-2023-11",
  steps: [
    { label: "Submitted", detail: "Oct 24, 09:41 AM", status: "done" },
    { label: "Manager Review", detail: "In Progress (S. Connor)", status: "active" },
    { label: "Finance Processing", detail: "Pending Approval", status: "pending" },
  ],
};

export const folders = [
  { name: "Contracts", count: 12, color: "secondary" },
  { name: "Employment", count: 4, color: "primary" },
  { name: "Compliance", alert: true, color: "error" },
  { name: "Expenses", count: 28, color: "outline" },
];
