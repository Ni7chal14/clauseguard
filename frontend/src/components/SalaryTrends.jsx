import { useState } from "react";
import Avatar from "./Avatar";
import { useTheme } from "../context/ThemeContext";

export default function SalaryTrends({ yoyChange, points }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const { isDark } = useTheme() || { isDark: true };

  const gradStartColor = isDark ? "#091426" : "#059669";
  const gradEndColor = "#10b981";
  
  const fadeStartColor = "#10b981";
  const fadeEndColor = isDark ? "#091426" : "#ffffff";

  // Map points to include padding on the x-axis so nodes don't get cut off at the edges
  const paddingX = 10;
  const paddedPoints = points.map(p => ({
    x: paddingX + (p.x * (100 - 2 * paddingX)) / 100,
    y: p.y
  }));

  // Generate SVG path coordinate strings
  const linePath = "M" + paddedPoints.map((p) => `${p.x},${p.y}`).join(" L");
  const areaPath = `${linePath} L${paddedPoints[paddedPoints.length - 1]?.x || 100},100 L${paddedPoints[0]?.x || 0},100 Z`;

  // Explicit label/meta details mapped for each value point on the graph
  const pointDetails = points.map((p, idx) => {
    // Determine metrics based on coordinates
    if (p.x === 0 || p.x === 12.5) {
      return { year: "2021", salary: "₹8.5 LPA", role: "Analyst (L3)", change: "+10.2%" };
    } else if (p.x === 25 || p.x === 37.5) {
      return { year: "2022", salary: "₹9.8 LPA", role: "Analyst (L3)", change: "+15.3%" };
    } else if (p.x === 50 || p.x === 62.5) {
      return { year: "2023", salary: "₹11.3 LPA", role: "Senior Analyst (L4)", change: "+15.3%" };
    } else if (p.x === 75 || p.x === 87.5) {
      return { year: "2024", salary: "₹12.6 LPA", role: "Senior Analyst (L4)", change: "+11.5%" };
    } else {
      return { year: "2026", salary: "₹14.2 LPA", role: "Governance Lead (L5)", change: "+12.7%" };
    }
  });

  return (
    <section className="glass-panel reflective-card deep-shadow rounded-xl p-6 flex flex-col justify-between overflow-hidden">
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider text-[10px] text-on-surface-variant/80">Salary Trends</h2>
          <p className="text-lg font-headline-md font-bold text-white mt-1">
            Compensation progression
          </p>
        </div>
        <div className="px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-bold flex items-center gap-1 whitespace-nowrap">
          <span className="material-symbols-outlined text-[16px]">trending_up</span>
          <span>{yoyChange}</span>
        </div>
      </div>

      {/* Main Chart Container with Fixed Proportional Height */}
      <div className="w-full flex flex-col mb-6">
          {/* Chart Canvas Card */}
          <div className="relative w-full h-[130px] bg-background/50 rounded-lg border border-primary/10">
            {/* Grid lines (aligned with Y-axis labels and data nodes) */}
            <div className="absolute inset-x-0 top-2.5 bottom-2.5 pointer-events-none">
              {/* Horizontal lines */}
              <div className="absolute inset-0 flex flex-col justify-between opacity-20">
                <div className="w-full h-px bg-outline-variant/40" />
                <div className="w-full h-px bg-outline-variant/40" />
                <div className="w-full h-px bg-outline-variant/40" />
                <div className="w-full h-px bg-outline-variant/40" />
              </div>

              {/* Vertical lines (aligned with data nodes) */}
              <div className="absolute inset-0 opacity-15">
                {paddedPoints.map((p, idx) => (
                  <div
                    key={`vert-grid-${idx}`}
                    className="absolute top-0 bottom-0 w-px bg-outline-variant"
                    style={{ left: `${p.x}%`, transform: "translateX(-50%)" }}
                  />
                ))}
              </div>
            </div>

            {/* Y-axis labels */}
            <div className="absolute left-2.5 top-2.5 bottom-2.5 flex flex-col justify-between text-[8px] font-bold text-on-surface-variant/50 pointer-events-none select-none">
              <span>15L</span>
              <span>12L</span>
              <span>9L</span>
              <span>6L</span>
            </div>

            {/* SVG Drawing lines */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path
                d={linePath}
                fill="none"
                style={{ filter: "drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))" }}
                stroke="url(#emerald-gradient)"
                strokeWidth="3"
                vectorEffect="non-scaling-stroke"
              />
              <path d={areaPath} fill="url(#emerald-fade)" opacity="0.15" />
              <defs>
                <linearGradient id="emerald-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor={gradStartColor} />
                  <stop offset="100%" stopColor={gradEndColor} />
                </linearGradient>
                <linearGradient id="emerald-fade" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" stopColor={fadeStartColor} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={fadeEndColor} stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Circular Points rendered using relative HTML to ensure they don't stretch */}
            {paddedPoints.map((p, idx) => {
              const isHovered = hoveredIdx === idx;
              const isLast = idx === paddedPoints.length - 1;
              return (
                <div
                  key={idx}
                  className="absolute group z-20 cursor-pointer"
                  style={{
                    left: `${p.x}%`,
                    top: `${p.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  <div
                    className={`rounded-full transition-all duration-200 ${
                      isLast 
                        ? "w-3 h-3 bg-white shadow-[0_0_8px_#fff]" 
                        : isHovered 
                        ? "w-3.5 h-3.5 bg-primary shadow-[0_0_8px_rgba(16,185,129,0.7)]" 
                        : "w-2.5 h-2.5 bg-[#10b981] border-2 border-[#091426]"
                    }`}
                  />
                  
                  {/* Tooltip Card overlay matching UI spec */}
                  {(isHovered || isLast) && (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-surface-container-highest border border-primary/40 text-primary text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap z-30">
                      {pointDetails[idx].salary}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* X-axis year labels container (rendered clean below the canvas) */}
          <div className="relative w-full h-5 mt-1.5">
            {paddedPoints.map((p, idx) => (
              <div
                key={`lbl-year-${idx}`}
                className="absolute text-[9px] font-bold text-on-surface-variant/80 -translate-x-1/2 pointer-events-none select-none"
                style={{ left: `${p.x}%` }}
              >
                {pointDetails[idx].year}
              </div>
            ))}
          </div>
        </div>

      {/* Desktop view: perfectly aligned cards under chart points */}
      <div className="hidden lg:block relative w-full h-24">
        {pointDetails.map((det, idx) => {
          const isPointHovered = hoveredIdx === idx;
          const p = paddedPoints[idx];
          return (
            <div
              key={idx}
              className={`absolute top-0 w-[18%] p-2.5 transition-all duration-200 flex flex-col justify-between h-24 ${
                isPointHovered 
                  ? "border border-primary bg-primary/5 rounded-lg shadow-ambient" 
                  : "border border-transparent"
              }`}
              style={{
                left: `${p.x}%`,
                transform: "translateX(-50%)",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex justify-between items-start gap-1">
                <span className="text-[10px] font-bold text-on-surface-variant">{det.year}</span>
                <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 rounded px-1">{det.change}</span>
              </div>
              
              <div className="flex flex-col gap-1 mt-auto min-w-0 w-full">
                <div className="text-xs font-bold text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">{det.salary}</div>
                <div className="flex items-center gap-1.5 min-w-0 w-full">
                  <Avatar size={14} className="border border-primary/20 shrink-0" />
                  <span className="text-[9px] text-on-surface-variant truncate leading-none">{det.role}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile/Tablet view: standard grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:hidden gap-3">
        {pointDetails.map((det, idx) => {
          const isPointHovered = hoveredIdx === idx;
          return (
            <div
              key={idx}
              className={`p-2.5 transition-all duration-200 flex flex-col justify-between h-24 ${
                isPointHovered 
                  ? "border border-primary bg-primary/5 rounded-lg shadow-ambient" 
                  : "border border-transparent"
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex justify-between items-start gap-1.5">
                <span className="text-[10px] font-bold text-on-surface-variant">{det.year}</span>
                <span className="text-[9px] font-bold text-primary bg-primary/10 border border-primary/20 rounded px-1">{det.change}</span>
              </div>
              
              <div className="flex flex-col gap-1 mt-auto min-w-0 w-full">
                <div className="text-xs font-bold text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">{det.salary}</div>
                <div className="flex items-center gap-1.5 min-w-0 w-full">
                  <Avatar size={14} className="border border-primary/20 shrink-0" />
                  <span className="text-[9px] text-on-surface-variant truncate leading-none">{det.role}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
