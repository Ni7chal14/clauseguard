import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpecularButton from "../components/ui/SpecularButton";
import LineSidebar from "../components/ui/LineSidebar";
import ReflectiveCard from "../components/ui/ReflectiveCard";
import HRTopBar from "../components/hr/HRTopBar";
import HRSidebar from "../components/hr/HRSidebar";
import HRHeader from "../components/hr/HRHeader";
import KpiCard from "../components/hr/KpiCard";
import HRMobileNav from "../components/hr/HRMobileNav";

// Import custom components from core
import EnterpriseSkillMatrix from "../components/hr/EnterpriseSkillMatrix";
import RetentionDiagnostics from "../components/hr/RetentionDiagnostics";
import { hrChatPresets } from "../data/clauseguardData";

const mockPolicies = [
  { id: 1, name: "Employee Handbook", docType: "General Guidelines", chunkCount: 42, lastUpdated: "Aug 12, 2026", activeVersion: "v4.0" },
  { id: 2, name: "Code of Conduct", docType: "General Guidelines", chunkCount: 26, lastUpdated: "Jul 20, 2026", activeVersion: "v2.7" },
  { id: 3, name: "Medical Leave Guidelines", docType: "Sick Leave Request", chunkCount: 18, lastUpdated: "Jun 28, 2026", activeVersion: "v3.1" },
  { id: 4, name: "Travel Allowance Rules", docType: "Expense Claim", chunkCount: 31, lastUpdated: "Aug 02, 2026", activeVersion: "v1.9" },
  { id: 5, name: "Enterprise Expense Limits", docType: "Expense Claim", chunkCount: 23, lastUpdated: "May 14, 2026", activeVersion: "v2.2" },
  { id: 6, name: "NDA Template", docType: "General Guidelines", chunkCount: 15, lastUpdated: "Mar 14, 2026", activeVersion: "v2.1" },
  { id: 7, name: "Master Service Agreement", docType: "General Guidelines", chunkCount: 39, lastUpdated: "Feb 22, 2026", activeVersion: "v5.0" }
];

const mockInitialSubmissions = [
  {
    id: 201,
    docType: "Expense Claim",
    title: "Client Travel Reimbursement",
    amount: "₹4,800",
    date: "Aug 18, 2026",
    status: "Approved",
    severity: "Low",
    citation: "Travel_Allowance_Rules_Q3.pdf",
    explanation: "The submitted travel reimbursement matches the capped rates for domestic airfare and hotel stay.",
    recommendedAction: "No further action required.",
    submittedByName: "Alex Martin",
    workflowHistory: JSON.stringify([
      { timestamp: "Aug 18, 2026 09:12 AM", message: "AI engine checked Travel_Allowance_Rules_Q3 against submitted receipt totals." },
      { timestamp: "Aug 18, 2026 09:14 AM", message: "Claim matched policy caps; approval recommended." }
    ])
  },
  {
    id: 202,
    docType: "Sick Leave Request",
    title: "Medical Leave for 3 Days",
    amount: "3 Days",
    date: "Aug 10, 2026",
    status: "Needs Review",
    severity: "Medium",
    citation: "Medical_Leave_Guidelines_2026.pdf",
    explanation: "The leave duration exceeds the standard self-attested threshold, so the policy requires supporting medical documentation.",
    recommendedAction: "Upload physician certificate and resubmit for final review.",
    submittedByName: "Priya Nair",
    workflowHistory: JSON.stringify([
      { timestamp: "Aug 10, 2026 03:40 PM", message: "Leave request submitted with 3-day duration." },
      { timestamp: "Aug 10, 2026 04:00 PM", message: "Medical leave policy triggered document verification because duration exceeded the two-day automatic approval window." }
    ])
  },
  {
    id: 203,
    docType: "Expense Claim",
    title: "Team Lunch & Client Dinner",
    amount: "₹2,250",
    date: "Jul 29, 2026",
    status: "Flagged",
    severity: "High",
    citation: "Enterprise_Expense_Limits.pdf",
    explanation: "The claim includes a client dinner expense above the standard per-person cap and exceeds the manager approval threshold.",
    recommendedAction: "Reduce the claim to the approved cap or attach a valid manager exception.",
    submittedByName: "Rohit Sen",
    workflowHistory: JSON.stringify([
      { timestamp: "Jul 29, 2026 09:18 AM", message: "Expense upload matched the dining category totals." },
      { timestamp: "Jul 29, 2026 09:22 AM", message: "Policy check flagged overspend relative to Enterprise_Expense_Limits approval thresholds." }
    ])
  },
  {
    id: 204,
    docType: "Casual Leave Request",
    title: "Family Event Leave",
    amount: "2 Days",
    date: "Jul 02, 2026",
    status: "Approved",
    severity: "Low",
    citation: "Employee_Handbook_v4.0.pdf",
    explanation: "The request falls within the allowed casual leave entitlement and does not exceed the annual allocation.",
    recommendedAction: "Approved under standard annual casual leave limits.",
    submittedByName: "Nisha Patel",
    workflowHistory: JSON.stringify([
      { timestamp: "Jul 02, 2026 08:50 AM", message: "Casual leave submitted during a normal leave window." },
      { timestamp: "Jul 02, 2026 09:05 AM", message: "Employee_Handbook_v4.0 supported the approved leave allocation." }
    ])
  },
  {
    id: 205,
    docType: "Expense Claim",
    title: "Conference Travel Accommodation",
    amount: "₹8,950",
    date: "Jun 21, 2026",
    status: "Flagged",
    severity: "Medium",
    citation: "Travel_Allowance_Rules_Q3.pdf",
    explanation: "The accommodation costs exceed the allowed cap for a local conference trip unless stronger justification is provided.",
    recommendedAction: "Clarify the event purpose and provide vendor invoice details or reduce to approved cap.",
    submittedByName: "Karan Mehta",
    workflowHistory: JSON.stringify([
      { timestamp: "Jun 21, 2026 10:55 AM", message: "Travel claim entered for conference-related accommodation." },
      { timestamp: "Jun 21, 2026 11:08 AM", message: "Travel_Allowance_Rules_Q3 flagged lodging above the standard allowance for a short local event." }
    ])
  },
  {
    id: 206,
    docType: "Expense Claim",
    title: "Software Licensing Invoice",
    amount: "₹1,600",
    date: "May 14, 2026",
    status: "Approved",
    severity: "Low",
    citation: "Master_Service_Agreement.pdf",
    explanation: "The invoice aligns with the approved software procurement workflow and falls within the pre-approved vendor services scope.",
    recommendedAction: "Approved and logged as a valid operating expense.",
    submittedByName: "Sonia Khanna",
    workflowHistory: JSON.stringify([
      { timestamp: "May 14, 2026 02:10 PM", message: "Software expense claims matched approved line items in the master services agreement." },
      { timestamp: "May 14, 2026 02:16 PM", message: "Approval granted after vendor review passed." }
    ])
  }
];

const mockEmployees = [
  { name: "Rahul", role: "Senior Engineer", goalCompletion: "94%", peerFeedback: "4.9/5", complianceRecord: "Strong", status: "Employee of the Month" },
  { name: "Alex", role: "Product Manager", goalCompletion: "90%", peerFeedback: "4.8/5", complianceRecord: "Strong", status: "Active" },
  { name: "Sophie", role: "Lead Designer", goalCompletion: "88%", peerFeedback: "4.7/5", complianceRecord: "Strong", status: "Active" },
  { name: "Manoj", role: "Finance Analyst", goalCompletion: "86%", peerFeedback: "4.5/5", complianceRecord: "Above Average", status: "Active" },
  { name: "Aisha", role: "HR Partner", goalCompletion: "92%", peerFeedback: "4.9/5", complianceRecord: "Strong", status: "Active" }
];

