import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import SpecularButton from "../components/ui/SpecularButton";
import { useTheme } from "../context/ThemeContext";
import API_BASE_URL from "../api";

export default function Register() {
  const { isDark } = useTheme() || { isDark: true };
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("EMPLOYEE");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Username, email and password are required.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
          title: title.trim() || undefined,
          department: department.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed. Please try again.");
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

      {/* Main glass-panel registration card */}
      <div className="w-full max-w-[460px] rounded-2xl p-8 backdrop-blur-[20px] bg-slate-900/40 border border-white/5 shadow-2xl relative z-10 rim-light-top">
        
        {/* Brand header */}
        <div className="flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-1">
            <img 
              alt="ClauseGuard Logo" 
              className={`h-9 w-9 object-contain ${isDark ? "brightness-0 invert" : ""}`} 
              src="/logo.png"
            />
            <span className="text-xl font-bold tracking-tight text-[#10b981] font-headline-md">ClauseGuard</span>
          </div>
          <p className="text-xs text-[#bbcabf] font-semibold text-center">Create a corporate compliance identity</p>
        </div>

        <h2 className="text-lg font-bold text-white mb-5 text-center">Create account</h2>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-3 py-2 rounded bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] transition-all text-xs"
                placeholder="e.g. Priyan"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider mb-1" htmlFor="role">
                Account Type
              </label>
              <select
                id="role"
                className="w-full px-3 py-2 rounded bg-slate-950/50 border border-slate-800 text-white focus:outline-none focus:border-[#10b981] transition-all text-xs"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="EMPLOYEE">Employee (Compliance view)</option>
                <option value="HR">HR Administrator (Dashboard & audits)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider mb-1" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-3 py-2.5 rounded bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] transition-all text-xs"
              placeholder="name@clauseguard.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2.5 rounded bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] transition-all text-xs"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider mb-1" htmlFor="title">
                Job Title (Optional)
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-3 py-2 rounded bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] transition-all text-xs"
                placeholder={role === "HR" ? "HR Manager" : "Software Engineer"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#bbcabf] uppercase tracking-wider mb-1" htmlFor="department">
                Department (Optional)
              </label>
              <input
                id="department"
                type="text"
                className="w-full px-3 py-2 rounded bg-slate-950/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-[#10b981] transition-all text-xs"
                placeholder={role === "HR" ? "People Ops" : "Engineering"}
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <SpecularButton
              type="submit"
              disabled={isLoading}
              className="w-full py-3 font-bold shadow-[0_4px_12px_rgba(16,185,129,0.3)] flex justify-center items-center"
              baseColor="#10b981"
              textColor="#091426"
              tint="#10b981"
              tintOpacity={1.0}
              lineColor="#ffffff"
              speed={0.35}
              intensity={1}
              radius={8}
            >
              {isLoading ? "Creating Identity..." : "Register Now"}
            </SpecularButton>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-[#bbcabf]">
          Already have an account?{" "}
          <Link to="/login" className="text-[#10b981] hover:underline font-bold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
