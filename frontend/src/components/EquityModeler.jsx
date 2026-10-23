export default function EquityModeler() {
  return (
    <section className="glass-panel reflective-card deep-shadow rounded-xl p-6 flex flex-col justify-between">
      <div>
        <div className="text-label-md font-label-md text-on-surface-variant mb-1 uppercase tracking-wider text-[10px]">
          Equity Modeler
        </div>
        <h3 className="text-lg font-headline-md text-on-surface font-bold mb-6">
          Vesting Progress
        </h3>
      </div>
      
      <div className="mb-6">
        <div className="flex justify-between text-xs font-label-sm mb-2 font-bold text-on-surface-variant">
          <span className="text-primary font-semibold">Vested: 2,500 units</span>
          <span>Total: 10,000 units</span>
        </div>
        <div className="h-3 w-full bg-background/50 rounded-full overflow-hidden border border-outline/30">
          <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full relative" style={{ width: "25%" }}>
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 rounded-full blur-[1px]"></div>
          </div>
        </div>
      </div>

      <div className="bg-background/80 border border-outline-variant/30 rounded-lg p-4 flex items-center justify-between text-xs">
        <div>
          <div className="text-[10px] text-on-surface-variant mb-1">Next Vesting Date</div>
          <div className="text-on-surface font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[20px]">event</span> 
            <span>Nov 15, 2026</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-on-surface-variant mb-1">Unvested Value</div>
          <div className="text-on-surface font-bold">~$45,000</div>
        </div>
      </div>
    </section>
  );
}
