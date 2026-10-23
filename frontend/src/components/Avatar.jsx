export default function Avatar({ size = 40, className = "" }) {
  return (
    <div
      className={`rounded-full bg-surface-container-high overflow-hidden border-glow shrink-0 flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="material-symbols-outlined text-primary"
        style={{ fontSize: size * 0.55 }}
      >
        person
      </span>
    </div>
  );
}
