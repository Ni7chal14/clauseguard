import React from "react";
import SpecularButton from "../ui/SpecularButton";

export default function HRHeader({ onExport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-stack-lg">
      <div>
        <h1 className="text-headline-lg-mobile md:text-headline-lg font-headline-lg-mobile md:font-headline-lg text-on-surface mb-2">
          HR Analytics <span className="text-primary-fixed-dim">Intelligence</span>
        </h1>
        <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
          Enterprise workforce dynamics and retention diagnostics.
        </p>
      </div>
      <div className="flex gap-4">
        <SpecularButton
          onClick={onExport}
          className="px-6 py-3 font-bold border border-outline-variant/30 shadow-sm"
          baseColor="#091426"
          textColor="#10b981"
          tint="#091426"
          tintOpacity={1.0}
          lineColor="#10b981"
          speed={0.3}
          intensity={0.8}
          radius={8}
          size="md"
        >
          <span className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Export Report
          </span>
        </SpecularButton>
      </div>
    </div>
  );
}
