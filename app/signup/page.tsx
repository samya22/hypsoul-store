"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { Suspense } from "react";

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/account";
  const { fetchUser } = useAuthStore();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/login?message=Account created! Please verify your email before logging in.");
    } else {
      setError(data.error || "Signup failed");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-5 pt-24 pb-16">
      <div className="w-full max-w-md">
        <div className="mb-10">
          <h1 className="font-heading font-black text-4xl md:text-5xl line-accent">Create Account</h1>
          <p className="text-text-secondary mt-4">Join Hypsoul. Track orders, save favourites.</p>
        </div>

        <div className="bg-bg-card border border-border rounded-2xl p-6 md:p-8">
          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-text-secondary text-xs uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                placeholder="John Doe"
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>
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
                placeholder="Min 6 characters"
                minLength={6}
                className="w-full bg-bg-elevated border border-border rounded-xl px-4 py-3 text-white placeholder-text-muted focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary-full w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-text-secondary text-sm mt-6">
            Already have an account?{" "}
            <Link href={`/login?redirect=${redirect}`} className="text-accent hover:underline font-medium">
              Sign in
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

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary" />}>
      <SignupContent />
    </Suspense>
  );
}