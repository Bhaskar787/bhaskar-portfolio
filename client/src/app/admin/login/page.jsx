"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
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
        // Save the token in a cookie (expires in 1 hour to match  JWT)
        Cookies.set("admin_token", data.token, { expires: 1, secure: true, sameSite: 'strict' });

        // Redirect to dashboard
        router.push("/admin");
        toast.success('Login Successfully!')
        router.refresh(); // Forces a refresh to update layout state
      } else {
        toast.error(data.message || "Login failed")
        
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-purple-600 p-8 text-center">
          <h1 className="text-3xl font-bold text-white">Bhaskar Admin</h1>
          <p className="text-purple-100 mt-2">Secure Access Point</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email </label>
              <input
                type="email"
                name="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none text-gray-900"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
             <div className="text-center">
              <p className="text-sm text-gray-500">
               Don't have an Account?{" "}
                <a href="/admin/register" className="text-purple-600 font-semibold hover:underline">
                  Register here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}