import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SpecularButton from "../components/ui/SpecularButton";
import LineSidebar from "../components/ui/LineSidebar";
import MagicBento from "../components/ui/MagicBento";
import PillNav from "../components/ui/PillNav";
import Sidebar from "../components/Sidebar";
import MobileHeader from "../components/MobileHeader";
import MobileNav from "../components/MobileNav";
import WelcomeHeader from "../components/WelcomeHeader";
import ActionableTasks from "../components/ActionableTasks";
import SkillMatrix from "../components/SkillMatrix";
import DocumentTrack from "../components/DocumentTrack";
import MyDocuments from "../components/MyDocuments";

// Import profile-related components
import CurrentRole from "../components/CurrentRole";
import Milestones from "../components/Milestones";

import {
  tasks,
  skills,
  careerProfile,
  documentTrack as initialDocTrack,
  folders,
} from "../data/dashboardData";
import { employeeChatPresets } from "../data/clauseguardData";

const FOLDER_FILES = {
  "Contracts": [
    { name: "NDA_Template_v2.1.pdf", size: "1.2 MB", type: "PDF Document", description: "Standard non-disclosure agreement template required for all external vendor engagements.", lastUpdated: "Mar 14, 2026", chapters: 3 },
    { name: "Master_Service_Agreement.pdf", size: "3.8 MB", type: "PDF Document", description: "Master services framework contract governing client-side deliverables and intellectual property.", lastUpdated: "Feb 22, 2026", chapters: 15 }
  ],
  "Employment": [
    { name: "Employee_Handbook_v4.0.pdf", size: "2.4 MB", type: "PDF Document", description: "Comprehensive corporate guidelines, code of conduct, and overview of basic workspace rules.", lastUpdated: "Jan 10, 2026", chapters: 12 },
    { name: "Code_of_Conduct_2026.pdf", size: "1.5 MB", type: "PDF Document", description: "Corporate compliance rules regarding ethical conduct, conflicts of interest, and standard procedures.", lastUpdated: "Jan 15, 2026", chapters: 5 }
  ],
  "Compliance": [
    { name: "Medical_Leave_Guidelines_2026.pdf", size: "840 KB", type: "PDF Document", description: "Detailed policies on medical absence, sick leaves, medical practitioner certification rules.", lastUpdated: "Jun 28, 2026", chapters: 4 }
  ],
  "Expenses": [
    { name: "Travel_Allowance_Rules_Q3.pdf", size: "1.1 MB", type: "PDF Document", description: "Reimbursement rules for local and international business travel, taxi fares, lodging caps.", lastUpdated: "Aug 02, 2026", chapters: 8 },
    { name: "Enterprise_Expense_Limits.pdf", size: "450 KB", type: "PDF Document", description: "Limits on entertainment, food vouchers, client dinners, and manager authorization processes.", lastUpdated: "May 14, 2026", chapters: 6 }
  ]
};

