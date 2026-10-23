import { useState } from "react";

export default function GrowthAttritionChart({ data, range = "1Y" }) {
  const [activeMonth, setActiveMonth] = useState(
    data.find((d) => d.highlight)?.month ?? null
  );

  return (
    <div className="col-span-1 md:col-span-8 glass-panel rim-light-top rounded-xl p-6 shadow-ambient min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-headline-md font-headline-md text-on-surface">
          Departmental Growth &amp; Attrition
        </h3>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-surface-container-highest rounded-full text-label-sm font-label-sm text-on-surface-variant">
            YTD
          </span>
          <span className="px-3 py-1 bg-primary/20 border border-primary/30 rounded-full text-label-sm font-label-sm text-primary">
            {range}
          </span>
        </div>
      </div>

      <div className="flex-1 relative flex items-end justify-between pt-8 pb-4 border-b border-l border-outline-variant/30 pl-4">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-label-sm font-label-sm text-on-surface-variant/50 -ml-2 -translate-x-full pb-4 pt-8">
          <span>200</span>
          <span>150</span>
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {/* Grid lines */}
        <div className="absolute inset-0 pt-8 pb-4 pl-4 pointer-events-none flex flex-col justify-between">
          <div className="w-full h-px bg-outline-variant/10" />
          <div className="w-full h-px bg-outline-variant/10" />
          <div className="w-full h-px bg-outline-variant/10" />
          <div className="w-full h-px bg-outline-variant/10" />
          <div />
        </div>

        {/* Data points */}
        {data.map((point) => {
          const isActive = point.month === activeMonth;
          return (
            <div
              key={point.month}
              onMouseEnter={() => setActiveMonth(point.month)}
              className="relative z-10 w-[10%] group flex flex-col justify-end items-center h-full cursor-pointer"
            >
              {isActive && (
                <div className="absolute inset-y-0 w-full bg-surface-container-high/50 rounded pointer-events-none transition-all" />
              )}
              <div
                className={`rounded-full bg-primary mb-2 absolute border-2 border-surface ${
                  isActive ? "w-3 h-3 emerald-glow" : "w-2 h-2"
                }`}
                style={{ bottom: `${point.growth}%` }}
              />
              <div
                className="w-2 h-2 rounded-full bg-secondary mb-2 absolute"
                style={{ bottom: `${point.headcountTarget}%` }}
              />
              <div
                className={`text-label-sm font-label-sm mt-4 -rotate-45 md:rotate-0 ${
                  isActive ? "text-on-surface-variant font-bold" : "text-on-surface-variant/50"
                }`}
              >
                {point.month}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex gap-6 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary emerald-glow" />
          <span className="text-label-sm font-label-sm text-on-surface-variant">Growth (Net)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-secondary" />
          <span className="text-label-sm font-label-sm text-on-surface-variant">Headcount Target</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-tertiary" />
          <span className="text-label-sm font-label-sm text-on-surface-variant">Attrition</span>
        </div>
      </div>
    </div>
  );
}
