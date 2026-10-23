export default function HRMobileNav({ activeTab, setActiveTab }) {
  const items = [
    { key: "dashboard", icon: "dashboard", label: "Center" },
    { key: "queue", icon: "rate_review", label: "Review" },
    { key: "compliance", icon: "gavel", label: "Policy" },
    { key: "records", icon: "monitoring", label: "Records" },
    { key: "library", icon: "history", label: "Audit" },
    { key: "settings", icon: "calculate", label: "SaaS" }
  ];

  return (
    <nav className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 glass-panel rounded-full px-2 py-2 flex gap-1 items-center shadow-ambient z-50 border border-outline-variant/30">
      {items.map((item) => {
        const active = activeTab === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`p-3 rounded-full flex flex-col items-center gap-1 min-w-[60px] transition-all ${
              active ? "bg-primary/20 text-primary border border-primary/20" : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[9px] font-label-sm">{item.label}</span>
          </button>
        );
      })}
      
      <a
        href="/"
        className="p-3 rounded-full text-secondary hover:bg-surface-container-high flex flex-col items-center gap-1 min-w-[60px]"
      >
        <span className="material-symbols-outlined">person</span>
        <span className="text-[9px] font-label-sm">Portal</span>
      </a>
    </nav>
  );
}
