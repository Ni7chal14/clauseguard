export default function Milestones() {
  const milestoneList = [
    {
      quarter: "Q3 2026",
      title: "GDPR Compliance Overhaul",
      desc: "Led cross-functional team to audit and update all European data processing agreements, mitigating €2M in potential regulatory fines.",
      status: "active"
    },
    {
      quarter: "Q1 2026",
      title: "Vendor Risk Assessment Framework",
      desc: "Designed automated workflow reducing third-party onboarding time by 40% while increasing compliance coverage.",
      status: "done"
    },
    {
      quarter: "Q4 2025",
      title: "Promoted to Senior Analyst",
      desc: "Recognized for exceptional performance in internal audits and incident response protocols.",
      status: "done"
    }
  ];

  return (
    <section className="glass-panel reflective-card deep-shadow rounded-xl p-6">
      <div className="text-label-md font-label-md text-on-surface-variant mb-1 uppercase tracking-wider text-[10px]">
        Impact
      </div>
      <h3 className="text-lg font-headline-md text-on-surface font-bold mb-6">
        Career Milestones
      </h3>
      
      <div className="relative border-l-2 border-outline-variant/30 ml-3 space-y-6 pb-2">
        {milestoneList.map((m, idx) => (
          <div key={idx} className="relative pl-6">
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-background ${
              m.status === "active" 
                ? "bg-primary shadow-[0_0_8px_rgba(16,185,129,0.6)]" 
                : "bg-surface-container-high border-2 border-outline-variant"
            }`}></div>
            <div className={`text-[10px] font-bold mb-1 ${m.status === "active" ? "text-primary" : "text-on-surface-variant"}`}>
              {m.quarter}
            </div>
            <h4 className="text-xs font-bold text-on-surface">{m.title}</h4>
            <p className="text-[11px] text-on-surface-variant mt-1 leading-relaxed">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
