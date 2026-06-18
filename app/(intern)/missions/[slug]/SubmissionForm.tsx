"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui";
import type { Submission, SubmissionFile } from "@/lib/types";

type StagedFile = {
  id: string;
  file: File;
  previewUrl?: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function SubmissionForm({
  missionId,
  existing,
}: {
  missionId: number;
  existing: (Submission & { files: SubmissionFile[] }) | null;
}) {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const [staged, setStaged] = React.useState<StagedFile[]>([]);
  const [memo, setMemo] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const isResubmit = existing?.status === "needs_revision";

  React.useEffect(() => {
    return () => {
      staged.forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const next: StagedFile[] = Array.from(fileList).map((file) => ({
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random()
        .toString(36)
        .slice(2)}`,
      file,
      previewUrl: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : undefined,
    }));
    setStaged((prev) => [...prev, ...next]);
    setError(null);
    setSuccess(false);
  }

  function removeFile(id: string) {
    setStaged((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (staged.length === 0 && !memo.trim()) {
      setError("Add at least one photo/video or a memo before submitting.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("missionId", String(missionId));
      formData.append("memo", memo.trim());
      staged.forEach((s) => formData.append("files", s.file));

      const res = await fetch("/api/submissions", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }

      staged.forEach((s) => s.previewUrl && URL.revokeObjectURL(s.previewUrl));
      setStaged([]);
      setMemo("");
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h2 className="font-display text-lg font-semibold text-ink-900">
        Submit your proof
      </h2>
      <p className="mt-1 text-sm text-ink-500">
        {isResubmit
          ? "Address the reviewer's feedback and resubmit."
          : "Upload your photos or videos and add an optional note."}
      </p>

      {success && (
        <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          Submitted for review. We'll notify you once it's been looked at.
        </div>
      )}

      {error && (
        <div className="mt-5 rounded-md border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {error}
        </div>
      )}

      {/* Dropzone */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="dropzone mt-5 flex w-full flex-col items-center justify-center gap-2 text-center"
      >
        <span className="grid h-11 w-11 place-items-center rounded-md border border-line bg-white text-ink-400">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 16V4m0 0L7 9m5-5l5 5M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-sm font-medium text-ink-700">Click to upload</span>
        <span className="text-xs text-ink-400">
          Photos or videos — your proof of completion
        </span>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </button>

      {/* Staged files */}
      {staged.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {staged.map((s) => (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-md border border-line p-2"
            >
              {s.previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={s.previewUrl}
                  alt={s.file.name}
                  className="h-10 w-10 shrink-0 rounded object-cover"
                />
              ) : (
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-ink-50 text-ink-400">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 4l14 8-14 8V4z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-700">
                  {s.file.name}
                </p>
                <p className="text-xs text-ink-400">{formatSize(s.file.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(s.id)}
                aria-label={`Remove ${s.file.name}`}
                className="grid h-7 w-7 shrink-0 place-items-center rounded text-ink-400 transition-colors hover:bg-ink-50 hover:text-ink-700"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Memo */}
      <div className="mt-5">
        <label htmlFor="memo" className="label">
          Memo for the reviewer (optional)
        </label>
        <textarea
          id="memo"
          rows={4}
          value={memo}
          onChange={(e) => {
            setMemo(e.target.value);
            setSuccess(false);
          }}
          placeholder="Add any context that helps the reviewer…"
          className="input mt-1.5 resize-y"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        className="mt-5 w-full"
        disabled={submitting}
      >
        {submitting
          ? "Submitting…"
          : isResubmit
          ? "Resubmit"
          : "Submit for review"}
      </Button>
    </form>
  );
}
