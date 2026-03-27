"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tight">
            HYPSOUL<span className="text-[#ff3c00]">.</span>
          </h1>
          <p className="text-[#888] text-sm mt-2 uppercase tracking-widest">
            Admin Panel
          </p>
        </div>

        <div className="bg-[#161616] border border-[#252525] rounded-2xl p-8">
          <h2 className="text-white font-bold text-xl mb-6">Sign In</h2>

          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@hypsoul.in"
                className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="text-[#888] text-xs uppercase tracking-widest block mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[#1c1c1c] border border-[#252525] rounded-xl px-4 py-3 text-white placeholder-[#555] focus:border-[#ff3c00] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#ff3c00] hover:bg-[#ff5722] text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
