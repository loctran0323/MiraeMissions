"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Pill,
  SubmissionStatusBadge,
  ArrowRight,
} from "@/components/ui";
import type { SubmissionDetail } from "@/lib/types";

export function ReviewCard({ submission }: { submission: SubmissionDetail }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [showSendBack, setShowSendBack] = useState(false);
  const [loading, setLoading] = useState<null | "approve" | "needs_revision">(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const isApproved = submission.status === "approved";
  const isNeedsRevision = submission.status === "needs_revision";

  async function post(body: Record<string, unknown>) {
    const res = await fetch("/api/admin/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      throw new Error(data.error || "Something went wrong. Please try again.");
    }
  }

  async function onApprove() {
    setError(null);
    setLoading("approve");
    try {
      await post({ submissionId: submission.id, action: "approve" });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to approve.");
      setLoading(null);
    }
  }

  async function onSendBack() {
    setError(null);
    const note = comment.trim();
    if (!note) {
      setError("A comment is required when sending back for revision.");
      return;
    }
    setLoading("needs_revision");
    try {
      await post({
        submissionId: submission.id,
        action: "needs_revision",
        comment: note,
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to send back.");
      setLoading(null);
    }
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={submission.user.name} size={40} />
          <div>
            <div className="text-sm font-semibold text-ink-900">
              {submission.user.name}
            </div>
            <div className="text-xs text-ink-400">{submission.user.email}</div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <div className="font-display font-semibold text-ink-900">
            {submission.mission.title}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Pill>{submission.mission.deliverable_type}</Pill>
            <SubmissionStatusBadge status={submission.status} />
          </div>
        </div>
      </div>

      {/* Memo */}
      {submission.memo && (
        <blockquote className="mt-5 border-l-2 border-line pl-4 text-sm leading-relaxed text-ink-600">
          {submission.memo}
        </blockquote>
      )}

      {/* Media gallery */}
      {submission.files.length > 0 && (
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {submission.files.map((f) => {
            const src = "/api/files/" + f.path;
            if (f.kind === "image") {
              return (
                <a
                  key={f.id}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-md border border-line"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={f.original_name}
                    className="h-32 w-full object-cover transition group-hover:opacity-90"
                  />
                </a>
              );
            }
            if (f.kind === "video") {
              return (
                <video
                  key={f.id}
                  src={src}
                  controls
                  className="h-32 w-full rounded-md border border-line bg-ink-950 object-cover"
                />
              );
            }
            return (
              <a
                key={f.id}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="flex h-32 flex-col items-center justify-center rounded-md border border-dashed border-line bg-ink-50 px-3 text-center text-xs font-medium text-ink-500 transition hover:border-ink-300 hover:text-ink-700"
              >
                <span className="truncate">{f.original_name}</span>
                <span className="mt-1 text-[11px] text-ink-400">Download</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Existing send-back note */}
      {isNeedsRevision && submission.admin_comment && (
        <div className="mt-5 rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-rose-600">
            Sent back for revision
          </div>
          {submission.admin_comment}
        </div>
      )}

      {/* Actions */}
      {isApproved ? (
        <div className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Approved
        </div>
      ) : (
        <div className="mt-6 border-t border-line pt-5">
          {error && (
            <div className="mb-4 rounded-md border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-sm text-rose-700">
              {error}
            </div>
          )}

          {!showSendBack ? (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onApprove}
                disabled={loading !== null}
                className="btn-primary"
              >
                {loading === "approve" ? (
                  "Approving…"
                ) : (
                  <>
                    Approve <ArrowRight />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setShowSendBack(true);
                }}
                disabled={loading !== null}
                className="btn-outline text-rose-600 hover:border-rose-300"
              >
                Send back
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="What needs to be fixed?"
                className="input resize-y"
              />
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onSendBack}
                  disabled={loading !== null}
                  className="btn-outline text-rose-600 hover:border-rose-300"
                >
                  {loading === "needs_revision"
                    ? "Sending…"
                    : "Send back for revision"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowSendBack(false);
                    setComment("");
                    setError(null);
                  }}
                  disabled={loading !== null}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
