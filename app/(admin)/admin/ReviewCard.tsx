"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SubmissionDetail } from "@/lib/types";
import {
  Avatar,
  Button,
  Pill,
  SubmissionStatusBadge,
  cn,
} from "@/components/ui";

// A single submission with intern context, media gallery, and review actions.
export function ReviewCard({ submission: s }: { submission: SubmissionDetail }) {
  const router = useRouter();
  const [comment, setComment] = useState("");
  const [sendBackOpen, setSendBackOpen] = useState(false);
  const [busy, setBusy] = useState<null | "approve" | "needs_revision">(null);
  const [error, setError] = useState<string | null>(null);

  const isApproved = s.status === "approved";

  async function review(action: "approve" | "needs_revision") {
    setError(null);
    if (action === "needs_revision" && comment.trim().length === 0) {
      setError("Add a note telling the intern what to fix.");
      return;
    }
    setBusy(action);
    try {
      const res = await fetch("/api/admin/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId: s.id,
          action,
          comment: action === "needs_revision" ? comment.trim() : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Could not save review.");
      }
      setSendBackOpen(false);
      setComment("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <article className="card animate-fade-up p-6 transition hover:shadow-lift">
      {/* Header: intern + mission + status */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar name={s.user.name} size={44} />
          <div>
            <div className="font-semibold text-navy-900">{s.user.name}</div>
            <div className="text-sm text-navy-400">{s.user.email}</div>
          </div>
        </div>
        <SubmissionStatusBadge status={s.status} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h2 className="font-display text-lg font-bold text-navy-900">
          {s.mission.title}
        </h2>
        <Pill>{s.mission.deliverable_type}</Pill>
      </div>

      {/* Memo */}
      {s.memo && (
        <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-sand p-4 text-sm leading-relaxed text-navy-700">
          {s.memo}
        </p>
      )}

      {/* Media gallery */}
      {s.files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {s.files.map((f) => {
            const src = `/api/files/${f.path}`;
            if (f.kind === "image") {
              return (
                <a
                  key={f.id}
                  href={src}
                  target="_blank"
                  rel="noreferrer"
                  className="group block overflow-hidden rounded-xl border border-navy-100"
                  title={f.original_name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={f.original_name}
                    className="h-32 w-full object-cover transition group-hover:scale-105"
                  />
                </a>
              );
            }
            if (f.kind === "video") {
              return (
                <video
                  key={f.id}
                  controls
                  src={src}
                  className="h-32 w-full rounded-xl border border-navy-100 bg-navy-900 object-cover"
                />
              );
            }
            return (
              <a
                key={f.id}
                href={src}
                target="_blank"
                rel="noreferrer"
                className="flex h-32 items-center justify-center rounded-xl border border-dashed border-navy-200 px-3 text-center text-xs font-medium text-navy-500 hover:bg-navy-50"
              >
                {f.original_name}
              </a>
            );
          })}
        </div>
      )}

      {/* Existing admin note when sent back */}
      {s.status === "needs_revision" && s.admin_comment && (
        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-rose-600">
            Sent back with note
          </div>
          <p className="mt-1 whitespace-pre-wrap text-sm text-rose-800">
            {s.admin_comment}
          </p>
        </div>
      )}

      {/* Actions */}
      {!isApproved && (
        <div className="mt-5 border-t border-navy-100 pt-5">
          {error && (
            <p className="mb-3 text-sm font-medium text-rose-600">{error}</p>
          )}

          {!sendBackOpen ? (
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => review("approve")}
                disabled={busy !== null}
              >
                {busy === "approve" ? "Approving…" : "Approve"}
              </Button>
              <Button
                variant="secondary"
                className="border-rose-200 text-rose-700 hover:bg-rose-50"
                onClick={() => {
                  setError(null);
                  setSendBackOpen(true);
                }}
                disabled={busy !== null}
              >
                Send back
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="label" htmlFor={`comment-${s.id}`}>
                What should they fix?
              </label>
              <textarea
                id={`comment-${s.id}`}
                className="input min-h-[96px] resize-y"
                placeholder="Be specific — e.g. include a wider shot and add the date to your memo."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  className={cn(
                    "border-rose-200 text-rose-700 hover:bg-rose-50",
                  )}
                  onClick={() => review("needs_revision")}
                  disabled={busy !== null}
                >
                  {busy === "needs_revision"
                    ? "Sending…"
                    : "Send back for revision"}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSendBackOpen(false);
                    setError(null);
                  }}
                  disabled={busy !== null}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </article>
  );
}
