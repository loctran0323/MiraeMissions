"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui";
import type { User } from "@/lib/types";

export function ApprovalRow({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState<null | "approve" | "reject">(null);
  const [error, setError] = useState<string | null>(null);

  const requested = (() => {
    const d = new Date(user.created_at);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  })();

  async function act(action: "approve" | "reject") {
    setError(null);
    setLoading(action);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update request.");
      setLoading(null);
    }
  }

  return (
    <div className="card p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size={38} />
          <div className="min-w-0">
            <div className="truncate font-semibold text-ink-900">
              {user.name}
            </div>
            <div className="truncate text-xs text-ink-400">{user.email}</div>
            {requested && (
              <div className="mt-0.5 text-[11px] text-ink-400">
                Requested {requested}
              </div>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={() => act("approve")}
            disabled={loading !== null}
            className="btn-primary"
          >
            {loading === "approve" ? "Approving…" : "Approve"}
          </button>
          <button
            type="button"
            onClick={() => act("reject")}
            disabled={loading !== null}
            className="btn-outline text-rose-600 hover:border-rose-300"
          >
            {loading === "reject" ? "Rejecting…" : "Reject"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
          {error}
        </div>
      )}
    </div>
  );
}
