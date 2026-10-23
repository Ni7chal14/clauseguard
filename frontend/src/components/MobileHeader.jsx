import Avatar from "./Avatar";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function MobileHeader() {
  const { isDark, toggle } = useTheme();
  return (
    <header className="md:hidden w-full top-0 sticky bg-background/80 backdrop-blur-md border-b border-primary/20 shadow-sm flex justify-between items-center px-lg py-sm z-50">
      <div className="flex items-center gap-2">
        <img src="/logo.png" className={`h-7 object-contain ${isDark ? "brightness-0 invert" : ""}`} alt="ClauseGuard Logo" />
        <span className="text-lg font-bold text-on-background tracking-tight">ClauseGuard</span>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="text-primary hover:bg-primary/10 transition-colors p-2 rounded flex items-center justify-center"
          title={isDark ? "Light Mode" : "Dark Mode"}
        >
          {isDark ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>
        <Avatar size={32} />
      </div>
    </header>
  );
}
