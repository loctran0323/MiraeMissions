"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import type { Submission, SubmissionFile } from "@/lib/types";
import { Button, cn } from "@/components/ui";

type ExistingSubmission = (Submission & { files: SubmissionFile[] }) | null;

interface Props {
  missionId: number;
  slug: string;
  existing: ExistingSubmission;
}

// A staged file plus an object URL for image previews (revoked on removal).
interface Staged {
  id: string;
  file: File;
  url: string;
}

export default function SubmissionForm({ missionId, existing }: Props) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [staged, setStaged] = React.useState<Staged[]>([]);
  const [memo, setMemo] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const isResubmit = existing?.status === "needs_revision";

  // Clean up preview object URLs when component unmounts.
  React.useEffect(() => {
    return () => staged.forEach((s) => URL.revokeObjectURL(s.url));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(list: FileList | null) {
    if (!list || list.length === 0) return;
    const next: Staged[] = Array.from(list).map((file) => ({
      id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2)}`,
      file,
      url: URL.createObjectURL(file),
    }));
    setStaged((prev) => [...prev, ...next]);
    setSuccess(false);
    setError(null);
  }

  function removeStaged(id: string) {
    setStaged((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((s) => s.id !== id);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (staged.length === 0 && !memo.trim()) {
      setError("Add at least one photo or video, or write a memo.");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.set("missionId", String(missionId));
      fd.set("memo", memo);
      staged.forEach((s) => fd.append("files", s.file));

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Submission failed. Please try again.");
      }

      // Reset staged state and refresh server data so the new submission shows.
      staged.forEach((s) => URL.revokeObjectURL(s.url));
      setStaged([]);
      setMemo("");
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Dropzone / file picker */}
      <div>
        <span className="label">Proof of completion</span>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="dropzone group mt-1 flex w-full flex-col items-center justify-center gap-2 text-center"
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-mirae-50 text-mirae transition group-hover:scale-105">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 16V4m0 0L7 9m5-5l5 5M5 20h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="text-sm font-semibold text-navy-800">
            Click to choose files
          </span>
          <span className="text-xs text-navy-400">
            Photos or videos — your proof of completion
          </span>
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = ""; // allow re-selecting the same file
          }}
        />
      </div>

      {/* Staged previews */}
      {staged.length > 0 && (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {staged.map((s) => {
            const isImage = s.file.type.startsWith("image/");
            return (
              <li
                key={s.id}
                className="group relative overflow-hidden rounded-xl border border-navy-100 bg-navy-50"
              >
                <div className="flex aspect-square items-center justify-center">
                  {isImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.url}
                      alt={s.file.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-navy-400">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                        <path
                          d="M4 6a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M16 9l4-2v10l-4-2"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="px-2 text-[11px] font-medium">Video</span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeStaged(s.id)}
                  aria-label={`Remove ${s.file.name}`}
                  className="absolute right-1.5 top-1.5 grid h-6 w-6 place-items-center rounded-full bg-navy-900/70 text-white opacity-0 backdrop-blur transition group-hover:opacity-100"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
                <div className="truncate border-t border-navy-100 bg-white px-2 py-1 text-[11px] text-navy-500">
                  {s.file.name}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Memo */}
      <div>
        <label htmlFor="memo" className="label">
          Memo for the reviewer (optional)
        </label>
        <textarea
          id="memo"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={3}
          placeholder="Add any context the reviewer should know…"
          className="input mt-1 resize-y"
        />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Submitted for review. Thanks!
        </div>
      )}

      <Button type="submit" disabled={loading} className={cn(loading && "opacity-70")}>
        {loading
          ? "Submitting…"
          : isResubmit
            ? "Resubmit"
            : "Submit for review"}
      </Button>
    </form>
  );
}
