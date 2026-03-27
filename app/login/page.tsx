"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { Suspense } from "react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const message = searchParams.get("message") || "";
  const { fetchUser } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      await fetchUser();
      router.push(redirect);
    } else {
      setError(data.error || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-5 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="font-heading font-black text-4xl md:text-5xl line-accent">Sign In</h1>
          <p className="text-text-secondary mt-4">Welcome back. Sign in to your Hypsoul account.</p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-8">
          {message && (
            <div className="mb-5 p-3.5 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-text-secondary text-xs uppercase tracking-widest">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
                placeholder="you@example.com"
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-text-secondary text-xs uppercase tracking-widest">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-full w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Don&apos;t have an account?{" "}
            <Link href={`/signup?redirect=${redirect}`} className="text-accent hover:underline font-medium">
              Create one
            </Link>
          </p>
        </div>

        <p className="text-center mt-6">
          <Link href="/checkout" className="text-text-muted text-sm hover:text-white transition-colors">
            ← Continue as guest
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <LoginContent />
    </Suspense>
  );
}