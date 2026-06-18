"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to sign in.");
        setLoading(false);
        return;
      }
      window.location.href = data.redirect || "/dashboard";
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      <div>
        <label className="label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          className="input"
          placeholder="you@miraeasset.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          className="input"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "Signing in…" : <>Sign in <ArrowRight /></>}
      </button>

      <p className="text-center text-sm text-ink-500">
        Don&rsquo;t have access yet?{" "}
        <Link href="/request-access" className="font-semibold text-mirae hover:text-mirae-600">
          Request access
        </Link>
      </p>

      <div className="rounded-md border border-line bg-ink-50 px-3.5 py-3 text-xs leading-relaxed text-ink-500">
        <span className="font-semibold text-ink-700">Demo accounts</span>
        <br />
        Admin: admin@miraeasset.com / admin1234
        <br />
        Intern: loc@miraeasset.com / intern1234
      </div>
    </form>
  );
}