const mockSubmissions = [
  {
    id: 101,
    docType: "Expense Claim",
    title: "Client Travel Reimbursement",
    amount: "₹4,800",
    date: "Aug 18, 2026",
    status: "Approved",
    severity: "Low",
    citation: "Travel_Allowance_Rules_Q3.pdf",
    explanation: "The submitted travel reimbursement matches the capped rates for domestic airfare and hotel stay, and the claim was within the permitted business trip allowance.",
    recommendedAction: "No further action required. Processed as approved.",
    submittedByName: "Alex Martin",
    workflowHistory: JSON.stringify([
      { timestamp: "Aug 18, 2026 09:12 AM", message: "AI engine checked Travel_Allowance_Rules_Q3 against submitted receipt totals." },
      { timestamp: "Aug 18, 2026 09:14 AM", message: "Claim matched policy caps; approval recommended." }
    ])
  },
  {
    id: 102,
    docType: "Sick Leave Request",
    title: "Medical Leave for 3 Days",
    amount: "3 Days",
    date: "Aug 10, 2026",
    status: "Needs Review",
    severity: "Medium",
    citation: "Medical_Leave_Guidelines_2026.pdf",
    explanation: "The leave duration exceeds the standard self-attested threshold, so the policy requires supporting medical documentation before final approval.",
    recommendedAction: "Upload physician certificate and resubmit for final review.",
    submittedByName: "Alex Martin",
    workflowHistory: JSON.stringify([
      { timestamp: "Aug 10, 2026 03:40 PM", message: "Leave request submitted with 3-day duration." },
      { timestamp: "Aug 10, 2026 04:00 PM", message: "Medical leave policy triggered document verification because duration exceeded the two-day automatic approval window." }
    ])
  },
  {
    id: 103,
    docType: "Expense Claim",
    title: "Team Lunch & Client Dinner",
    amount: "₹2,250",
    date: "Jul 29, 2026",
    status: "Flagged",
    severity: "High",
    citation: "Enterprise_Expense_Limits.pdf",
    explanation: "The claim includes a client dinner expense above the standard per-person cap and exceeds the manager approval threshold without a documented exception.",
    recommendedAction: "Reduce the claim to the approved cap or attach a valid manager exception before resubmission.",
    submittedByName: "Alex Martin",
    workflowHistory: JSON.stringify([
      { timestamp: "Jul 29, 2026 09:18 AM", message: "Expense upload matched the dining category totals." },
      { timestamp: "Jul 29, 2026 09:22 AM", message: "Policy check flagged overspend relative to Enterprise_Expense_Limits approval thresholds." }
    ])
  },
  {
    id: 104,
    docType: "Casual Leave Request",
    title: "Family Event Leave",
    amount: "2 Days",
    date: "Jul 02, 2026",
    status: "Approved",
    severity: "Low",
    citation: "Employee_Handbook_v4.0.pdf",
    explanation: "The request falls within the allowed casual leave entitlement and does not exceed the annual allocation for the current service period.",
    recommendedAction: "Approved under standard annual casual leave limits.",
    submittedByName: "Alex Martin",
    workflowHistory: JSON.stringify([
      { timestamp: "Jul 02, 2026 08:50 AM", message: "Casual leave submitted during a normal leave window." },
      { timestamp: "Jul 02, 2026 09:05 AM", message: "Employee_Handbook_v4.0 supported the approved leave allocation." }
    ])
  },
  {
    id: 105,
    docType: "Expense Claim",
    title: "Conference Travel Accommodation",
    amount: "₹8,950",
    date: "Jun 21, 2026",
    status: "Flagged",
    severity: "Medium",
    citation: "Travel_Allowance_Rules_Q3.pdf",
    explanation: "The accommodation costs exceed the allowed cap for a local conference trip unless stronger justification is provided or the expense was booked under an approved vendor rate.",
    recommendedAction: "Clarify the event purpose and provide vendor invoice details or reduce to approved cap.",
    submittedByName: "Alex Martin",
    workflowHistory: JSON.stringify([
      { timestamp: "Jun 21, 2026 10:55 AM", message: "Travel claim entered for conference-related accommodation." },
      { timestamp: "Jun 21, 2026 11:08 AM", message: "Travel_Allowance_Rules_Q3 flagged lodging above the standard allowance for a short local event." }
    ])
  },
  {
    id: 106,
    docType: "Expense Claim",
    title: "Software Licensing Invoice",
    amount: "₹1,600",
    date: "May 14, 2026",
    status: "Approved",
    severity: "Low",
    citation: "Master_Service_Agreement.pdf",
    explanation: "The invoice aligns with the approved software procurement workflow and falls within the pre-approved vendor services scope defined in the master agreement.",
    recommendedAction: "Approved and logged as a valid operating expense.",
    submittedByName: "Alex Martin",
    workflowHistory: JSON.stringify([
      { timestamp: "May 14, 2026 02:10 PM", message: "Software expense claims matched approved line items in the master services agreement." },
      { timestamp: "May 14, 2026 02:16 PM", message: "Approval auto-granted after vendor review passed." }
    ])
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [selectedFolder, setSelectedFolder] = useState("Compliance");
  const [policies, setPolicies] = useState([]);
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true);
  const [reviewInputType, setReviewInputType] = useState("Expense Claim");
  const [reviewInputAmount, setReviewInputAmount] = useState("");
  const [reviewInputDesc, setReviewInputDesc] = useState("");
  const [leaveStartDate, setLeaveStartDate] = useState("");
  const [submissionDate, setSubmissionDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isReviewing, setIsReviewing] = useState(false);
  const [isReReviewing, setIsReReviewing] = useState(false);

  const [certificateFile, setCertificateFile] = useState(null);
  const [certificateUploaded, setCertificateUploaded] = useState(false);

  // Retrieve user session info
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : { username: "Employee", role: "Employee", title: "Senior Developer", department: "Engineering" };
  });

  const dynamicUser = {
    name: currentUser.username,
    role: currentUser.title || currentUser.role,
    status: "Compliant",
    leaveBalance: "14 Days",
    expenseStatus: "Active"
  };

  // AI Chat Assistant State
  const [chatHistory, setChatHistory] = useState([
    { sender: "ai", text: "Hello! I am your Employee AI Compliance Assistant. I can help answer questions regarding leaves, expense limits, or task completions grounded in our corporate policy database. What would you like to know?", citation: "" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Load data on mount
  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoadingSubmissions(true);

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/reviews",
          {
            headers: {
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
          }
        );

        if (res.ok) {
          const data = await res.json();

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
                  : item.status === "FLAGGED"
                    ? "Flagged"
                    : "Needs Review",
            severity: item.severity || "Medium",
            citation: item.citations?.[0]?.section || "",
            description: item.submission_data?.description || "",
            fileUrl: item.file_url || "",
            explanation: item.explanation || "",
            recommendedAction: item.recommended_action || "",
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

    const fetchPolicies = async () => {
      setIsLoadingPolicies(true);

      try {
        const res = await fetch(
          "http://127.0.0.1:8000/api/organizations/1/policies"
        );

        if (res.ok) {
          const data = await res.json();
          setPolicies(data.policies || []);
        }
      } catch (err) {
        console.error("Error loading policies:", err);
      } finally {
        setIsLoadingPolicies(false);
      }
    };

    fetchSubmissions();
    fetchPolicies();
  }, []);

  const handleUpload = (taskId) => {
    if (taskId === "medical-cert") {
      setActiveTab("compliance");
      const sickLeaveSub = submissions.find(s => s.docType === "Sick Leave Request" || s.docType === "Sick Leave");
      if (sickLeaveSub) {
        setSelectedSub(sickLeaveSub);
      }
    }
  };

  const handleOpenFolder = (folderName) => {
    console.log("Open folder:", folderName);
    setSelectedFolder(folderName);
    setSelectedFileIdx(0);
    setActiveTab("library");
  };

  const handleNewSubmission = async (e) => {
    e.preventDefault();

    if (!reviewInputAmount || !reviewInputDesc || !leaveStartDate) return;
    if (Number(reviewInputAmount) <= 0) return;

    setIsReviewing(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          organization_id: 1,
          employee_id: currentUser.id || 2,
          leave_type: reviewInputType,
          leave_days: Number(reviewInputAmount),
          submission_date: submissionDate,
          leave_start_date: leaveStartDate,
          description: reviewInputDesc
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || "Review request failed.");
      }

      const result = await res.json();

      // Use the REAL database submission ID returned by the backend.
      const submissionId = result.submission_id;

      const newSub = {
        id: submissionId,
        docType: reviewInputType,
        title: reviewInputDesc,
        amount: `${reviewInputAmount} Days`,
        date: submissionDate,
        status:
          result.status === "NEEDS_REVIEW"
            ? "Needs Review"
            : result.status === "FLAGGED"
              ? "Flagged"
              : "Approved",
        severity: result.severity,
        citation: `${result.policy_name} v${result.policy_version}`,
        explanation: result.reasons.join("\n"),
        recommendedAction: result.recommended_action
      };

      setSubmissions(prev => [newSub, ...prev]);
      setSelectedSub(newSub);

      // If an attachment was selected, upload it to the
      // newly-created database submission.
      if (certificateFile) {
        try {
          await handleUploadCertificate(submissionId, certificateFile);
        } catch (uploadError) {
          console.error("Attachment upload failed:", uploadError);
        }
      }

      setReviewInputAmount("");
      setReviewInputDesc("");
      setLeaveStartDate("");
      setCertificateFile(null);
      setCertificateUploaded(false);

    } catch (err) {
      console.error("New submission error:", err);
    } finally {
      setIsReviewing(false);
    }
  };

  const handleUploadCertificate = async (subId, file = certificateFile) => {
    if (!file) {
      return;
    }

    setIsReReviewing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(
        `http://127.0.0.1:8000/api/certificates/${subId}`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: formData
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(
          errorData?.detail || "Certificate upload failed."
        );
      }

      const result = await res.json();

      const review = result.review;

      const updatedSub = {
        ...selectedSub,
        status:
          review.status === "NEEDS_REVIEW"
            ? "Needs Review"
            : review.status === "FLAGGED"
              ? "Flagged"
              : "Approved",
        severity: review.severity,
        citation: `${review.policy_name} v${review.policy_version}`,
        explanation: review.reasons.join("\n"),
        recommendedAction: review.recommended_action
      };

      setSubmissions(prev =>
        prev.map(s => s.id === subId ? updatedSub : s)
      );

      setSelectedSub(updatedSub);
      setCertificateFile(null);
      setCertificateUploaded(true);

    } catch (err) {
      console.error("Certificate upload/re-review error:", err);
    } finally {
      setIsReReviewing(false);
    }
  };

  const handleSendMessage = async (e, customText = null) => {
    if (e) e.preventDefault();
    const queryText = customText || chatInput;
    if (!queryText.trim()) return;

    setChatHistory(prev => [...prev, { sender: "user", text: queryText, citation: "" }]);
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
      setChatHistory(prev => [...prev, { sender: "ai", text: "Sorry, I encountered an issue connecting to the compliance service.", citation: "Service Offline" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const user = dynamicUser;
  const recentSubmissions = submissions.slice(0, 4);

  const handleLibraryUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("name", file.name.replace(/\.[^/.]+$/, ""));
      formData.append("version", "1.0");

      const res = await fetch(
        "http://127.0.0.1:8000/api/organizations/1/policies?uploaded_by=2",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.detail || "Policy upload failed.");
      }

      const result = await res.json();

      console.log("Policy uploaded:", result);

      // Refresh the policy library immediately.
      const policiesRes = await fetch(
        "http://127.0.0.1:8000/api/organizations/1/policies"
      );

      if (policiesRes.ok) {
        const data = await policiesRes.json();
        setPolicies(data.policies || []);
        setSelectedFileIdx(0);
      }
    } catch (err) {
      console.error("Policy upload error:", err);
      alert(err.message);
    } finally {
      event.target.value = "";
    }
  };

  const handleOpenDocument = (file) => {
    const pdfUrl = file?.url || "";
    if (pdfUrl) {
      window.open(pdfUrl, "_blank", "noopener,noreferrer");
      return;
    }
    alert("This is a UI-ready placeholder. When the backend serves real PDFs, this button will open the file directly.");
  };

  return (
    <div className="bg-background text-on-surface min-h-screen font-body-md text-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} />
      <MobileHeader />

      <main className="flex-1 md:ml-[280px] pb-28 md:pb-8 w-full max-w-[1200px] mx-auto pt-6 px-margin-mobile md:px-container-padding flex flex-col gap-stack-lg">
        {activeTab === "dashboard" && (
          <>
            <div className="hidden md:flex justify-end items-center mb-6 border-b border-outline-variant/10 pb-4">
              <PillNav
                logo={null}
                items={[
                  { label: 'Employee Dashboard', href: '/' },
                  { label: 'HR Compliance Portal', href: '/hr' }
                ]}
                activeHref="/"
                baseColor="#15121a"
                pillColor="#1e293b"
                hoveredPillTextColor="#10b981"
                pillTextColor="#c4c4c4"
              />
            </div>

            <WelcomeHeader user={user} />

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-gutter">
              <div className="xl:col-span-8 flex flex-col gap-gutter">
                <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-primary">New Submission</p>
                      <h2 className="text-headline-md font-headline-md text-on-surface mt-1">Submit a policy check</h2>
                    </div>
                    <span className="material-symbols-outlined text-primary text-3xl">add_circle</span>
                  </div>

                  <form onSubmit={handleNewSubmission} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-label-sm text-on-surface-variant block mb-1">Document Type</label>
                        <select value={reviewInputType} onChange={(e) => setReviewInputType(e.target.value)} className="w-full bg-background border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:border-primary outline-none">
                          <option value="Expense Claim">Expense Claim</option>
                          <option value="Sick Leave Request">Sick Leave Request</option>
                          <option value="Casual Leave Request">Casual Leave Request</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-label-sm text-on-surface-variant block mb-1">{reviewInputType === "Expense Claim" ? "Claim Amount (₹)" : "Days"}</label>
                        <input type="number" min="1" required value={reviewInputAmount} onChange={(e) => setReviewInputAmount(e.target.value)} placeholder={reviewInputType === "Expense Claim" ? "e.g. 2500" : "e.g. 3"} className="w-full bg-background border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:border-primary outline-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-label-sm text-on-surface-variant block mb-1">Description</label>
                      <textarea rows="3" required value={reviewInputDesc} onChange={(e) => setReviewInputDesc(e.target.value)} placeholder={reviewInputType === "Expense Claim" ? "Describe the business expense and reason for the claim..." : "Describe the leave reason and dates..."} className="w-full bg-background border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:border-primary outline-none resize-none" />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button type="submit" disabled={isReviewing || !reviewInputAmount || !reviewInputDesc} className="flex-1 py-2.5 bg-primary text-background font-bold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-50">
                        {isReviewing ? "Running audit..." : "Submit to AI Reviewer"}
                      </button>
                      <button type="button" onClick={() => setActiveTab("compliance")} className="sm:w-auto px-4 py-2.5 border border-outline-variant rounded-lg text-sm text-on-surface hover:border-primary hover:text-primary transition-colors">
                        View All Submissions
                      </button>
                    </div>
                  </form>
                </section>

                <ActionableTasks tasks={tasks} onUpload={handleUpload} />
              </div>

              <div className="xl:col-span-4 flex flex-col gap-gutter">
                <section className="glass-panel rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-label-sm text-on-surface-variant uppercase tracking-wider text-[10px] font-bold">Recent Submissions</h3>
                    <button type="button" onClick={() => setActiveTab("compliance")} className="text-[10px] font-bold text-primary hover:text-primary/90">View all</button>
                  </div>
                  <div className="space-y-2">
                    {isLoadingSubmissions ? (
                      <div className="text-center py-6 text-on-surface-variant text-sm">
                        Loading submissions...
                      </div>
                    ) : recentSubmissions.length === 0 ? (
                      <div className="text-center py-6 text-on-surface-variant text-sm">
                        No submissions found.
                      </div>
                    ) : (
                      recentSubmissions.map((sub) => (
                        <button
                          key={sub.id}
                          type="button"
                          onClick={() => {
                            setSelectedSub(sub);
                            setActiveTab("compliance");
                          }}
                          className="w-full text-left p-3 rounded-lg border border-outline-variant/20 bg-background/30 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-xs font-bold text-on-surface">
                                {sub.title}
                              </div>

                              <div className="text-[10px] text-on-surface-variant mt-0.5">
                                {sub.docType} • {sub.date}
                              </div>
                            </div>

                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-bold ${sub.status === "Approved"
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
                        </button>
                      ))
                    )}
                  </div>
                </section>
                <DocumentTrack referenceId={initialDocTrack.referenceId} steps={initialDocTrack.steps} />
              </div>
            </div>
          </>
        )}

        {activeTab === "compliance" && (
          <div className="space-y-6">
            <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-4xl">gavel</span>
                AI Document Compliance Reviewer
              </h1>
              <p className="text-on-surface-variant text-body-md max-w-2xl">Submit claims or leave requests and let ClauseGuard assess them against the active policy set with grounded citations.</p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
              <div className="lg:col-span-5 flex flex-col gap-6">
                <div className="glass-panel rounded-xl p-6 shadow-ambient">
                  <h2 className="text-headline-md font-headline-md text-on-surface mb-4 flex items-center gap-2"><span className="material-symbols-outlined text-primary">add_circle</span> New Document Submission</h2>
                  <form onSubmit={handleNewSubmission} className="space-y-4">
                    <div>
                      <label className="text-label-sm text-on-surface-variant block mb-1">Document Type</label>
                      <select value={reviewInputType} onChange={(e) => setReviewInputType(e.target.value)} className="w-full bg-background border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:border-primary outline-none">
                        <option value="Expense Claim">Expense Claim</option>
                        <option value="ANNUAL LEAVE">Annual Leave</option>
                        <option value="Sick Leave Request">Sick Leave Request</option>
                        <option value="Casual Leave Request">Casual Leave Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-label-sm text-on-surface-variant block mb-1">{reviewInputType === "Expense Claim" ? "Claim Amount (in ₹)" : "Leave Duration (in Days)"}</label>
                      <input type="number" required min="1" placeholder={reviewInputType === "Expense Claim" ? "e.g. 2500" : "e.g. 3"} value={reviewInputAmount} onChange={(e) => setReviewInputAmount(e.target.value)} className="w-full bg-background border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:border-primary outline-none" />
                    </div>
                    <div>
                      <label className="text-label-sm text-on-surface-variant block mb-1">
                        Leave Start Date
                      </label>

                      <input
                        type="date"
                        required={reviewInputType !== "Expense Claim"}
                        value={leaveStartDate}
                        onChange={(e) => setLeaveStartDate(e.target.value)}
                        className="w-full bg-background border border-outline-variant rounded-lg px-3.5 py-2.5 text-sm text-on-surface focus:border-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-label-sm text-on-surface-variant block mb-1">Description / Reason</label>
                      <textarea rows="3" required placeholder={reviewInputType === "Expense Claim" ? "Client lunch at Marriott hotel..." : "Family health issue / rest required..."} value={reviewInputDesc} onChange={(e) => setReviewInputDesc(e.target.value)} className="w-full bg-background border border-outline-variant rounded-lg p-3 text-sm text-on-surface focus:border-primary outline-none resize-none" />
                    </div>
                    <label
                      htmlFor="submission-attachment"
                      className="border border-dashed border-outline-variant/30 rounded-xl p-4 flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-primary transition-colors bg-background/20"
                    >
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                        upload_file
                      </span>

                      <span className="text-xs text-on-surface">
                        {certificateFile
                          ? certificateFile.name
                          : "Attach receipt or certificate"}
                      </span>

                      <span className="text-[10px] text-on-surface-variant">
                        PDF, PNG, JPG up to 5MB
                      </span>

                      <input
                        id="submission-attachment"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];

                          if (!file) return;

                          if (file.size > 5 * 1024 * 1024) {
                            alert("File must be 5MB or smaller.");
                            e.target.value = "";
                            return;
                          }

                          setCertificateFile(file);
                        }}
                      />
                    </label>
                    <button type="submit" disabled={isReviewing || !reviewInputAmount || !reviewInputDesc} className="w-full py-2.5 bg-primary text-background font-bold text-sm rounded-lg hover:brightness-110 transition-all disabled:opacity-50">{isReviewing ? "Running compliance audit..." : "Submit to AI Reviewer"}</button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col gap-6">
                <div className="glass-panel rounded-xl p-6 shadow-ambient min-h-[380px]">
                  {isReviewing ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-10 text-center animate-pulse">
                      <div className="relative w-16 h-16 flex items-center justify-center"><div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin"></div><span className="material-symbols-outlined text-2xl text-primary">security_update_good</span></div>
                      <div><h3 className="text-sm font-bold text-on-surface">Compliance pipeline running...</h3><p className="text-xs text-on-surface-variant mt-1">Retrieving policy context, checking expenses and leave rules...</p></div>
                    </div>
                  ) : selectedSub ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start border-b border-outline-variant/20 pb-3"><div><span className="text-label-sm text-primary uppercase font-bold tracking-wider">{selectedSub.docType}</span><h3 className="text-lg font-bold text-on-surface mt-1">{selectedSub.title}</h3></div><span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedSub.status === "Approved" ? "bg-primary/20 text-primary border-primary/30" : selectedSub.status === "Flagged" ? "bg-error/20 text-error border-error/30" : "bg-warning/20 text-warning border-warning/30"}`}>{selectedSub.status}</span></div>
                      <div className="grid grid-cols-2 gap-4 text-xs font-label-sm">
                        <div><span className="text-on-surface-variant block">Submitted value</span><span className="text-on-surface font-bold text-sm">{selectedSub.amount}</span></div>
                        <div><span className="text-on-surface-variant block">Date submitted</span><span className="text-on-surface">{selectedSub.date}</span></div>
                      </div>
                      {selectedSub.description && (
                        <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 text-xs">
                          <strong className="text-on-surface block mb-1">
                            Submission description:
                          </strong>
                          <p className="text-on-surface-variant whitespace-pre-line">
                            {selectedSub.description}
                          </p>
                        </div>
                      )}
                      {selectedSub.fileUrl && !selectedSub.fileUrl.startsWith("api://") && (
                        <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 text-xs">
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
                      <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 text-xs leading-relaxed text-on-surface-variant space-y-2">

                        <div>
                          <strong className="text-on-surface block mb-1">
                            Grounded policy citation:
                          </strong>
                          <span className="text-primary font-bold">
                            {selectedSub.citation}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-outline-variant/25">
                          <strong className="text-on-surface block mb-1">
                            Policy evidence:
                          </strong>
                          <p className="text-on-surface-variant whitespace-pre-line">
                            {selectedSub.citationText || "No policy evidence available."}
                          </p>
                        </div>

                        <div>
                          <strong className="text-on-surface block mb-1">
                            AI logic & explanation:
                          </strong>
                          <p>{selectedSub.explanation}</p>
                        </div>

                        {selectedSub.recommendedAction && (
                          <div className="pt-2 border-t border-outline-variant/25">
                            <strong className="text-on-surface block mb-0.5">
                              Recommended action:
                            </strong>
                            <p className="font-semibold text-on-surface">
                              {selectedSub.recommendedAction}
                            </p>
                          </div>
                        )}

                      </div>
                      {selectedSub.status === "Needs Review" &&
                        selectedSub.title?.toUpperCase() === "SICK LEAVE" && (
                          <div className="border-t border-outline-variant/20 pt-4">
                            {isReReviewing ? (
                              <div className="flex items-center justify-center gap-2 py-2 text-xs text-primary font-bold">
                                <span className="material-symbols-outlined text-[18px] animate-spin">
                                  autorenew
                                </span>
                                Analyzing uploaded certificate...
                              </div>
                            ) : certificateUploaded ? (
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-xs text-primary font-bold">
                                  <span className="material-symbols-outlined text-[18px]">
                                    verified
                                  </span>
                                  Physician certificate uploaded
                                </div>

                                <p className="text-[10px] text-on-surface-variant">
                                  Certificate uploaded successfully and the submission has been
                                  re-reviewed.
                                </p>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-3">
                                <p className="text-xs text-warning leading-relaxed font-semibold">
                                  Compliance holding trigger: Sick leave duration exceeds 2 days
                                  and requires doctor validation.
                                </p>

                                <button
                                  type="button"
                                  onClick={() =>
                                    document.getElementById("certificate-upload").click()
                                  }
                                  className="w-full py-2 bg-secondary text-background font-bold rounded-lg text-xs hover:brightness-110 transition-colors flex items-center justify-center gap-1.5"
                                >
                                  <span className="material-symbols-outlined text-[16px]">
                                    upload
                                  </span>
                                  Upload physician certificate
                                </button>

                                <input
                                  id="certificate-upload"
                                  type="file"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];

                                    if (file) {
                                      setCertificateFile(file);
                                      handleUploadCertificate(selectedSub.id, file);
                                    }

                                    e.target.value = "";
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}
                    </div>
                  ) : <div className="flex-1 flex flex-col items-center justify-center text-center text-on-surface-variant py-8"><span className="material-symbols-outlined text-4xl mb-2 opacity-45">info</span>Select a submission below to inspect details.</div>}
                </div>

                <div className="glass-panel rounded-xl p-5">
                  <h3 className="text-label-sm text-on-surface-variant/70 font-bold uppercase tracking-wider text-[10px] mb-3 font-label-md">Your recent submissions</h3>
                  <div className="space-y-2">
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
                          type="button"
                          onClick={() => setSelectedSub(sub)}
                          className={`w-full text-left p-3 rounded-lg border text-xs flex justify-between items-center transition-colors ${selectedSub?.id === sub.id
                            ? "bg-primary/5 border-primary"
                            : "bg-background/40 border-outline-variant/20 hover:bg-white/5"
                            }`}
                        >
                          <div>
                            <div className="font-bold text-on-surface">{sub.title}</div>
                            <div className="text-[10px] text-on-surface-variant mt-0.5">
                              {sub.docType} • {sub.amount}
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
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="space-y-6">
            <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-4xl">folder_open</span>Document Library</h1>
                  <p className="text-on-surface-variant text-body-md max-w-2xl">Browse official policy documents and upload new files to the grounding set.</p>
                </div>
              </div>
            </section>

            <div className="glass-panel rounded-xl p-6">
              <h3 className="text-headline-md font-headline-md text-white mb-6">Grounded file index explorer — <span className="text-primary">{selectedFolder} folder</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter items-center min-h-[300px]">
                <div className="md:col-span-5 h-[280px] relative overflow-hidden border-r border-outline-variant/20 pr-4">
                  <LineSidebar
                    key={selectedFolder}
                    items={
                      isLoadingPolicies
                        ? ["Loading policies..."]
                        : policies.length > 0
                          ? policies.map((policy) => `${policy.name} v${policy.version}`)
                          : ["No policies found"]
                    }
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
                    onItemClick={(index) => setSelectedFileIdx(index)}
                  />
                </div>

                <div className="md:col-span-7 pl-4 space-y-4">
                  {isLoadingPolicies ? (
                    <div className="text-center py-8 text-on-surface-variant text-sm">
                      Loading policies...
                    </div>
                  ) : policies.length === 0 ? (
                    <div className="text-center py-8 text-on-surface-variant text-sm">
                      No policies found.
                    </div>
                  ) : (
                    policies.map((policy, idx) => idx === selectedFileIdx && (
                      <div key={policy.id} className="space-y-4">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="text-base font-bold text-white flex items-center gap-2">
                              <span className="material-symbols-outlined text-primary">
                                description
                              </span>
                              {policy.name}
                            </h4>

                            <p className="text-[10px] text-on-surface-variant/80 uppercase font-semibold mt-1">
                              {policy.document_type} • Version {policy.version}
                            </p>
                          </div>

                          {policy.file_url && (
                            <button
                              type="button"
                              onClick={() =>
                                window.open(
                                  `http://127.0.0.1:8000/${policy.file_url
                                    .replace(/^backend[\\/]+uploads[\\/]+/, "uploads/")
                                    .replace(/^test_data[\\/]+/, "test-data/")
                                    .replace(/\\/g, "/")}`,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                              className="px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/10 text-primary text-[10px] font-bold"
                            >
                              View
                            </button>
                          )}
                        </div>

                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          {policy.name} — Version {policy.version}
                        </p>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10 text-[10px] font-label-sm text-on-surface-variant">
                          <div>
                            <span className="block opacity-60">Status</span>
                            <span className="font-bold text-white">
                              {policy.is_active ? "Active" : "Archived"}
                            </span>
                          </div>

                          <div>
                            <span className="block opacity-60">Uploaded</span>
                            <span className="font-bold text-white">
                              {policy.created_at
                                ? new Date(policy.created_at).toLocaleDateString()
                                : "—"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="space-y-6">
            <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 font-headline-lg">My Profile</h1>
              <p className="text-body-lg text-on-surface-variant">Career status, compliance record, and technical readiness at a glance.</p>
            </section>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
              <div className="xl:col-span-1 flex flex-col gap-6">
                <CurrentRole user={user} />
              </div>

              <div className="xl:col-span-2 flex flex-col gap-6">
                <section className="glass-panel reflective-card rounded-xl p-6">
                  <div className="text-label-md font-label-md text-on-surface-variant mb-2 uppercase tracking-wider text-[10px]">
                    Career Snapshot
                  </div>
                  <h3 className="text-lg font-headline-md text-on-surface font-bold mb-5">Performance & compliance overview</h3>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { label: "Tenure", value: careerProfile.tenure },
                      { label: "Projects", value: careerProfile.projectsContributed },
                      { label: "Goal Completion", value: `${careerProfile.goalCompletionRate}%` },
                      { label: "Compliance", value: careerProfile.complianceRating },
                      { label: "Submissions", value: careerProfile.submissionsProcessed },
                      { label: "Approval Rate", value: `${careerProfile.submissionApprovalRate}%` },
                      { label: "Peer Feedback", value: careerProfile.peerFeedbackRating },
                      { label: "Current Focus", value: "Risk Ops" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-outline-variant/20 bg-background/40 p-3">
                        <div className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">{stat.label}</div>
                        <div className="mt-2 text-base font-bold text-on-surface">{stat.value}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <div className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-3">Skill readiness</div>
                    <div className="space-y-3">
                      {skills.map((skill) => (
                        <div key={skill.label}>
                          <div className="flex items-center justify-between text-[11px] text-on-surface-variant mb-1">
                            <span>{skill.label}</span>
                            <span className="font-bold text-on-surface">{skill.value}%</span>
                          </div>
                          <div className="h-2.5 bg-background/70 rounded-full overflow-hidden border border-outline-variant/20">
                            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${skill.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <div className="grid grid-cols-1">
              <Milestones />
            </div>

            <div className="grid grid-cols-1">
              <SkillMatrix skills={skills} />
            </div>
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6">
            <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
              <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 flex items-center gap-2"><span className="material-symbols-outlined text-primary text-4xl">auto_awesome</span>Policy Assistant</h1>
              <p className="text-on-surface-variant text-body-md max-w-2xl">Ask policy questions and use grounded document context to understand leave, travel, and expense rules.</p>
            </section>

            <div className="mx-auto w-full max-w-4xl">
              <div className="glass-panel rounded-2xl p-6 shadow-ambient flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {employeeChatPresets.map((preset, idx) => (
                    <button key={idx} type="button" onClick={() => handleSendMessage(null, preset.q)} className="text-left text-xs bg-background/40 hover:bg-white/5 border border-outline-variant/25 rounded-lg px-3 py-2 text-on-surface hover:text-primary transition-all font-semibold">
                      “{preset.q}”
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto max-h-[360px] flex flex-col gap-4 pr-2">
                  {chatHistory.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}>
                      <span className="text-[9px] text-on-surface-variant/50 font-label-sm mb-1">{msg.sender === "user" ? "You" : "ClauseGuard RAG Engine"}</span>
                      <div className={`p-3 rounded-lg text-xs leading-relaxed ${msg.sender === "user" ? "bg-primary/20 text-primary border border-primary/25 rounded-tr-none" : "bg-surface-container-high border border-outline-variant/30 text-on-surface rounded-tl-none"}`}>
                        {msg.text}
                      </div>
                      {msg.citation && <span className="text-[8px] font-label-sm bg-background border border-outline-variant/20 text-primary px-1.5 py-0.5 rounded mt-1.5 font-bold uppercase">Citing: {msg.citation}</span>}
                    </div>
                  ))}
                  {isTyping && <div className="self-start text-xs text-primary font-bold animate-pulse flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] animate-spin">autorenew</span>Querying policy vectors...</div>}
                </div>

                <form onSubmit={(e) => handleSendMessage(e)} className="flex gap-2 border-t border-outline-variant/20 pt-4">
                  <input type="text" placeholder="Ask a question about leaves, travel, or expense rules..." value={chatInput} disabled={isTyping} onChange={(e) => setChatInput(e.target.value)} className="flex-1 bg-background border border-outline-variant/60 rounded-lg px-4 py-2.5 text-xs text-on-surface focus:border-primary outline-none" />
                  <button type="button" aria-label="Voice input" onClick={() => console.log("Voice input placeholder")} className="w-11 h-11 rounded-lg border border-outline-variant/40 bg-background/40 hover:border-primary/60 text-on-surface flex items-center justify-center"><span className="material-symbols-outlined text-[18px]">mic</span></button>
                  <label aria-label="Attach document" className="w-11 h-11 rounded-lg border border-outline-variant/40 bg-background/40 hover:border-primary/60 text-on-surface flex items-center justify-center cursor-pointer"><span className="material-symbols-outlined text-[18px]">attach_file</span><input type="file" className="hidden" onChange={() => console.log("Document attach placeholder")} /></label>
                  <button type="submit" disabled={isTyping || !chatInput.trim()} className="bg-primary text-background font-bold px-4 py-2.5 rounded-lg text-xs hover:brightness-110 transition-colors flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[18px]">send</span></button>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}