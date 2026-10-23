const STATUS_STYLES = {
  "High Prof.": "bg-primary/20 text-primary border-primary/30",
  "Gap Risk": "bg-tertiary-fixed-dim/20 text-tertiary-fixed-dim border-tertiary-fixed-dim/30",
  Stable: "bg-surface-container-highest text-on-surface-variant border-outline-variant",
};

export default function EnterpriseSkillMatrix({ skills, onViewFull }) {
  return (
    <div className="col-span-1 md:col-span-4 glass-panel rim-light-top rounded-xl p-6 shadow-ambient flex flex-col">
      <h3 className="text-headline-md font-headline-md text-on-surface mb-6">
        Enterprise Skill Matrix
      </h3>
      <div className="flex-1 space-y-4">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="group flex items-center justify-between p-3 rounded-lg hover:bg-surface-container-high transition-colors border border-transparent hover:border-outline-variant/30"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center border border-outline-variant">
                <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                  {skill.icon}
                </span>
              </div>
              <div>
                <p className="text-label-md font-label-md text-on-surface">{skill.name}</p>
                <p className="text-label-sm font-label-sm text-on-surface-variant">
                  {skill.personnel} Personnel
                </p>
              </div>
            </div>
            <span
              className={`px-2 py-1 rounded text-label-sm font-label-sm border ${
                STATUS_STYLES[skill.status] ?? STATUS_STYLES.Stable
              }`}
            >
              {skill.status}
            </span>
          </div>
        ))}
      </div>
      <button
        onClick={onViewFull}
        className="mt-4 text-primary font-label-sm text-label-sm hover:underline flex items-center justify-center gap-1 w-full py-2"
      >
        View Full Matrix
      </button>
    </div>
  );
}
