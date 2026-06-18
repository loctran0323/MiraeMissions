"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@/components/ui";

export function RequestForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Unable to submit request.");
        setLoading(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-5">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-emerald-50 text-emerald-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink-900">
            Request submitted
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">
            Thanks, {name.split(" ")[0] || "there"}. An administrator will review
            and approve your account. You&rsquo;ll be able to sign in once
            approved.
          </p>
        </div>
        <Link href="/login" className="btn-outline w-full py-3">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}
      <div>
        <label className="label" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          required
          className="input"
          placeholder="Jane Intern"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className="label" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          type="email"
          required
          className="input"
          placeholder="you@example.com"
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
          required
          minLength={6}
          className="input"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" disabled={loading} className="btn-primary w-full py-3">
        {loading ? "Submitting…" : <>Request access <ArrowRight /></>}
      </button>

      <p className="text-center text-sm text-ink-500">
        Already approved?{" "}
        <Link href="/login" className="font-semibold text-mirae hover:text-mirae-600">
          Sign in
        </Link>
      </p>
    </form>
  );
}
