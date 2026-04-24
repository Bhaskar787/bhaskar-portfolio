"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { FiMail, FiLock, FiEye, FiEyeOff, FiLoader } from "react-icons/fi"; // ✅ Fixed: FiLoader2 → FiLoader
import { BsStars } from "react-icons/bs";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    setError(""); // Clear error on input
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (res.ok) {
        Cookies.set("admin_token", data.token, { expires: 1, secure: true, sameSite: 'strict' });
        toast.success('Login Successful! 🎉');
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-950 to-black flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(168,85,247,0.08),transparent),radial-gradient(circle_at_80%_20%,rgba(59,130,246,0.08),transparent)]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 max-w-md w-full">
        {/* Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl overflow-hidden animate-slide-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <BsStars className="w-12 h-12 text-white/80 mx-auto mb-4 opacity-75" />
            <h1 className="text-3xl lg:text-4xl font-black text-white mb-2 drop-shadow-lg">
              Admin Panel
            </h1>
            <p className="text-purple-100 text-lg font-medium drop-shadow-md">
              Secure Access Required
            </p>
          </div>

          {/* Form */}
          <div className="p-8 lg:p-10">
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Error Message */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 backdrop-blur-sm animate-slide-in-up">
                  <div className="flex items-center gap-3 text-red-300">
                    <FiLock className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div className="relative">
                <label className="block text-slate-300 font-semibold mb-3 text-lg">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={credentials.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-lg shadow-inner hover:border-slate-600/75"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="relative">
                <label className="block text-slate-300 font-semibold mb-3 text-lg">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={credentials.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white placeholder-slate-400 focus:border-purple-500/75 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-lg shadow-inner hover:border-slate-600/75"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700/50 rounded-xl"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-5 h-5" />
                    ) : (
                      <FiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full px-8 py-5 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:via-purple-600 hover:to-indigo-500 text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-purple-500/50 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-500 border border-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 uppercase tracking-wider shadow-purple-500/25"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin w-6 h-6" /> {/* ✅ Fixed: Using FiLoader */}
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Admin</span>
                  </>
                )}
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-3xl blur-sm transition-all scale-0 group-hover:scale-100" />
              </button>

              {/* Register Link */}
              <div className="text-center pt-6 border-t border-slate-800/50">
                <p className="text-sm text-slate-400">
                  Don't have an account?{" "}
                  <a 
                    href="/admin/register" 
                    className="text-purple-400 font-semibold hover:text-purple-300 hover:underline transition-all duration-200"
                  >
                    Create one here
                  </a>
                </p>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center py-6 px-8 bg-slate-900/50 backdrop-blur-sm border-t border-slate-800/50">
            <p className="text-xs text-slate-500">
              © 2024 Bhaskar Admin. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}