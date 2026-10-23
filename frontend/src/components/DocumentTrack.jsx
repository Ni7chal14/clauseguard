export default function DocumentTrack({ referenceId, steps }) {
  return (
    <section className="glass-panel reflective-card deep-shadow rounded-xl p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
          Document Track
        </h2>
        <span className="text-label-sm font-label-sm bg-background px-2 py-1 rounded text-primary border border-primary/20">
          {referenceId}
        </span>
      </div>

      <div className="relative flex flex-col gap-6">
        <div className="absolute left-[12px] top-2 bottom-2 w-0.5 bg-background -translate-x-1/2" />
        <div className="absolute left-[12px] top-2 h-1/2 w-0.5 bg-primary emerald-glow -translate-x-1/2" />

        {steps.map((step) => (
          <div
            key={step.label}
            className={`relative z-10 flex items-start gap-4 ${step.status === "pending" ? "opacity-50" : ""}`}
          >
            {step.status === "done" && (
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.4)] mt-0.5">
                <span className="material-symbols-outlined text-[14px] text-background">check</span>
              </div>
            )}
            {step.status === "active" && (
              <div className="w-6 h-6 rounded-full bg-background border-2 border-primary flex items-center justify-center shrink-0 mt-0.5">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
            )}
            {step.status === "pending" && (
              <div className="w-6 h-6 rounded-full bg-background border border-outline-variant flex items-center justify-center shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`text-label-md font-label-md font-bold ${
                  step.status === "active" ? "text-primary emerald-text-glow" : "text-on-surface"
                }`}
              >
                {step.label}
              </p>
              <p className="text-label-sm font-label-sm text-on-surface-variant">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
