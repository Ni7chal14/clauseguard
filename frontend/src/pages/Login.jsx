import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SpecularButton from "../components/ui/SpecularButton";
import { useTheme } from "../context/ThemeContext";
import API_BASE_URL from "../api";

export default function Login() {
  const { isDark } = useTheme() || { isDark: true };
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!identity.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      // Store auth session
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect depending on user role
      if (data.user.role === "HR") {
        navigate("/hr");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#091426] text-[#e8e0ec] min-h-screen flex flex-col items-center justify-center font-sans antialiased p-4 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#10b981]/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00a6e0]/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main glass-panel login card */}
      <div className="w-full max-w-[420px] rounded-2xl p-8 backdrop-blur-[20px] bg-slate-900/40 border border-white/5 shadow-2xl relative z-10 rim-light-top">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <img 
              alt="ClauseGuard Logo" 
              className={`h-10 w-10 object-contain ${isDark ? "brightness-0 invert" : ""}`} 
              src="/logo.png"
            />
            <span className="text-2xl font-bold tracking-tight text-[#10b981] font-headline-md">ClauseGuard</span>
          </div>
          <p className="text-sm text-[#bbcabf] font-semibold text-center mt-1">Enterprise Compliance & Governance Intelligence</p>
        </div>

        <h2 className="text-xl font-bold text-white mb-6 text-center">Login to your account</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#bbcabf] uppercase tracking-wider mb-2" htmlFor="identity">
              Email or Username
            </label>
            <input
              id="identity"
              type="text"
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-sm"
              placeholder="alex or alex@clauseguard.com"
              value={identity}
              onChange={(e) => setIdentity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#bbcabf] uppercase tracking-wider mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 rounded-lg bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981] transition-all text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <SpecularButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)] flex justify-center items-center"
              baseColor="#10b981"
              textColor="#091426"
              tint="#10b981"
              tintOpacity={1.0}
              lineColor="#ffffff"
              speed={0.35}
              intensity={1}
              radius={8}
            >
              {isLoading ? "Authenticating..." : "Sign In"}
            </SpecularButton>
          </div>
        </form>

        <div className="mt-8 text-center text-xs text-[#bbcabf]">
          Don't have an account?{" "}
          <Link to="/register" className="text-[#10b981] hover:underline font-bold">
            Create an account
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center text-[10px] text-[#bbcabf]/50">
          Demo Accounts: Admin (<code>admin</code> / <code>admin123</code>) &bull; Employee (<code>alex</code> / <code>alex123</code>)
        </div>
      </div>
    </div>
  );
}
