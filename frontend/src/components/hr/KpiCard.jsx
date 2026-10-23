const TREND_COLOR = {
  primary: "text-primary",
  tertiary: "text-tertiary",
};

export default function KpiCard({ label, value, unit, icon, iconColor, trendIcon, trendText, trendColor }) {
  return (
    <div className="col-span-1 md:col-span-4 glass-panel rim-light-top rounded-xl p-6 shadow-ambient">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
            {label}
          </p>
          <h3 className="text-headline-lg font-headline-lg text-on-surface mt-2">
            {value} <span className="text-headline-md font-headline-md text-on-surface-variant">{unit}</span>
          </h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline/20">
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
      </div>
      <div className={`flex items-center gap-2 font-label-sm text-label-sm mt-4 ${TREND_COLOR[trendColor] ?? "text-primary"}`}>
        <span className="material-symbols-outlined text-[16px]">{trendIcon}</span>
        <span>{trendText}</span>
      </div>
    </div>
  );
}
