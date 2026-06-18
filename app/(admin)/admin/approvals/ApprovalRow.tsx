"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";
import { Avatar, Button } from "@/components/ui";

function formatDate(iso: string) {
  return new Date(iso.includes("Z") ? iso : iso + "Z").toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" },
  );
}

// A single pending account with approve/reject actions.
export function ApprovalRow({ user }: { user: User }) {
  const router = useRouter();
  const [busy, setBusy] = useState<null | "approve" | "reject">(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(action: "approve" | "reject") {
    setError(null);
    setBusy(action);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not update account.");
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setBusy(null);
    }
  }

  return (
    <article className="card animate-fade-up flex flex-wrap items-center gap-4 p-5 transition hover:shadow-lift">
      <Avatar name={user.name} size={44} />
      <div className="min-w-0">
        <div className="truncate font-semibold text-navy-900">{user.name}</div>
        <div className="truncate text-sm text-navy-400">{user.email}</div>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-3">
        <span className="hidden text-xs text-navy-400 sm:block">
          Requested {formatDate(user.created_at)}
        </span>
        {error && (
          <span className="text-sm font-medium text-rose-600">{error}</span>
        )}
        <Button
          variant="primary"
          onClick={() => decide("approve")}
          disabled={busy !== null}
        >
          {busy === "approve" ? "Approving…" : "Approve"}
        </Button>
        <Button
          variant="secondary"
          className="border-rose-200 text-rose-700 hover:bg-rose-50"
          onClick={() => decide("reject")}
          disabled={busy !== null}
        >
          {busy === "reject" ? "Rejecting…" : "Reject"}
        </Button>
      </div>
    </article>
  );
}