export default function HRDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedPolicyIdx, setSelectedPolicyIdx] = useState(0);

  // Retrieve user session info
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : { username: "HR Admin", role: "HR", title: "HR Administrator", department: "Global Operations" };
  });

  const admin = {
    name: currentUser.username,
    role: currentUser.title || currentUser.role,
    department: currentUser.department
  };

  // Policy Management State
  const [policies, setPolicies] = useState(mockPolicies);
  const [newPolicyName, setNewPolicyName] = useState("");
  const [newPolicyDocType, setNewPolicyDocType] = useState("Expense Claim");
  const [isUploadingPolicy, setIsUploadingPolicy] = useState(false);
  const [policyFile, setPolicyFile] = useState(null);

  // RAG Chat State
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "Welcome Admin. I am your HR compliance RAG intelligence model. Ask me broad questions regarding company rules, travel accommodations, or policy audits. Grounded in uploaded files.", citation: "" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Performance & Recognition State
  const [employees, setEmployees] = useState([]);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(null);
  const [recognitionApproved, setRecognitionApproved] = useState(true);

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState([]);

  // Submissions & Queue State
  const [submissions, setSubmissions] = useState([]);

  const totalRequests = submissions.length;

  const approvedRequests = submissions.filter(
    (s) => s.status === "Approved"
  ).length;

  const needsReviewRequests = submissions.filter(
    (s) => s.status === "Needs Review" || s.status === "NEEDS_REVIEW"
  ).length;

  const rejectedRequests = submissions.filter(
    (s) => s.status === "Rejected" || s.status === "REJECTED"
  ).length;

  const resolvedRequests = approvedRequests + rejectedRequests;

  const approvalRate =
    totalRequests > 0
      ? ((approvedRequests / totalRequests) * 100).toFixed(1)
      : "0.0";

  const resolutionRate =
    totalRequests > 0
      ? ((resolvedRequests / totalRequests) * 100).toFixed(1)
      : "0.0";

  const analyticsKpis = [
    {
      label: "Total Requests",
      value: totalRequests,
      unit: "",
      icon: "description",
      iconColor: "text-secondary",
      trendIcon: "analytics",
      trendText: `${needsReviewRequests} need review`,
      trendColor: "secondary",
    },
    {
      label: "Approval Rate",
      value: approvalRate,
      unit: "%",
      icon: "check_circle",
      iconColor: "text-primary",
      trendIcon: "trending_up",
      trendText: `${approvedRequests} approved`,
      trendColor: "primary",
    },
    {
      label: "Needs Review",
      value: needsReviewRequests,
      unit: "",
      icon: "pending_actions",
      iconColor: "text-tertiary-fixed-dim",
      trendIcon: "priority_high",
      trendText: `${rejectedRequests} rejected`,
      trendColor: "tertiary",
    },
    {
      label: "Resolution Rate",
      value: resolutionRate,
      unit: "%",
      icon: "task_alt",
      iconColor: "text-secondary",
      trendIcon: "done_all",
      trendText: `${resolvedRequests} resolved`,
      trendColor: "secondary",
    },
  ];

  const weeklyReviewCounts = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));

    const dateKey = date.toISOString().split("T")[0];

    return {
      label: date.toLocaleDateString("en-US", {
        weekday: "short",
      }),
      count: submissions.filter((submission) => {
        if (!submission.date) return false;

        const submissionDate = new Date(submission.date);

        if (isNaN(submissionDate.getTime())) return false;

        submissionDate.setHours(0, 0, 0, 0);

        return (
          submissionDate.toISOString().split("T")[0] === dateKey
        );
      }).length,
    };
  });
  console.log("WEEKLY REVIEW COUNTS:", weeklyReviewCounts);
  const complianceOutcomeCounts = [
    {
      label: "Approved",
      count: submissions.filter(
        (s) => s.status === "Approved" || s.status === "APPROVED"
      ).length,
    },
    {
      label: "Needs Review",
      count: submissions.filter(
        (s) => s.status === "Needs Review" || s.status === "NEEDS_REVIEW"
      ).length,
    },
    {
      label: "Rejected",
      count: submissions.filter(
        (s) => s.status === "Rejected" || s.status === "REJECTED"
      ).length,
    },
    {
      label: "Pending",
      count: submissions.filter(
        (s) => s.status === "Pending" || s.status === "PENDING"
      ).length,
    },
  ];

  const [selectedSub, setSelectedSub] = useState(null);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [isActioningWorkflow, setIsActioningWorkflow] = useState(false);

  // SaaS ROI Calculator State
  const [seats, setSeats] = useState(10);
  const [claimsPerDay, setClaimsPerDay] = useState(15);
  const [minutesPerClaim, setMinutesPerClaim] = useState(10);
  const [loadedCost, setLoadedCost] = useState(800);

  // Security & Privacy State
  const [piiRedaction, setPiiRedaction] = useState(true);
  const [settingsTab, setSettingsTab] = useState("pipeline");

  // Load data on mount
  useEffect(() => {
    const fetchPolicies = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/organizations/1/policies"
        );

        if (!res.ok) {
          throw new Error("Failed to load policies.");
        }

        const data = await res.json();

        setPolicies(data.policies || []);
      } catch (err) {
        console.error("Error loading policies:", err);
        setPolicies([]);
      }
    };

    const fetchEmployees = async () => {
      const res = await fetch(
        "http://127.0.0.1:8000/api/organizations/1/employees",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    };

    const fetchSubmissions = async () => {
      setIsLoadingSubmissions(true);

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/reviews?organization_id=1",
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (res.ok) {
          const data = await res.json();
          console.log("SUBMISSIONS FROM API:", data);

          const formattedSubmissions = data.map((item) => ({
            id: item.id,
            docType: item.document_type,
            title: item.submission_data?.leave_type || "Leave Request",
            amount: `${item.submission_data?.leave_days || 0} Days`,
            date: item.submission_data?.submission_date || "",
            status:
              item.status === "APPROVED"
                ? "Approved"
                : item.status === "REJECTED"
                  ? "Rejected"
                  : item.status === "NEEDS_REVIEW"
                    ? "Needs Review"
                    : item.status,
            severity:
              item.severity === "HIGH"
                ? "High"
                : item.severity === "MEDIUM"
                  ? "Medium"
                  : "Low",
            explanation: item.explanation || "",
            recommendedAction: item.recommended_action || "",
            citation: item.citations?.[0]?.section || "",
            description: item.submission_data?.description || "",
            fileUrl: item.file_url || "",
            employeeId: item.employee_id,
            submittedByName: `Employee ${item.employee_id}`,
            workflowHistory: [],
          }));

          setSubmissions(formattedSubmissions);

          if (formattedSubmissions.length > 0) {
            setSelectedSub(formattedSubmissions[0]);
          } else {
            setSelectedSub(null);
          }
        }
      } catch (err) {
        console.error("Error loading submissions:", err);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    fetchPolicies();
    fetchEmployees();
    fetchSubmissions();
  }, []);

  // Calculate SaaS ROI Metrics
  const monthlySaaS = seats * 1500;
  const annualSaaS = monthlySaaS * 12;
  const manualReviewValue = Math.round((claimsPerDay * seats * (minutesPerClaim / 60) * loadedCost) * 250);
  const economicValueRecovered = Math.round(manualReviewValue * 0.8);
  const netSavedValue = Math.max(0, economicValueRecovered - annualSaaS);

  const handleExport = () => {
    alert("Exporting analytics dossier: CSV report generated and downloaded.");
  };

  const handleTakeAction = () => {
    setActiveTab("records");
  };

  const handleViewFullMatrix = () => {
    alert("Full Enterprise Skill Matrix detail logs: Python/Data (124), React (89), Compliance (42), Sales (156). Status: Optimal.");
  };

  // Upload Policy Simulation
  const handleUploadPolicy = async (e) => {
    e.preventDefault();

    if (!newPolicyName.trim()) {
      alert("Please enter a policy name.");
      return;
    }

    if (!policyFile) {
      alert("Please select a policy document.");
      return;
    }

    setIsUploadingPolicy(true);

    try {
      const formData = new FormData();

      formData.append("file", policyFile);

      const params = new URLSearchParams({
        uploaded_by: "2",
        name: newPolicyName,
      });

      const res = await fetch(
        `http://127.0.0.1:8000/api/organizations/1/policies?${params.toString()}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Policy upload failed."
        );
      }

      const result = await res.json();

      console.log("Policy uploaded successfully:", result);

      alert("Policy uploaded successfully.");

      setNewPolicyName("");
      setPolicyFile(null);

      // Refresh the HR policy list if it exists.
      const policiesRes = await fetch(
        "http://127.0.0.1:8000/api/organizations/1/policies"
      );

      if (policiesRes.ok) {
        const data = await policiesRes.json();
        setPolicies(data.policies || []);
      }

    } catch (err) {
      console.error("Upload policy error:", err);
      alert(err.message);
    } finally {
      setIsUploadingPolicy(false);
    }
  };

  const handlePolicyStatusChange = async (policyId, action) => {
    try {
      const endpoint =
        action === "archive" ? "archive" : "activate";

      const res = await fetch(
        `http://127.0.0.1:8000/api/organizations/1/policies/${policyId}/${endpoint}`,
        {
          method: "PATCH",
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);

        throw new Error(
          errorData?.detail ||
          `Failed to ${action} policy.`
        );
      }

      const result = await res.json();

      console.log(result);

      // Refresh policies from backend
      const policiesRes = await fetch(
        "http://127.0.0.1:8000/api/organizations/1/policies"
      );

      if (policiesRes.ok) {
        const data = await policiesRes.json();
        setPolicies(data.policies || []);

        // Reset selection safely
        setSelectedPolicyIdx(0);
      }

      alert(
        action === "archive"
          ? "Policy archived successfully."
          : "Policy activated successfully."
      );

    } catch (err) {
      console.error(`Policy ${action} error:`, err);
      alert(err.message);
    }
  };

  // Chat RAG Handler
  const handleSendMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const queryText = customText || chatInput;
    if (!queryText.trim()) return;

    setChatHistory(prev => [...prev, { sender: "user", text: queryText }]);
    if (!customText) setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ message: queryText })
      });

      if (res.ok) {
        const data = await res.json();
        setChatHistory(prev => [...prev, { sender: "ai", text: data.text, citation: data.citation }]);
      } else {
        throw new Error("Chat failed.");
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { sender: "ai", text: "Sorry, RAG audit assistant could not be reached.", citation: "Service Offline" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleApproveRecommendation = async (empName) => {
    try {
      const res = await fetch("http://localhost:5000/api/performance/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ name: empName })
      });

      if (res.ok) {
        setEmployees(prev => prev.map(emp => emp.name === empName ? { ...emp, status: "Employee of the Month" } : { ...emp, status: "Active" }));
        setEmployeeOfMonth(empName);
        setRecognitionApproved(true);
        alert(`Recommendation for ${empName} approved successfully.`);
      } else {
        setEmployees(prev => prev.map(emp => emp.name === empName ? { ...emp, status: "Employee of the Month" } : { ...emp, status: "Active" }));
        setEmployeeOfMonth(empName);
        setRecognitionApproved(true);
      }
    } catch (err) {
      console.error("Approve recommendation error:", err);
      setEmployees(prev => prev.map(emp => emp.name === empName ? { ...emp, status: "Employee of the Month" } : { ...emp, status: "Active" }));
      setEmployeeOfMonth(empName);
      setRecognitionApproved(true);
    }
  };

  const handleTriggerReview = async (subId) => {
    setIsActioningWorkflow(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/reviews/submissions/${subId}/decision?decision=REVIEW`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || "Review action failed.");
      }

      const result = await res.json();

      setSubmissions(prev =>
        prev.map(s =>
          s.id === subId
            ? {
              ...s,
              status: "Needs Review"
            }
            : s
        )
      );

      setSelectedSub(prev =>
        prev && prev.id === subId
          ? {
            ...prev,
            status: "Needs Review"
          }
          : prev
      );

    } catch (err) {
      console.error("Review action error:", err);
    } finally {
      setIsActioningWorkflow(false);
    }
  };

  const handleApproveManually = async (subId) => {
    setIsActioningWorkflow(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/reviews/submissions/${subId}/decision?decision=APPROVED`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || "Approval action failed.");
      }

      const result = await res.json();

      setSubmissions(prev =>
        prev.map(s =>
          s.id === subId
            ? {
              ...s,
              status: "Approved"
            }
            : s
        )
      );

      setSelectedSub(prev =>
        prev && prev.id === subId
          ? {
            ...prev,
            status: "Approved"
          }
          : prev
      );

    } catch (err) {
      console.error("Approval action error:", err);
    } finally {
      setIsActioningWorkflow(false);
    }
  };

  const handleRejectManually = async (subId) => {
    setIsActioningWorkflow(true);

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/reviews/submissions/${subId}/decision?decision=REJECTED`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Rejection action failed."
        );
      }

      const result = await res.json();

      setSubmissions(prev =>
        prev.map(s =>
          s.id === subId
            ? {
              ...s,
              status: "Rejected"
            }
            : s
        )
      );

      setSelectedSub(prev =>
        prev && prev.id === subId
          ? {
            ...prev,
            status: "Rejected"
          }
          : prev
      );

    } catch (err) {
      console.error("Reject action error:", err);
    } finally {
      setIsActioningWorkflow(false);
    }
  };


  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary-container">
      <div className="flex flex-1 overflow-hidden">
        <HRSidebar admin={admin} activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 w-full md:pl-[280px] pb-4">
          <div className="max-w-[1200px] mx-auto space-y-stack-md pt-6">
            <HRTopBar />

            {/* TAB 1: Dashboard (Folder 4 Layout - HR Command Center) */}
            {activeTab === "dashboard" && (
              <>
                <HRHeader onExport={handleExport} />

                {/* Row 1 - Action Required & Compliance Health */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-6">

                  {/* Action Required */}
                  <section className="lg:col-span-8 glass-panel rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden shadow-ambient">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-error/5 rounded-full blur-[60px] pointer-events-none"></div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                          <h2 className="font-headline-md text-xl text-white font-bold">Action Required</h2>
                        </div>
                        <p className="font-body-md text-on-surface-variant max-w-xl text-sm leading-relaxed font-semibold">
                          3 employee records are missing critical compliance documentation. AI monitoring indicates potential risk in Q3 Onboarding flow.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-outline-variant/35">
                        <div className="flex -space-x-2">
                          <div className="w-9 h-9 rounded-full border-2 border-[#091426] bg-[#1a2536] overflow-hidden flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-primary text-lg">person</span>
                          </div>
                          <div className="w-9 h-9 rounded-full border-2 border-[#091426] bg-[#1a2536] overflow-hidden flex items-center justify-center shadow-sm">
                            <span className="material-symbols-outlined text-secondary text-lg">person</span>
                          </div>
                          <div className="w-9 h-9 rounded-full border-2 border-[#091426] bg-[#1d2d3a] flex items-center justify-center font-bold text-[11px] text-primary shadow-sm">
                            +1
                          </div>
                        </div>
                        <SpecularButton
                          onClick={() => setActiveTab("queue")}
                          className="w-full sm:w-auto py-2.5 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
                          baseColor="#10b981"
                          textColor="#091426"
                          tint="#10b981"
                          tintOpacity={1.0}
                          lineColor="#ffffff"
                          speed={0.35}
                          intensity={1}
                          radius={24}
                          size="md"
                        >
                          <span className="flex items-center gap-2">
                            Go to Review Queue
                            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                          </span>
                        </SpecularButton>
                      </div>
                    </div>
                  </section>

                  {/* Compliance Health Radial Meter */}
                  <section className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col items-center justify-center relative shadow-ambient min-h-[220px]">
                    <h3 className="font-label-md text-on-surface-variant text-[10px] uppercase font-bold tracking-wider absolute top-6 left-6">Compliance Health</h3>
                    <div className="relative w-28 h-28 mt-6">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" fill="none" r="40" stroke="#1c2738" strokeWidth="8"></circle>
                        <circle className="emerald-glow" cx="50" cy="50" fill="none" r="40" stroke="#10b981" strokeDasharray="251.2" strokeDashoffset="15" strokeLinecap="round" strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-white font-label-md">94<span className="text-sm">%</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-4 text-primary text-xs font-semibold">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      <span>+2.4% vs last month</span>
                    </div>
                  </section>

                </div>

                {/* Row 2 - Quick Stats KPI Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-gutter mb-6">

                  {/* Pending Reviews Card */}
                  <div className="col-span-1 lg:col-span-3 glass-panel rim-light-top rounded-xl p-5 shadow-ambient flex flex-col justify-between cursor-pointer hover:border-warning/30 transition-all" onClick={() => { setActiveTab("queue"); }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-[9px] font-bold">Pending Review</p>
                        <h3 className="text-2xl font-bold text-warning mt-2">{submissions.filter(s => s.status === 'Needs Review').length}</h3>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-warning/10 flex items-center justify-center border border-warning/20">
                        <span className="material-symbols-outlined text-warning text-[18px]">gavel</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-3 font-semibold">
                      Requires audit validation
                    </div>
                  </div>

                  {/* Flagged Violations Card */}
                  <div className="col-span-1 lg:col-span-3 glass-panel rim-light-top rounded-xl p-5 shadow-ambient flex flex-col justify-between cursor-pointer hover:border-error/30 transition-all" onClick={() => { setActiveTab("queue"); }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-[9px] font-bold">Flagged Violations</p>
                        <h3 className="text-2xl font-bold text-error mt-2">{submissions.filter(s => s.status === 'Flagged').length}</h3>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-error/10 flex items-center justify-center border border-error/20">
                        <span className="material-symbols-outlined text-error text-[18px]">warning</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-3 font-semibold">
                      Out of policy bounds
                    </div>
                  </div>

                  {/* Approved Claims Card */}
                  <div className="col-span-1 lg:col-span-3 glass-panel rim-light-top rounded-xl p-5 shadow-ambient flex flex-col justify-between cursor-pointer hover:border-primary/30 transition-all" onClick={() => { setActiveTab("queue"); }}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-[9px] font-bold">Approved Claims</p>
                        <h3 className="text-2xl font-bold text-primary mt-2">{submissions.filter(s => s.status === 'Approved').length}</h3>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                      </div>
                    </div>
                    <div className="text-[10px] text-on-surface-variant mt-3 font-semibold">
                      Cleared automatically
                    </div>
                  </div>

                  {/* Core Team List */}
                  <section className="col-span-1 lg:col-span-3 glass-panel rounded-xl p-5 shadow-ambient flex flex-col justify-between">
                    <h3 className="text-label-sm font-label-sm text-on-surface-variant uppercase tracking-wider text-[9px] font-bold mb-2">Compliance Team</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2 p-1.5 rounded bg-background/40 border border-outline-variant/10 text-xs">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center border border-primary/10 text-[10px] font-bold text-primary">S</div>
                        <div>
                          <p className="text-[10px] font-bold text-white leading-none">Sarah Jenkins</p>
                          <p className="text-[8px] text-on-surface-variant leading-none mt-0.5">HR Lead</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-1.5 rounded bg-background/40 border border-outline-variant/10 text-xs">
                        <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center border border-secondary/10 text-[10px] font-bold text-secondary">M</div>
                        <div>
                          <p className="text-[10px] font-bold text-white leading-none">Mike Taggart</p>
                          <p className="text-[8px] text-on-surface-variant leading-none mt-0.5">Compliance</p>
                        </div>
                      </div>
                    </div>
                  </section>

                </div>

                {/* Row 3 - Document Library & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter mb-6">

                  {/* Document Library */}
                  <section className="lg:col-span-4 glass-panel rounded-2xl p-6 flex flex-col justify-between shadow-ambient min-h-[280px]">
                    <div>
                      <h3 className="font-headline-md text-md text-white font-bold mb-4">Document Library</h3>
                      <div className="flex flex-col gap-3">

                        <button type="button" onClick={() => setActiveTab("compliance")} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-outline-variant/35 text-left group transition-all w-full">
                          <span className="material-symbols-outlined text-secondary text-xl group-hover:scale-110 transition-transform">folder_open</span>
                          <div>
                            <p className="text-xs font-bold text-white">Q3 Onboarding</p>
                            <p className="text-[9px] text-on-surface-variant">12 Files • Updated 2h ago</p>
                          </div>
                        </button>

                        <button type="button" onClick={() => setActiveTab("compliance")} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-outline-variant/35 text-left group transition-all w-full">
                          <span className="material-symbols-outlined text-primary text-xl group-hover:scale-110 transition-transform">policy</span>
                          <div>
                            <p className="text-xs font-bold text-white">Policy Updates</p>
                            <p className="text-[9px] text-on-surface-variant">4 Files • Needs Review</p>
                          </div>
                        </button>

                        <button type="button" onClick={() => setActiveTab("compliance")} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 border border-outline-variant/35 text-left group transition-all w-full">
                          <span className="material-symbols-outlined text-outline text-xl group-hover:scale-110 transition-transform">contract</span>
                          <div>
                            <p className="text-xs font-bold text-white">Vendor Contracts</p>
                            <p className="text-[9px] text-on-surface-variant">24 Files • Stable</p>
                          </div>
                        </button>

                      </div>
                    </div>
                  </section>

                </div>

                {/* Row 4 - Recent Submissions Timeline */}
                <div className="grid grid-cols-1 gap-gutter">
                  <section className="glass-panel rounded-2xl p-6 shadow-ambient">
                    <h3 className="font-headline-md text-sm text-white font-bold mb-6">Recent Submissions</h3>
                    <div className="flex flex-col gap-5">

                      <div className="flex gap-4 relative">
                        <div className="w-px h-full bg-outline-variant/30 absolute left-2 top-6"></div>
                        <div className="w-4 h-4 rounded-full bg-primary/20 border-2 border-primary flex-shrink-0 mt-1 z-10"></div>
                        <div>
                          <p className="text-xs font-bold text-white">Employee Handbook Acknowledged</p>
                          <p className="text-[10px] text-on-surface-variant font-semibold">By Sarah Jenkins • 10 mins ago</p>
                        </div>
                      </div>

                      <div className="flex gap-4 relative">
                        <div className="w-px h-full bg-outline-variant/30 absolute left-2 top-6"></div>
                        <div className="w-4 h-4 rounded-full bg-surface-variant border-2 border-on-surface-variant flex-shrink-0 mt-1 z-10"></div>
                        <div>
                          <p className="text-xs font-bold text-white">Q3 Compliance Audit Uploaded</p>
                          <p className="text-[10px] text-on-surface-variant font-semibold">By System Agent • 2 hours ago</p>
                        </div>
                      </div>

                      <div className="flex gap-4 relative">
                        <div className="w-4 h-4 rounded-full bg-error/20 border-2 border-error flex-shrink-0 mt-1 z-10"></div>
                        <div>
                          <p className="text-xs font-bold text-white">I-9 Verification Failed</p>
                          <p className="text-[10px] text-error font-bold">Action Required • 4 hours ago</p>
                        </div>
                      </div>

                    </div>
                  </section>
                </div>

              </>
            )}

            {/* TAB: Review Queue & Audit */}
            {activeTab === "queue" && (
              <div className="space-y-6">
                <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
                  <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl">rate_review</span>
                    Compliance Review Queue & Audit
                  </h1>
                  <p className="text-on-surface-variant text-body-md max-w-2xl">
                    Oversight and manual override controls for all employee submissions. Review automatic AI audit assessments and grounded citations.
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                  {/* Left Column - Submission list */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <div className="glass-panel rounded-xl p-5">
                      <h3 className="text-label-sm text-on-surface-variant/70 font-bold uppercase tracking-wider text-[10px] mb-3 font-label-md">
                        Submissions Queue ({submissions.length})
                      </h3>
                      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                        {isLoadingSubmissions ? (
                          <div className="text-center py-8 text-on-surface-variant text-sm">
                            Loading submissions...
                          </div>
                        ) : submissions.length === 0 ? (
                          <div className="text-center py-8 text-on-surface-variant text-sm">
                            No submissions found.
                          </div>
                        ) : (
                          submissions.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => setSelectedSub(sub)}
                              className={`w-full text-left p-3.5 rounded-lg border text-xs flex flex-col gap-2 transition-all ${selectedSub?.id === sub.id
                                ? "bg-primary/5 border-primary shadow-ambient"
                                : "bg-[#182232]/40 border-outline-variant/20 hover:bg-[#182232]/70"
                                }`}
                            >
                              <div className="flex justify-between items-start w-full">
                                <div>
                                  <span className="text-[10px] text-primary uppercase font-bold tracking-wider">
                                    {sub.docType}
                                  </span>

                                  <div className="font-bold text-on-surface text-sm mt-0.5">
                                    {sub.title}
                                  </div>
                                </div>

                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${sub.status === "Approved"
                                    ? "bg-primary/20 text-primary border border-primary/25"
                                    : sub.status === "Rejected"
                                      ? "bg-error/20 text-error border border-error/25"
                                      : sub.status === "Flagged"
                                        ? "bg-error/20 text-error border border-error/25"
                                        : "bg-warning/20 text-warning border border-warning/25"
                                    }`}
                                >
                                  {sub.status}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-on-surface-variant/80 mt-1 border-t border-outline-variant/10 pt-2 font-medium">
                                <span>
                                  By: <strong className="text-white">{sub.submittedByName}</strong>
                                </span>

                                <span>
                                  Val: <strong className="text-white">{sub.amount}</strong>
                                </span>

                                <span>{sub.date}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Submission Details, Audit Trail, and HR AI Q&A */}
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    {selectedSub ? (
                      <div className="space-y-6">
                        {/* Submission details card */}
                        <div className="glass-panel rounded-xl p-6 shadow-ambient">
                          <div className="flex justify-between items-start border-b border-outline-variant/20 pb-4 mb-4">
                            <div>
                              <span className="text-label-sm text-primary uppercase font-bold tracking-wider">{selectedSub.docType}</span>
                              <h3 className="text-xl font-bold text-white mt-1">{selectedSub.title}</h3>
                              <p className="text-xs text-on-surface-variant mt-1">Submitted by: <strong className="text-white">{selectedSub.submittedByName}</strong></p>
                            </div>
                            <span className={`px-3.5 py-1 rounded-full text-xs font-bold border ${selectedSub.status === "Approved" ? "bg-primary/20 text-primary border-primary/30" :
                              selectedSub.status === "Flagged" ? "bg-error/20 text-error border-error/30" : "bg-warning/20 text-warning border-warning/30"
                              }`}>
                              {selectedSub.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-4 text-xs font-label-sm mt-4 bg-background/50 border border-outline-variant/15 p-4 rounded-lg">
                            <div>
                              <span className="text-on-surface-variant block uppercase tracking-wider text-[9px] font-bold">SUBMITTED VALUE</span>
                              <span className="text-white font-bold text-sm">{selectedSub.amount}</span>
                            </div>
                            <div>
                              <span className="text-on-surface-variant block uppercase tracking-wider text-[9px] font-bold">DATE FILED</span>
                              <span className="text-white font-bold text-sm">{selectedSub.date}</span>
                            </div>
                            <div>
                              <span className="text-on-surface-variant block uppercase tracking-wider text-[9px] font-bold">SUBMISSION ID</span>
                              <span className="text-white font-mono font-bold text-sm">{selectedSub.id}</span>
                            </div>
                          </div>

                          {selectedSub.description && (
                            <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 text-xs mt-4">
                              <strong className="text-on-surface block mb-1">
                                Submission description:
                              </strong>

                              <p className="text-on-surface-variant whitespace-pre-line">
                                {selectedSub.description}
                              </p>
                            </div>
                          )}

                          {selectedSub.fileUrl && !selectedSub.fileUrl.startsWith("api://") && (
                            <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 text-xs mt-4">
                              <strong className="text-on-surface block mb-2">
                                Uploaded document:
                              </strong>

                              <a
                                href={`http://127.0.0.1:8000/${selectedSub.fileUrl.replace(/^backend[\\/]+uploads[\\/]+/, "uploads/").replace(/\\/g, "/")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                              >
                                <span className="material-symbols-outlined text-[18px]">
                                  open_in_new
                                </span>
                                Open uploaded document
                              </a>
                            </div>
                          )}

                          {/* Compliance Evaluation result */}
                          <div className="bg-[#1a2536]/80 border border-outline-variant/30 rounded-lg p-4 text-xs leading-relaxed text-on-surface-variant mt-4 space-y-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <strong className="text-on-surface block mb-1">Grounded Policy Citation:</strong>
                                <span className="text-primary font-bold">{selectedSub.citation || "No citation"}</span>
                              </div>
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${selectedSub.severity === "High" ? "bg-error/20 text-error border border-error/25" :
                                selectedSub.severity === "Medium" ? "bg-warning/20 text-warning border border-warning/25" : "bg-primary/20 text-primary border border-primary/25"
                                }`}>
                                {selectedSub.severity || "Low"} Severity
                              </span>
                            </div>
                            <div>
                              <strong className="text-on-surface block mb-1">AI Logic & Explanation:</strong>
                              <p className="text-on-surface-variant/90">{selectedSub.explanation}</p>
                            </div>
                            {selectedSub.recommendedAction && (
                              <div className="pt-2 border-t border-outline-variant/25">
                                <strong className="text-on-surface block mb-0.5">Recommended Actions:</strong>
                                <p className="font-semibold text-white">{selectedSub.recommendedAction}</p>
                              </div>
                            )}
                          </div>

                          {/* Audit Trail Section */}
                          <div className="mt-6 border-t border-outline-variant/25 pt-6">
                            <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                              <span className="material-symbols-outlined text-primary text-[16px]">history</span>
                              Chronological Audit Trail
                            </h4>
                            <div className="space-y-4 relative pl-4 before:content-[''] before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/35">
                              {(() => {
                                let history = [];
                                try {
                                  history = JSON.parse(selectedSub.workflowHistory || "[]");
                                } catch (e) {
                                  history = [];
                                }
                                if (history.length === 0) {
                                  return <p className="text-xs text-on-surface-variant">No workflow log history recorded.</p>;
                                }
                                return history.map((item, idx) => (
                                  <div key={idx} className="relative flex gap-3 text-xs leading-relaxed">
                                    <div className="absolute -left-[14px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#0d1c33] border-2 border-primary flex-shrink-0"></div>
                                    <div>
                                      <span className="text-[10px] text-on-surface-variant block font-semibold">{item.timestamp}</span>
                                      <p className="text-white font-medium mt-0.5">{item.message}</p>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          {/* Manual workflow actions */}
                          {selectedSub.status !== "Approved" && (
                            <div className="border-t border-outline-variant/25 pt-4 mt-6 flex flex-col sm:flex-row justify-end gap-3">
                              <SpecularButton
                                onClick={() => handleTriggerReview(selectedSub.id)}
                                disabled={isActioningWorkflow}
                                className="w-full sm:w-auto px-5 py-2.5 font-bold shadow-[0_4px_12px_rgba(59,130,246,0.25)]"
                                baseColor="#3b82f6"
                                textColor="#ffffff"
                                tint="#3b82f6"
                                tintOpacity={0.18}
                                lineColor="#ffffff"
                                speed={0.35}
                                intensity={1}
                                radius={8}
                              >
                                <span className="flex items-center gap-1.5 justify-center">
                                  <span className="material-symbols-outlined text-[16px]">{isActioningWorkflow ? "sync" : "auto_awesome"}</span>
                                  {isActioningWorkflow ? "Reviewing..." : "Review"}
                                </span>
                              </SpecularButton>

                              <SpecularButton
                                onClick={() => handleApproveManually(selectedSub.id)}
                                disabled={isActioningWorkflow}
                                className="w-full sm:w-auto px-5 py-2.5 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
                                baseColor="#10b981"
                                textColor="#091426"
                                tint="#10b981"
                                tintOpacity={1.0}
                                lineColor="#ffffff"
                                speed={0.35}
                                intensity={1}
                                radius={8}
                              >
                                <span className="flex items-center gap-1.5 justify-center">
                                  <span className="material-symbols-outlined text-[16px]">verified</span>
                                  Accept
                                </span>
                              </SpecularButton>

                              <button
                                type="button"
                                onClick={() => handleRejectManually(selectedSub.id)}
                                disabled={isActioningWorkflow}
                                className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-error/40 bg-error/10 text-error font-bold text-xs hover:bg-error/15 transition-colors disabled:opacity-50"
                              >
                                <span className="flex items-center gap-1.5 justify-center">
                                  <span className="material-symbols-outlined text-[16px]">close</span>
                                  Reject
                                </span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* RAG Chat Assistant (Grounded Policy Q&A) */}
                        <div className="glass-panel rounded-xl p-6 shadow-ambient">
                          <div className="border-b border-outline-variant/20 pb-3 mb-4">
                            <h3 className="text-headline-md font-headline-md text-white flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary text-xl">auto_awesome</span>
                              HR AI Compliance Assistant (RAG Engine)
                            </h3>
                            <p className="text-xs text-on-surface-variant mt-1">
                              Query corporate policies directly. Evaluates leave policies, expense caps, and employee handbook sections.
                            </p>
                          </div>

                          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1 flex flex-col mb-4">
                            {chatHistory.map((msg, idx) => (
                              <div key={idx} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                                <span className="text-[9px] text-on-surface-variant/50 font-label-sm mb-1">
                                  {msg.sender === "user" ? "HR Admin" : "ClauseGuard RAG Engine"}
                                </span>
                                <div className={`p-3 rounded-lg text-xs leading-relaxed ${msg.sender === "user" ? "bg-primary/20 text-primary border border-primary/25 rounded-tr-none" : "bg-surface-container-high border border-outline-variant/30 text-on-surface rounded-tl-none"
                                  }`}>
                                  {msg.text}
                                </div>
                                {msg.citation && (
                                  <span className="text-[8px] font-label-sm bg-background border border-outline-variant/20 text-primary px-1.5 py-0.5 rounded mt-1 font-bold uppercase">
                                    Citing: {msg.citation}
                                  </span>
                                )}
                              </div>
                            ))}
                            {isTyping && (
                              <div className="self-start text-xs text-primary font-bold animate-pulse flex items-center gap-1.5">
                                <span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>
                                Querying policy vectors...
                              </div>
                            )}
                          </div>

                          <div className="border-t border-outline-variant/15 pt-4">
                            <h4 className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider mb-2">Preset Admin Queries</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {hrChatPresets.map((preset, idx) => (
                                <button
                                  key={idx}
                                  onClick={(e) => handleSendMessage(e, preset.q)}
                                  className="text-left text-[11px] bg-background/50 hover:bg-white/5 border border-outline-variant/20 rounded-lg px-3 py-2 text-on-surface hover:text-primary transition-all font-semibold leading-normal"
                                >
                                  "{preset.q}"
                                </button>
                              ))}
                            </div>

                            <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-2">
                              <input
                                type="text"
                                placeholder="Ask about travel limits, medical leave certificate bounds, or corporate guidelines..."
                                value={chatInput}
                                disabled={isTyping}
                                onChange={(e) => setChatInput(e.target.value)}
                                className="flex-1 bg-background border border-outline-variant/50 rounded-lg px-4 py-2.5 text-xs text-on-surface focus:border-primary outline-none"
                              />
                              <button
                                type="submit"
                                disabled={isTyping || !chatInput.trim()}
                                className="bg-primary text-background font-bold px-4 py-2.5 rounded-lg text-xs hover:brightness-110 transition-colors flex items-center justify-center shrink-0"
                              >
                                <span className="material-symbols-outlined text-[18px]">send</span>
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="glass-panel rounded-xl p-6 shadow-ambient flex flex-col items-center justify-center text-center text-on-surface-variant min-h-[380px]">
                        <span className="material-symbols-outlined text-4xl mb-2 opacity-45">rate_review</span>
                        <h3 className="font-bold text-white text-sm">No Submission Selected</h3>
                        <p className="text-xs text-on-surface-variant mt-1">Select a submission from the queue list to inspect compliance audits.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Compliance Hub (Policy Manager) */}
            {activeTab === "compliance" && (
              <div className="space-y-6">
                <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
                  <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl">description</span>
                    Enterprise Policy Management
                  </h1>
                  <p className="text-on-surface-variant text-body-md max-w-2xl">
                    HR Admin policy configuration system. Upload policy documents and map them to standard document review configurations.
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="glass-panel rounded-xl p-6 shadow-ambient">
                      <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">cloud_upload</span>
                        Upload Policy Document
                      </h2>

                      <form onSubmit={handleUploadPolicy} className="space-y-4">
                        <div>
                          <label className="text-label-sm text-on-surface-variant block mb-1">Policy Title Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Parental Leave Policy"
                            value={newPolicyName}
                            onChange={(e) => setNewPolicyName(e.target.value)}
                            className="w-full bg-background border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
                          />
                        </div>

                        <div>
                          <label className="text-label-sm text-on-surface-variant block mb-1">Connected DocumentType</label>
                          <select
                            value={newPolicyDocType}
                            onChange={(e) => setNewPolicyDocType(e.target.value)}
                            className="w-full bg-background border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
                          >
                            <option value="Expense Claim">Expense Claim</option>
                            <option value="Sick Leave Request">Sick Leave Request</option>
                            <option value="Casual Leave Request">Casual Leave Request</option>
                            <option value="General Guidelines">General Guidelines</option>
                          </select>
                        </div>

                        <label className="border border-dashed border-outline-variant/30 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary transition-colors bg-background/20">
                          <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                            upload_file
                          </span>

                          <span className="text-xs text-on-surface">
                            {policyFile
                              ? policyFile.name
                              : "Upload policy document PDF"}
                          </span>

                          <span className="text-[10px] text-on-surface-variant">
                            PDF, TXT up to 10MB
                          </span>

                          <input
                            type="file"
                            accept=".pdf,.txt,application/pdf,text/plain"
                            className="hidden"
                            onChange={(e) => setPolicyFile(e.target.files?.[0] || null)}
                          />
                        </label>

                        <SpecularButton
                          type="submit"
                          disabled={isUploadingPolicy || !newPolicyName.trim()}
                          className="w-full py-2.5 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)]"
                          baseColor="#10b981"
                          textColor="#ffffff"
                          tint="#10b981"
                          tintOpacity={0.15}
                          lineColor="#ffffff"
                          speed={0.35}
                          intensity={1}
                          radius={8}
                          size="md"
                        >
                          <span className="material-symbols-outlined text-[18px] mr-2">
                            {isUploadingPolicy ? "sync" : "cloud_upload"}
                          </span>
                          {isUploadingPolicy ? "Parsing and Vectorizing Policy..." : "Upload & Parse Policy"}
                        </SpecularButton>
                      </form>
                    </div>
                  </div>

                  <div className="lg:col-span-7 flex flex-col gap-6">
                    <div className="glass-panel rounded-xl p-6 shadow-ambient">
                      <h2 className="text-headline-md font-headline-md text-on-surface mb-6">Grounded Policy Knowledge Base Explorer</h2>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[300px]">
                        <div className="md:col-span-5 h-[280px] relative overflow-hidden border-r border-outline-variant/20 pr-4">
                          <LineSidebar
                            items={policies.map(p => p.name)}
                            accentColor="#A855F7"
                            textColor="#c4c4c4"
                            markerColor="#6c6c6c"
                            showIndex
                            showMarker
                            proximityRadius={100}
                            maxShift={30}
                            falloff="smooth"
                            markerLength={60}
                            markerGap={0}
                            tickScale={0.5}
                            scaleTick
                            itemGap={20}
                            fontSize={1.1}
                            smoothing={100}
                            defaultActive={0}
                            onItemClick={(index, label) => {
                              console.log(index, label);
                              setSelectedPolicyIdx(index);
                            }}
                          />
                        </div>

                        <div className="md:col-span-7 pl-4 space-y-4">
                          {policies.map((p, idx) => {
                            if (idx !== selectedPolicyIdx) return null;

                            const fileUrl = p.file_url
                              ? `http://127.0.0.1:8000/${p.file_url
                                .replace(/^backend[\\/]+uploads[\\/]+/, "uploads/")
                                .replace(/^test_data[\\/]+/, "test-data/")
                                .replace(/\\/g, "/")}`
                              : "";

                            return (
                              <div key={p.id} className="space-y-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                                      <span className="material-symbols-outlined text-primary">
                                        gavel
                                      </span>
                                      {p.name}
                                    </h4>

                                    <p className="text-[10px] text-on-surface-variant/80 uppercase font-semibold font-label-sm mt-1">
                                      Document Type: {p.document_type}
                                    </p>
                                  </div>

                                  <span className="bg-primary/20 text-primary border border-primary/30 rounded px-2 py-0.5 text-[9px] font-bold font-label-sm uppercase">
                                    {p.is_active ? "Active" : "Archived"} v{p.version}
                                  </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10 text-[10px] font-label-sm text-on-surface-variant">
                                  <div>
                                    <span className="block opacity-60">VERSION:</span>
                                    <span className="font-bold text-white">
                                      v{p.version}
                                    </span>
                                  </div>

                                  <div>
                                    <span className="block opacity-60">LAST UPDATED:</span>
                                    <span className="font-bold text-white">
                                      {p.created_at
                                        ? new Date(p.created_at).toLocaleDateString()
                                        : "—"}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 flex justify-end gap-3">
                                  {fileUrl && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        window.open(
                                          fileUrl,
                                          "_blank",
                                          "noopener,noreferrer"
                                        )
                                      }
                                      className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold"
                                    >
                                      View Document
                                    </button>
                                  )}

                                  {p.is_active ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handlePolicyStatusChange(p.id, "archive")
                                      }
                                      className="px-3 py-1.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-bold"
                                    >
                                      Archive Policy
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handlePolicyStatusChange(p.id, "activate")
                                      }
                                      className="px-3 py-1.5 rounded-lg border border-green-500/30 bg-green-500/10 text-green-400 text-[10px] font-bold"
                                    >
                                      Activate Policy
                                    </button>
                                  )}
                                </div>

                                <div className="bg-background/40 border border-outline-variant/20 rounded-lg p-3 text-[10px] text-on-surface-variant leading-relaxed">
                                  <span className="font-bold text-white block mb-1">
                                    RAG Context:
                                  </span>
                                  Grounded in this policy document for natural language
                                  compliance evaluation. Vector search checks incident
                                  descriptions against the corresponding compliance threshold.
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "records" && (
              <div className="space-y-6">
                {/* Employee Records Header */}
                <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </div>

                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">
                        Employee Records
                      </h1>
                      <p className="mt-1 text-slate-500">
                        View employees and their compliance records across the organization.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Employee Directory */}
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-900">
                        Employee Directory
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        Employees registered in this organization.
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
                      {employees.length} {employees.length === 1 ? "User" : "Users"}
                    </div>
                  </div>

                  {employees.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
                      <p className="font-medium text-slate-600">
                        No employees found.
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        Employees registered in this organization will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                      {employees.map((employee) => (
                        <div
                          key={employee.id}
                          className="rounded-xl border border-gray-200 p-5 transition hover:shadow-sm"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-700">
                                {employee.name
                                  ? employee.name.charAt(0).toUpperCase()
                                  : "U"}
                              </div>

                              <div>
                                <h3 className="font-semibold text-slate-900">
                                  {employee.name}
                                </h3>
                                <p className="text-sm text-slate-500">
                                  {employee.email}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${employee.role === "HR"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-green-50 text-green-700"
                                }`}
                            >
                              {employee.role === "HR" ? "HR" : "EMPLOYEE"}
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-3 gap-3">
                            <div className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">Requests</p>
                              <p className="mt-1 text-lg font-semibold text-slate-900">
                                {submissions.filter((s) => s.employeeId === employee.id).length}
                              </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">Approved</p>
                              <p className="mt-1 text-lg font-semibold text-slate-900">
                                {submissions.filter(
                                  (s) => s.employeeId === employee.id && s.status === "Approved"
                                ).length}
                              </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-500">Review</p>
                              <p className="mt-1 text-lg font-semibold text-slate-900">
                                {submissions.filter(
                                  (s) =>
                                    s.employeeId === employee.id &&
                                    (s.status === "Needs Review" || s.status === "NEEDS_REVIEW")
                                ).length}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                            <div>
                              <p className="text-xs text-slate-500">Compliance Status</p>
                              <p className="text-sm font-medium text-slate-600">
                                {submissions.filter((s) => s.employeeId === employee.id).length === 0
                                  ? "No requests evaluated yet"
                                  : submissions.some(
                                    (s) =>
                                      s.employeeId === employee.id &&
                                      s.status === "Needs Review"
                                  )
                                    ? "Requires compliance review"
                                    : submissions.some(
                                      (s) =>
                                        s.employeeId === employee.id &&
                                        s.status === "Rejected"
                                    )
                                      ? "Has rejected requests"
                                      : "Compliant"}
                              </p>
                            </div>

                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                              Active
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* TAB 4: Document Library (Audit Log & SaaS ROI calculator) */}
            {activeTab === "library" && (
              <div className="space-y-6">
                <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
                  <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl">calculate</span>
                    Audit Trail &amp; SaaS ROI Workload Calculator
                  </h1>
                  <p className="text-on-surface-variant text-body-md max-w-2xl">
                    Compare the SaaS subscription fees against estimated manual reviewer workload to calculate time-saved metrics and recovered organizational capacity.
                  </p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
                  <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="glass-panel rounded-xl p-6 shadow-ambient flex flex-col justify-between min-h-[460px] relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none"></div>

                      <div>
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">calculate</span>
                          SaaS ROI Calculator
                        </h2>

                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                              <span>HR Reviewer Seats:</span>
                              <span className="text-primary font-label-sm">{seats} Reviewer(s)</span>
                            </div>
                            <input
                              type="range" min="1" max="50"
                              value={seats}
                              onChange={(e) => setSeats(Number(e.target.value))}
                              className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                              <span>Claims Per Seat / Day:</span>
                              <span className="text-primary font-label-sm">{claimsPerDay} Claims</span>
                            </div>
                            <input
                              type="range" min="5" max="50"
                              value={claimsPerDay}
                              onChange={(e) => setClaimsPerDay(Number(e.target.value))}
                              className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                              <span>Manual Minutes Per Claim:</span>
                              <span className="text-primary font-label-sm">{minutesPerClaim} Minutes</span>
                            </div>
                            <input
                              type="range" min="2" max="30"
                              value={minutesPerClaim}
                              onChange={(e) => setMinutesPerClaim(Number(e.target.value))}
                              className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                              <span>Reviewer Loaded Hourly Cost:</span>
                              <span className="text-primary font-label-sm">₹{loadedCost}/hour</span>
                            </div>
                            <input
                              type="range" min="300" max="2500" step="50"
                              value={loadedCost}
                              onChange={(e) => setLoadedCost(Number(e.target.value))}
                              className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 text-xs font-label-sm mt-6 space-y-2">
                        <div className="flex justify-between py-1 border-b border-outline-variant/10">
                          <span className="text-on-surface-variant">Monthly SaaS Subscription:</span>
                          <span className="text-on-surface font-bold">₹{monthlySaaS.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-outline-variant/10">
                          <span className="text-on-surface-variant">Annual SaaS Subscription:</span>
                          <span className="text-on-surface font-bold">₹{annualSaaS.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-outline-variant/10 text-error">
                          <span>Manual Claim Review Cost/yr:</span>
                          <span className="font-bold">₹{manualReviewValue.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-outline-variant/10 text-primary">
                          <span>Economic Value Recovered/yr:</span>
                          <span className="font-bold">₹{economicValueRecovered.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-1 text-sm font-black text-primary border-t border-outline-variant/20">
                          <span>Net Annual Capacity Saved:</span>
                          <span className="emerald-text-glow font-bold">₹{netSavedValue.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 flex flex-col gap-6">
                    <div className="glass-panel rounded-xl p-6 shadow-ambient flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-4">Compliance Audit Trails</h2>
                        <div className="space-y-3">
                          {auditLogs.map((log) => (
                            <div key={log.id} className="bg-background/60 border border-outline-variant/30 rounded-lg p-3 text-xs font-label-sm relative overflow-hidden">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-bold text-on-surface">{log.employee} • {log.docType}</h4>
                                  <p className="text-[10px] text-on-surface-variant mt-1">Audit log ID: {log.id} • {log.timestamp}</p>
                                </div>
                                <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${log.status === 'Approved' ? 'bg-primary/20 text-primary border border-primary/25' : 'bg-error/20 text-error border border-error/25'
                                  }`}>
                                  {log.status}
                                </span>
                              </div>
                              <div className="mt-2.5 pt-2.5 border-t border-outline-variant/10 text-[10px] text-on-surface-variant">
                                <span className="text-primary font-bold font-label-sm">Audited against:</span> {log.policy} ({log.chunks})
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: AI Insights (Folder 7 Layout - HR Analytics) */}
            {activeTab === "insights" && (
              <>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 font-headline-lg">
                      HR Analytics <span className="text-primary font-semibold">Intelligence</span>
                    </h1>
                    <p className="text-body-lg text-on-surface-variant max-w-2xl">
                      Enterprise workforce dynamics and retention diagnostics.
                    </p>
                  </div>
                  <SpecularButton
                    onClick={handleExport}
                    className="w-full sm:w-auto font-bold border border-outline-variant/30 shadow-sm"
                    baseColor="#091426"
                    textColor="#10b981"
                    tint="#091426"
                    tintOpacity={1.0}
                    lineColor="#10b981"
                    speed={0.3}
                    intensity={0.8}
                    radius={8}
                    size="md"
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">download</span>
                      Export Report
                    </span>
                  </SpecularButton>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-6">
                  {analyticsKpis.map((kpi, idx) => (
                    <KpiCard key={idx} {...kpi} />
                  ))}

                  <div className="md:col-span-12 glass-panel rounded-2xl p-6 shadow-ambient">
                    <h3 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">bar_chart</span>
                      Requests Submitted — Last 7 Days
                    </h3>
                    <div className="grid grid-cols-7 gap-3 items-end h-[220px]">
                      {weeklyReviewCounts.map((item, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div
                            className="w-full max-w-[48px] rounded-t-xl bg-primary"
                            style={{
                              height: `${item.count === 0 ? 4 : Math.max((item.count / 11) * 180, 12)}px`,
                            }}
                          ></div>

                          <span className="text-[10px] text-on-surface-variant">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-span-1 md:col-span-12 glass-panel rounded-2xl p-6 shadow-ambient">
                    <div className="mb-5">
                      <h3 className="text-lg font-semibold text-on-surface">
                        Compliance Outcome Breakdown
                      </h3>
                      <p className="text-sm text-on-surface-variant mt-1">
                        Current distribution of employee requests by review outcome.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {complianceOutcomeCounts.map((item) => {
                        const total = submissions.length;
                        const percentage =
                          total > 0 ? Math.round((item.count / total) * 100) : 0;

                        return (
                          <div
                            key={item.label}
                            className="rounded-xl border border-outline-variant/20 bg-surface-container-low p-4"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <p className="text-sm text-on-surface-variant">
                                {item.label}
                              </p>

                              <span className="text-xs font-medium text-on-surface-variant">
                                {percentage}%
                              </span>
                            </div>

                            <p className="text-3xl font-bold text-on-surface">
                              {item.count}
                            </p>

                            <div className="mt-3 h-2 rounded-full bg-surface-container-high overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 6: Settings (SaaS ROI & Architecture Control Center) */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
                  <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-4xl">calculate</span>
                    SaaS Management &amp; ROI Center
                  </h1>
                  <p className="text-on-surface-variant text-body-md max-w-2xl">
                    Analyze seat-based B2B subscription metrics, simulate organizational workload savings, inspect data privacy controls, and audit the vector retrieval flow.
                  </p>
                </section>

                {/* SaaS Management Sub-navigation */}
                <div className="flex flex-wrap gap-2 border-b border-outline-variant/10 pb-2 mb-6">
                  {[
                    { key: "pipeline", label: "System Architecture", icon: "hub" },
                    { key: "privacy", label: "Data Safeguards", icon: "security" },
                    { key: "pricing", label: "SaaS ROI & Subscriptions", icon: "calculate" },
                    { key: "stack", label: "Enterprise Stack & Clients", icon: "devices" }
                  ].map((sub) => {
                    const active = settingsTab === sub.key;
                    return (
                      <button
                        key={sub.key}
                        onClick={() => setSettingsTab(sub.key)}
                        className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-label-md rounded-lg transition-all border ${active
                          ? "bg-primary/10 border-primary text-primary shadow-sm"
                          : "bg-[#1d1a22]/40 border-outline-variant/35 text-on-surface-variant hover:text-white hover:bg-white/5"
                          }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">{sub.icon}</span>
                        {sub.label}
                      </button>
                    );
                  })}
                </div>

                {settingsTab === "pipeline" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter animate-fade-in">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient">
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-6 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">hub</span>
                          RAG Pipeline Logic (Retrieval Flow)
                        </h2>

                        <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 min-h-[350px] flex items-center justify-center relative overflow-hidden">
                          <svg className="w-full h-full min-h-[300px]" viewBox="0 0 450 300">
                            <line x1="80" y1="50" x2="220" y2="50" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
                            <line x1="220" y1="50" x2="360" y2="50" stroke="#10b981" strokeWidth="2" />
                            <line x1="360" y1="50" x2="360" y2="130" stroke="#10b981" strokeWidth="2" />
                            <line x1="360" y1="130" x2="220" y2="130" stroke="#10b981" strokeWidth="2" strokeDasharray="3" />
                            <line x1="220" y1="130" x2="80" y2="130" stroke="#10b981" strokeWidth="2" />
                            <line x1="80" y1="130" x2="80" y2="210" stroke="#10b981" strokeWidth="2" />
                            <line x1="80" y1="210" x2="220" y2="210" stroke="#10b981" strokeWidth="2" />

                            <g>
                              <rect x="20" y="30" width="120" height="40" rx="6" fill="#15121a" stroke="#10b981" strokeWidth="1.5" />
                              <text x="80" y="55" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">1. Policy PDF</text>
                            </g>

                            <g>
                              <rect x="160" y="30" width="120" height="40" rx="6" fill="#15121a" stroke="#7bd0ff" strokeWidth="1.5" />
                              <text x="220" y="55" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">2. Document Chunking</text>
                            </g>

                            <g>
                              <rect x="300" y="30" width="120" height="40" rx="6" fill="#15121a" stroke="#10b981" strokeWidth="1.5" />
                              <text x="360" y="55" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">3. Vector Database</text>
                            </g>

                            <g>
                              <rect x="300" y="110" width="120" height="40" rx="6" fill="#15121a" stroke="#ffb3af" strokeWidth="1.5" />
                              <text x="360" y="135" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">4. Submission Check</text>
                            </g>

                            <g>
                              <rect x="160" y="110" width="120" height="40" rx="6" fill="#15121a" stroke="#10b981" strokeWidth="1.5" />
                              <text x="220" y="135" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">5. Context Retrieval</text>
                            </g>

                            <g>
                              <rect x="20" y="110" width="120" height="40" rx="6" fill="#15121a" stroke="#fc7c78" strokeWidth="1.5" />
                              <text x="80" y="135" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">6. LLM Evaluation</text>
                            </g>

                            <g>
                              <rect x="20" y="190" width="120" height="40" rx="6" fill="#15121a" stroke="#10b981" strokeWidth="1.5" />
                              <text x="80" y="215" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">7. Grounded Output</text>
                            </g>

                            <g>
                              <rect x="160" y="190" width="260" height="40" rx="6" fill="#15121a" stroke="#7bd0ff" strokeWidth="1.5" />
                              <text x="290" y="215" fill="#e8e0ec" fontSize="9" textAnchor="middle" fontWeight="bold">HR Decision / Audit Trail Logged</text>
                            </g>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient flex flex-col justify-between flex-1 min-h-[350px]">
                        <div>
                          <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2 mb-4 font-label-md uppercase tracking-wider text-on-surface-variant/80">Security Control Keys</h3>

                          <div className="space-y-4">
                            <div className="flex justify-between items-center text-xs">
                              <div>
                                <span className="font-bold text-on-surface">API Credentials Status</span>
                                <p className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">Secrets stored securely on Python server</p>
                              </div>
                              <span className="bg-primary/20 text-primary border border-primary/25 rounded px-2.5 py-0.5 font-bold font-label-sm">Active &amp; Hidden</span>
                            </div>

                            <div className="flex justify-between items-center text-xs border-t border-outline-variant/10 pt-3">
                              <div>
                                <span className="font-bold text-on-surface">PII Redaction filter</span>
                                <p className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">Redacts sensitive names/emails before LLM calls</p>
                              </div>

                              <button
                                onClick={() => setPiiRedaction(!piiRedaction)}
                                className={`w-11 h-6 rounded-full transition-all relative border ${piiRedaction ? "bg-primary border-primary" : "bg-surface-container border-outline-variant"
                                  }`}
                              >
                                <div className={`w-4 h-4 rounded-full bg-background absolute top-1/2 -translate-y-1/2 transition-all ${piiRedaction ? "right-1" : "left-1"
                                  }`}></div>
                              </button>
                            </div>
                          </div>

                          <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-3.5 mt-6 text-[10px] font-label-sm leading-relaxed text-on-surface-variant">
                            <strong className="text-on-surface block mb-1">RAG Prompt Payload Preview:</strong>
                            {piiRedaction ? (
                              <span>
                                "Verify medical leave request for employee [REDACTED_RAHUL] for period Aug 08-10. Details: Checked against [REDACTED_POLICY] at IP [REDACTED_IP]."
                              </span>
                            ) : (
                              <span>
                                "Verify medical leave request for employee Rahul for period Aug 08-10. Details: Checked against Medical Leave Policy v1.2 at IP 192.168.1.45."
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 text-[10px] text-primary rounded-lg p-3.5 leading-relaxed mt-4">
                          <strong>Compliance Safeguard:</strong> Model data is restricted. Personally Identifiable Information (PII) is encrypted. Document chunks are never used for base model fine-tuning.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "privacy" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter animate-fade-in">
                    <div className="lg:col-span-7 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient">
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">gavel</span>
                          Corporate Privacy &amp; Legal Compliance
                        </h2>
                        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed font-semibold">
                          ClauseGuard is architected to comply with global data governance principles. The system enforces strict purpose limitation, data minimization, and user control.
                        </p>

                        <div className="space-y-4">
                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4">
                            <h3 className="font-bold text-xs text-white flex items-center gap-2 mb-2 font-label-md">
                              <span className="material-symbols-outlined text-primary text-[16px]">verified_user</span>
                              GDPR Compliance Framework
                            </h3>
                            <ul className="list-disc pl-4 text-[10px] text-on-surface-variant space-y-1.5 leading-relaxed">
                              <li><strong>Lawful Basis &amp; Consent:</strong> Processing is strictly limited to reviewing the submitted compliance document.</li>
                              <li><strong>Data Minimization:</strong> Only raw claim/leave details are processed. File metadata is stripped on upload.</li>
                              <li><strong>Right to Erasure (Forget):</strong> Review logs and audit records can be completely purged by authorized HR admins.</li>
                            </ul>
                          </div>

                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4">
                            <h3 className="font-bold text-xs text-white flex items-center gap-2 mb-2 font-label-md">
                              <span className="material-symbols-outlined text-secondary text-[16px]">fingerprint</span>
                              India DPDP Act (2023) Compliance
                            </h3>
                            <ul className="list-disc pl-4 text-[10px] text-on-surface-variant space-y-1.5 leading-relaxed">
                              <li><strong>Data Fiduciary Duties:</strong> The company acts as a data fiduciary. ClauseGuard serves as a secure processor logging all automated evaluations.</li>
                              <li><strong>Purpose Limitation:</strong> Claim datasets are never used to train global AI models without explicit, separate consent agreements.</li>
                              <li><strong>Significant Data Fiduciary (SDF) Audit:</strong> Audit trails maintain clean logs to satisfy periodic corporate audits.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient flex flex-col justify-between min-h-[350px]">
                        <div>
                          <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant/20 pb-2 mb-4 font-label-md uppercase tracking-wider text-on-surface-variant/80">PII Redaction Control</h3>
                          <div className="flex justify-between items-center text-xs mt-4">
                            <div>
                              <span className="font-bold text-on-surface">Active Data Scrubbing</span>
                              <p className="text-[10px] text-on-surface-variant mt-0.5 font-semibold">Mask employee identities prior to vector checks</p>
                            </div>
                            <button
                              onClick={() => setPiiRedaction(!piiRedaction)}
                              className={`w-11 h-6 rounded-full transition-all relative border ${piiRedaction ? "bg-primary border-primary" : "bg-surface-container border-outline-variant"
                                }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-background absolute top-1/2 -translate-y-1/2 transition-all ${piiRedaction ? "right-1" : "left-1"
                                }`}></div>
                            </button>
                          </div>

                          <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-3.5 mt-6 text-[10px] font-label-sm leading-relaxed text-on-surface-variant">
                            <strong className="text-on-surface block mb-1">Scrubbed RAG Prompt Preview:</strong>
                            {piiRedaction ? (
                              <span>
                                "Verify medical leave request for employee [REDACTED_RAHUL] for period Aug 08-10. Details: Checked against [REDACTED_POLICY] at IP [REDACTED_IP]."
                              </span>
                            ) : (
                              <span>
                                "Verify medical leave request for employee Rahul for period Aug 08-10. Details: Checked against Medical Leave Policy v1.2 at IP 192.168.1.45."
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 text-[10px] text-primary rounded-lg p-3.5 leading-relaxed mt-4">
                          <strong>Active Compliance Safeguard:</strong> Employee records are sanitized. In-memory data structures are purged from state immediately after evaluation runs complete.
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "pricing" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter animate-fade-in">
                    <div className="lg:col-span-6 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient flex flex-col justify-between min-h-[460px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none"></div>
                        <div>
                          <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">calculate</span>
                            SaaS ROI Workload Calculator
                          </h2>

                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                                <span>HR Reviewer Seats:</span>
                                <span className="text-primary font-label-sm">{seats} Reviewer(s)</span>
                              </div>
                              <input
                                type="range" min="1" max="50"
                                value={seats}
                                onChange={(e) => setSeats(Number(e.target.value))}
                                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                                <span>Claims Per Seat / Day:</span>
                                <span className="text-primary font-label-sm">{claimsPerDay} Claims</span>
                              </div>
                              <input
                                type="range" min="5" max="50"
                                value={claimsPerDay}
                                onChange={(e) => setClaimsPerDay(Number(e.target.value))}
                                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                                <span>Manual Minutes Per Claim:</span>
                                <span className="text-primary font-label-sm">{minutesPerClaim} Minutes</span>
                              </div>
                              <input
                                type="range" min="2" max="30"
                                value={minutesPerClaim}
                                onChange={(e) => setMinutesPerClaim(Number(e.target.value))}
                                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between text-xs mb-1 font-bold text-on-surface">
                                <span>Reviewer Loaded Hourly Cost:</span>
                                <span className="text-primary font-label-sm">₹{loadedCost}/hour</span>
                              </div>
                              <input
                                type="range" min="300" max="2500" step="50"
                                value={loadedCost}
                                onChange={(e) => setLoadedCost(Number(e.target.value))}
                                className="w-full h-1 bg-surface-container rounded-lg appearance-none cursor-pointer accent-primary"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 text-xs font-label-sm mt-6 space-y-2">
                          <div className="flex justify-between py-1 border-b border-outline-variant/10">
                            <span className="text-on-surface-variant">Monthly SaaS Subscription:</span>
                            <span className="text-on-surface font-bold">₹{monthlySaaS.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-outline-variant/10">
                            <span className="text-on-surface-variant">Annual SaaS Subscription:</span>
                            <span className="text-on-surface font-bold">₹{annualSaaS.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-outline-variant/10 text-error">
                            <span>Manual Claim Review Cost/yr:</span>
                            <span className="font-bold">₹{manualReviewValue.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-outline-variant/10 text-primary">
                            <span>Economic Value Recovered/yr:</span>
                            <span className="font-bold">₹{economicValueRecovered.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-1 text-sm font-black text-primary border-t border-outline-variant/20">
                            <span>Net Annual Capacity Saved:</span>
                            <span className="emerald-text-glow font-bold">₹{netSavedValue.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient flex-1 flex flex-col justify-between">
                        <div>
                          <h2 className="text-headline-md font-headline-md text-on-surface mb-4">SaaS Subscription &amp; Pricing Model</h2>
                          <p className="text-xs text-on-surface-variant mb-6 leading-relaxed font-semibold">
                            ClauseGuard follows a professional, seat-based B2B SaaS pricing model. The subscription covers reviewers and administrators, while employees utilize the portal for free.
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-sm">Reviewer Seat Rate</span>
                              <h3 className="text-xl font-bold text-primary mt-2">₹1,500 <span className="text-xs text-on-surface-variant font-normal">/ mo.</span></h3>
                              <p className="text-[9px] text-on-surface-variant mt-2 font-semibold">Billed monthly per active HR/Finance approver seat</p>
                            </div>

                            <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 flex flex-col justify-between">
                              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider font-label-sm">Typical 10-seat Package</span>
                              <h3 className="text-xl font-bold text-white mt-2">₹15,000 <span className="text-xs text-on-surface-variant font-normal">/ mo.</span></h3>
                              <p className="text-[9px] text-on-surface-variant mt-2 font-semibold">Annual contract: ₹1,80,000 for standard enterprise deployment</p>
                            </div>
                          </div>

                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 mt-4 text-xs font-label-sm leading-relaxed text-on-surface-variant space-y-2">
                            <strong className="text-white block font-bold">The Business Value Pitch:</strong>
                            <p>An average HR employee spends 2.5 hours daily performing manual compliance audits. At ₹800/hour, this equals ₹2,000/day in worker capacity.</p>
                            <p className="text-primary font-semibold">ClauseGuard automates 80% of audits, reclaiming ₹1,600/day in recovered productive capacity!</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settingsTab === "stack" && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter animate-fade-in">
                    <div className="lg:col-span-6 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient flex-1">
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">groups_3</span>
                          Target Customer Segment
                        </h2>
                        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed font-semibold">
                          ClauseGuard is a pure B2B Enterprise SaaS tool. The software is sold at the organizational level to streamline corporate policy oversight.
                        </p>

                        <div className="space-y-4">
                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 flex gap-4">
                            <span className="material-symbols-outlined text-primary text-3xl shrink-0">corporate_fare</span>
                            <div>
                              <h4 className="font-bold text-xs text-white">Target Scale: Mid &amp; Large Enterprises</h4>
                              <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                                Ideal for organizations with 100 to 5,000+ employees where expense reviews and leave compliance are too large to oversee manually.
                              </p>
                            </div>
                          </div>

                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 flex gap-4">
                            <span className="material-symbols-outlined text-secondary text-3xl shrink-0">account_balance_wallet</span>
                            <div>
                              <h4 className="font-bold text-xs text-white">Primary Buyers: HR &amp; Finance Departments</h4>
                              <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">
                                Purchasing decisions are driven by Chief Human Resource Officers (CHROs), VP of Finance Operations, and Compliance Directors seeking risk reduction.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-6 flex flex-col gap-6">
                      <div className="glass-panel rounded-xl p-6 shadow-ambient flex-1">
                        <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary">developer_board</span>
                          Recommended Enterprise Tech Stack
                        </h2>
                        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed font-semibold">
                          Built using the college recommended enterprise framework guidelines to ensure high-concurrency compliance checks and sub-second RAG response latencies.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 text-center hover:border-primary/40 transition-colors duration-200">
                            <span className="material-symbols-outlined text-primary text-3xl">html</span>
                            <h4 className="font-bold text-xs text-white mt-2 font-label-md">Next.js / React</h4>
                            <p className="text-[9px] text-on-surface-variant mt-1 font-semibold">Client Interface &amp; Dashboards</p>
                          </div>

                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 text-center hover:border-secondary/40 transition-colors duration-200">
                            <span className="material-symbols-outlined text-secondary text-3xl">code</span>
                            <h4 className="font-bold text-xs text-white mt-2 font-label-md">Python Backend</h4>
                            <p className="text-[9px] text-on-surface-variant mt-1 font-semibold">LangChain / LLM Workflows</p>
                          </div>

                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 text-center hover:border-warning/40 transition-colors duration-200">
                            <span className="material-symbols-outlined text-warning text-3xl">auto_awesome</span>
                            <h4 className="font-bold text-xs text-white mt-2 font-label-md">OpenAI / Claude</h4>
                            <p className="text-[9px] text-on-surface-variant mt-1 font-semibold">Semantic Reviewer Engine</p>
                          </div>

                          <div className="bg-background/40 border border-outline-variant/20 rounded-xl p-4 text-center hover:border-primary/40 transition-colors duration-200">
                            <span className="material-symbols-outlined text-primary text-3xl">database</span>
                            <h4 className="font-bold text-xs text-white mt-2 font-label-md">Pinecone DB</h4>
                            <p className="text-[9px] text-on-surface-variant mt-1 font-semibold">Vector Embedding Store</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <HRMobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}