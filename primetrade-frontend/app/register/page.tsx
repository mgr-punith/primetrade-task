"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await registerUser({ name, email, password });
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-10 tracking-widest uppercase">
        -- Task Manager --
      </h1>

      <div className="border border-gray-600 p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Create Account</h2>
          <a href="/" className="text-gray-400 text-sm hover:text-white">
            &larr; Back to Login
          </a>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
        
              required
              className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              
              required
              className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              
              required
              className="w-full bg-gray-900 border border-gray-700 px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 font-semibold mt-2"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <a href="/" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
