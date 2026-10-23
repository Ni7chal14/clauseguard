import React from "react";
import Avatar from "./Avatar";
import BorderGlow from "./ui/BorderGlow";
import GlassIcons from "./GlassIcons";
import { FiFileText, FiBook, FiHeart, FiAward, FiHome, FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";

export default function Sidebar({ user, activeTab, setActiveTab }) {
  const { isDark, toggle } = useTheme();
  const items = [
    { icon: <FiHome />, color: 'teal', label: 'Dashboard', onClick: () => setActiveTab('dashboard') },
    { icon: <FiFileText />, color: 'blue', label: 'Document Library', onClick: () => setActiveTab('library') },
    { icon: <FiFileText />, color: 'green', label: 'My Submissions', onClick: () => setActiveTab('compliance') },
    { icon: <FiBook />, color: 'purple', label: 'My Profile', onClick: () => setActiveTab('profile') },
    { icon: <FiHeart />, color: 'red', label: 'Policy Assistant', onClick: () => setActiveTab('insights') },
  ];

  return (
    <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[280px] bg-background border-r border-outline-variant/10 py-6 z-50">
      <button
        type="button"
        onClick={() => setActiveTab('dashboard')}
        className="px-gutter mb-6 flex items-center gap-3 shrink-0 text-left"
      >
        <img src="/logo.png" className={`h-9 object-contain ${isDark ? "brightness-0 invert" : ""}`} alt="ClauseGuard Logo" />
        <span className="text-xl font-bold text-on-background tracking-tight">ClauseGuard</span>
      </button>

      <div className="px-gutter mb-6 border-b border-outline-variant/20 pb-4 shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-base text-left w-full"
        >
          <BorderGlow
            edgeSensitivity={30}
            glowColor="40 80 80"
            backgroundColor="#120F17"
            borderRadius={28}
            glowRadius={40}
            glowIntensity={1.0}
            coneSpread={25}
            animated={false}
            colors={['#c084fc', '#f472b6', '#38bdf8']}
            className="shrink-0"
            alwaysGlow={true}
          >
            <div className="w-[52px] h-[52px] flex items-center justify-center bg-transparent">
              <Avatar size={44} className="!rounded-[22px] !border-none !bg-transparent" />
            </div>
          </BorderGlow>
          <div>
            <p className="font-bold text-label-md text-on-surface">{user.name}</p>
            <p className="text-label-sm text-on-surface-variant">{user.role}</p>
          </div>
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-between px-2 overflow-y-hidden">
        <div className="flex flex-col gap-1 pl-2">
          <p className="text-label-sm text-on-surface-variant/80 px-4 uppercase tracking-wider text-[10px] mt-4 mb-3 font-bold font-label-md">
            EMPLOYEE PANELS
          </p>
          <div className="relative">
            <GlassIcons items={items} className="vertical custom-class text-[0.52rem]"/>
          </div>
        </div>

        <div className="p-4 border-t border-outline-variant/10 flex flex-col gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-outline-variant/10 hover:bg-outline-variant/20 text-on-surface-variant text-xs font-bold transition-all border border-outline-variant/20"
          >
            {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/login";
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all border border-red-500/20"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
}
