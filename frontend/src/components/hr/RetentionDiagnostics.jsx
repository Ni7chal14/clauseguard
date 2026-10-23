export default function RetentionDiagnostics({ title, message, highlight, onTakeAction }) {
  return (
    <div className="col-span-1 md:col-span-4 glass-panel rim-light-top rounded-xl p-6 shadow-ambient emerald-glow-strong relative overflow-hidden border border-primary/20">
      <div className="absolute -right-6 -top-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
      <div className="flex items-center gap-3 mb-4">
        <span className="material-symbols-outlined fill text-primary emerald-glow">auto_awesome</span>
        <h3 className="text-headline-md font-headline-md text-primary">{title}</h3>
      </div>
      <p className="text-body-md font-body-md text-on-surface-variant mb-4">
        {message.split(highlight).map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && <span className="text-on-surface font-bold">{highlight}</span>}
          </span>
        ))}
      </p>
      <button
        onClick={onTakeAction}
        className="w-full py-2 specular-button text-on-primary-fixed-variant rounded hover:brightness-110 transition-all font-label-md text-label-md flex items-center justify-center gap-2"
      >
        Take Action
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </button>
    </div>
  );
}
