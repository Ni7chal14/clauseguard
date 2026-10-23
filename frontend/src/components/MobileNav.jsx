export default function MobileNav({ activeTab, setActiveTab }) {
  const items = [
    { key: "dashboard", icon: "home", label: "Dashboard" },
    { key: "library", icon: "folder_open", label: "Library" },
    { key: "compliance", icon: "description", label: "Submissions" },
    { key: "profile", icon: "workspace_premium", label: "Profile" },
    { key: "insights", icon: "auto_awesome", label: "Assistant" }
  ];

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-md">
      <div className="glass-panel deep-shadow rounded-full p-2 flex justify-between items-center bg-background/90 backdrop-blur-xl border border-primary/30">
        {items.map((item) => {
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex flex-col items-center justify-center w-12 h-12 rounded-full transition-all ${
                active ? "bg-primary/20 text-primary" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${active ? "fill" : ""}`}>
                {item.icon}
              </span>
              <span className="text-[9px] font-label-sm mt-0.5">{item.label}</span>
            </button>
          );
        })}
        
        <a
          href="/hr"
          className="flex flex-col items-center justify-center w-12 h-12 rounded-full text-secondary hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
          <span className="text-[9px] font-label-sm mt-0.5">HR Portal</span>
        </a>
      </div>
    </div>
  );
}
