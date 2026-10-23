import Avatar from "./Avatar";

export default function CurrentRole({ user }) {
  return (
    <section className="glass-panel reflective-card rounded-xl p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 rounded-full blur-[60px] -mr-24 -mt-24 pointer-events-none"></div>
      
      <div className="flex items-start justify-between mb-6 z-10">
        <div className="flex gap-4 items-center">
          <Avatar size={48} className="border border-primary/30" />
          <div>
            <div className="text-label-md font-label-md text-primary mb-1 uppercase tracking-wider text-[10px]">
              Current Role
            </div>
            <h2 className="text-xl font-headline-md text-on-surface font-bold">
              {user.role}
            </h2>
            <div className="text-xs text-on-surface-variant mt-1 font-semibold">
              Level 4 • Governance & Risk
            </div>
          </div>
        </div>
        
        <div className="bg-surface-container-highest text-primary font-bold px-3 py-1.5 rounded-full border border-primary/30 text-label-sm flex items-center gap-1.5 emerald-glow">
          <span className="material-symbols-outlined text-sm">trending_up</span> 
          <span>Top 10%</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2.5 z-10 mb-6">
        <div className="bg-background/80 border border-outline/30 px-3 py-1.5 rounded-md flex items-center gap-2 text-label-sm font-label-sm text-[11px] font-semibold text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span> 
          <span>CIPP/E Certified</span>
        </div>
        <div className="bg-background/80 border border-outline/30 px-3 py-1.5 rounded-md flex items-center gap-2 text-label-sm font-label-sm text-[11px] font-semibold text-on-surface-variant">
          <span className="material-symbols-outlined text-primary text-[18px]">security</span> 
          <span>ISO 27001 Compliant</span>
        </div>
      </div>

      <div className="border-t border-outline-variant/30 pt-4 z-10 flex justify-between items-center text-xs">
        <div>
          <div className="text-label-sm text-on-surface-variant mb-0.5">Bonus Projection (85% target)</div>
          <div className="text-sm font-bold text-secondary flex items-center gap-1">
            <span>$18,500</span> 
            <span className="text-[10px] text-on-surface-variant font-normal">Est. Payout</span>
          </div>
        </div>
        <button 
          onClick={() => alert("Detailed performance audit data loaded.")}
          className="bg-primary text-background px-4 py-1.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Details
        </button>
      </div>
    </section>
  );
}
