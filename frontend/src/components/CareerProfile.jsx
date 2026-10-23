import SkillMatrix from "./SkillMatrix";

const metricCards = [
  { key: "tenure", label: "Tenure in Current Role", icon: "schedule" },
  { key: "projectsContributed", label: "Projects Contributed", icon: "dataset" },
  { key: "goalCompletionRate", label: "Goal Completion Rate", suffix: "%", icon: "task_alt" },
  { key: "complianceRating", label: "Compliance Record", icon: "verified_user" },
  { key: "submissionsProcessed", label: "Submissions Processed", icon: "fact_check" },
  { key: "submissionApprovalRate", label: "Approval Rate", suffix: "%", icon: "check_circle" },
  { key: "peerFeedbackRating", label: "Peer Feedback Rating", icon: "star" },
];

export default function CareerProfile({ profile, skills }) {
  return (
    <div className="space-y-6">
      <section className="glass-panel rounded-2xl p-6 border-l-4 border-primary reflective-card">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <div className="text-label-md font-label-md text-primary mb-1 uppercase tracking-wider text-[10px]">
              Portable Record
            </div>
            <h1 className="text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface mb-2 font-headline-lg">
              Career Profile
            </h1>
            <p className="text-body-md text-on-surface-variant max-w-2xl">
              A concise view of role tenure, delivery output, and demonstrated proficiency.
            </p>
          </div>
          <button
            type="button"
            onClick={() => alert("Summary export preview is not connected yet.")}
            className="shrink-0 inline-flex items-center justify-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
          >
            <span className="material-symbols-outlined text-[17px]">picture_as_pdf</span>
            Export as PDF
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-gutter">
        {metricCards.map((metric) => (
          <section key={metric.key} className="glass-panel rounded-xl p-5 shadow-ambient min-h-[126px] flex flex-col justify-between">
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                {metric.label}
              </span>
              <span className="material-symbols-outlined text-primary text-[19px]">{metric.icon}</span>
            </div>
            <div className="text-2xl font-bold text-on-surface">
              {profile[metric.key]}{metric.suffix ?? ""}
            </div>
          </section>
        ))}
      </div>

      <SkillMatrix skills={skills} />
    </div>
  );
}