export default function ActionableTasks({ tasks, onUpload }) {
  return (
    <section className="flex flex-col gap-stack-sm">
      <h2 className="text-headline-md font-headline-md text-on-surface flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">notifications_active</span>
        Actionable Tasks
      </h2>

      {tasks.map((task) => (
        <div
          key={task.id}
          className="glass-panel reflective-card rounded-xl p-5 border-l-2 border-l-error hover:bg-surface-container-low transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center text-error mt-1 shrink-0">
              <span className="material-symbols-outlined text-[18px]">{task.icon}</span>
            </div>
            <div>
              <h3 className="text-label-md font-label-md font-semibold text-on-surface">
                {task.title}
              </h3>
              <p className="text-body-md font-body-md text-on-surface-variant text-sm mt-1">
                {task.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => onUpload?.(task.id)}
            className="px-4 py-2 bg-background text-on-surface hover:text-primary border border-outline-variant rounded-lg text-label-sm font-label-sm transition-colors whitespace-nowrap shrink-0"
          >
            {task.actionLabel}
          </button>
        </div>
      ))}
    </section>
  );
}
