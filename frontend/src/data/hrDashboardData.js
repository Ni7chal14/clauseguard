export const admin = {
  name: "HR Administrator",
  department: "Global Operations",
  role: "Admin Role",
};

export const kpis = [
  {
    label: "Avg Time to Fill",
    value: "42",
    unit: "Days",
    icon: "schedule",
    iconColor: "text-secondary",
    trendIcon: "trending_down",
    trendText: "12% faster than Q3",
    trendColor: "primary",
  },
  {
    label: "Retention Rate",
    value: "91.4",
    unit: "%",
    icon: "loyalty",
    iconColor: "text-tertiary-fixed-dim",
    trendIcon: "trending_down",
    trendText: "-2.1% across Engineering",
    trendColor: "tertiary",
  },
];

export const retentionDiagnostics = {
  title: "Retention Diagnostics",
  message:
    "High risk of attrition identified in Engineering (L4). Correlated with consecutive sprint velocity spikes and delayed performance reviews.",
  highlight: "Engineering (L4)",
};

// growth / headcountTarget are 0-100 values representing bar height (% from bottom)
export const growthAttritionData = [
  { month: "Jan", growth: 40, headcountTarget: 60 },
  { month: "Feb", growth: 45, headcountTarget: 62 },
  { month: "Mar", growth: 42, headcountTarget: 70 },
  { month: "Apr", growth: 50, headcountTarget: 75, highlight: true },
  { month: "May", growth: 55, headcountTarget: 72 },
  { month: "Jun", growth: 60, headcountTarget: 78 },
  { month: "Jul", growth: 75, headcountTarget: 85 },
  { month: "Aug", growth: 72, headcountTarget: 88 },
];

export const skillMatrix = [
  { name: "Python / Data Eng", personnel: 124, icon: "code", status: "High Prof." },
  { name: "React / Frontend", personnel: 89, icon: "web", status: "High Prof." },
  { name: "Legal Tech / Compliance", personnel: 42, icon: "gavel", status: "Gap Risk" },
  { name: "Enterprise Sales", personnel: 156, icon: "trending_up", status: "Stable" },
];
