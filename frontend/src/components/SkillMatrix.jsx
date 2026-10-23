const COLOR_CLASSES = {
  primary: { text: "text-primary", bar: "bg-primary shadow-[0_0_10px_rgba(16,185,129,0.5)]" },
  secondary: { text: "text-secondary-fixed", bar: "bg-secondary-fixed" },
  tertiary: { text: "text-tertiary-fixed", bar: "bg-tertiary-fixed" },
};

export default function SkillMatrix({ skills }) {
  return (
    <section className="glass-panel reflective-card deep-shadow rounded-xl p-6">
      <h2 className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider mb-5">
        Skill Matrix
      </h2>
      <div className="flex flex-col gap-4">
        {skills.map((skill) => {
          const colors = COLOR_CLASSES[skill.color] ?? COLOR_CLASSES.primary;
          return (
            <div key={skill.label}>
              <div className="flex justify-between text-label-sm font-label-sm mb-1">
                <span className="text-on-surface">{skill.label}</span>
                <span className={`${colors.text} font-bold`}>{skill.value}%</span>
              </div>
              <div className="h-2 w-full bg-background/50 rounded-full overflow-hidden border border-primary/20">
                <div
                  className={`h-full rounded-full ${colors.bar}`}
                  style={{ width: `${skill.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
