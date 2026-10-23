import Folder from "./ui/Folder";

const ICON_COLOR_CLASSES = {
  secondary: "text-secondary-fixed",
  primary: "text-primary",
  error: "text-error",
  outline: "text-outline",
};

export default function MyDocuments({ folders, onOpenFolder }) {
  return (
    <section className="flex flex-col gap-stack-sm mb-8">
      <h2 className="text-headline-md font-headline-md text-on-surface">My Documents</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-base md:gap-gutter">
        {folders.map((folder) => (
          <button
            key={folder.name}
            onClick={() => onOpenFolder?.(folder.name)}
            className={`glass-panel reflective-card p-4 rounded-xl flex flex-col gap-2 hover:bg-primary/5 transition-colors cursor-pointer group text-left ${
              folder.alert ? "border-b-2 border-b-error/50" : ""
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="group-hover:scale-115 transition-transform flex items-center justify-center w-12 h-10">
                <Folder size={0.65} color={folder.color === 'primary' ? '#10b981' : folder.color === 'secondary' ? '#00a6e0' : folder.color === 'error' ? '#fc7c78' : '#86948a'} className="custom-folder" />
              </div>
              {folder.alert ? (
                <span className="w-2 h-2 rounded-full bg-error animate-pulse" />
              ) : (
                <span className="text-label-sm text-on-surface-variant bg-background border border-primary/10 px-2 py-0.5 rounded">
                  {folder.count}
                </span>
              )}
            </div>
            <span className="text-label-md font-label-md font-semibold text-on-surface mt-2">
              {folder.name}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
