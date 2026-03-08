"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Cookies from "js-cookie";

const API = "https://primetrade-task-92dh.onrender.com/api/v1";

export default function Home() {
  const router = useRouter();
  const [role, setRole] = useState<"user" | "admin" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint =
        role === "admin" ? `${API}/auth/admin/login` : `${API}/auth/login`;

      const res = await axios.post(endpoint, { email, password });
      Cookies.set("token", res.data.access_token, { expires: 1 });
      Cookies.set("role", role!, { expires: 1 });

      router.push(role === "admin" ? "/admin" : "/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-10 tracking-widest text-white uppercase">
        ── Task Manager ──
      </h1>

      {/* Role Selection Cards */}
      {!role && (
        <div className="flex gap-6 mb-10">
          {/* User Card */}
          <div className="border border-gray-600 p-8 w-56 flex flex-col items-center gap-4 hover:border-blue-500 transition">
            <p className="font-semibold text-lg">USER LOGIN</p>
            <p className="text-gray-400 text-sm text-center">(for employees)</p>
            <button
              onClick={() => setRole("user")}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-2  w-full font-medium"
            >
              Continue
            </button>
          </div>

          {/* Admin Card */}
          <div className="border border-gray-600 p-8 w-56 flex flex-col items-center gap-4 hover:border-purple-500 transition">
            <p className="font-semibold text-lg">ADMIN LOGIN</p>
            <p className="text-gray-400 text-sm text-center">(for managers)</p>
            <button
              onClick={() => setRole("admin")}
              className="bg-purple-600 hover:bg-purple-700 px-6 py-2  w-full font-medium"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Login Form */}
      {role && (
        <div className="border border-gray-600 p-8 w-full max-w-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">
              {role === "admin" ? "Admin Login" : "User Login"}
            </h2>
            <button
              onClick={() => {
                setRole(null);
                setError("");
              }}
              className="text-gray-400 text-sm hover:text-white"
            >
              ← Back
            </button>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700  px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-900 border border-gray-700  px-4 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2  font-semibold mt-2"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {role === "user" && (
              <p className="text-center text-sm text-gray-400">
                No account?{" "}
                <a href="/register" className="text-blue-400 hover:underline">
                  Register
                </a>
              </p>
            )}
          </form>
        </div>
      )}
    </main>
  );
}
