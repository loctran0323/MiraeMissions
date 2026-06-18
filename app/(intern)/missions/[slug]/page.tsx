import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getMissionWithState } from "@/lib/queries";
import type { SubmissionFile } from "@/lib/types";
import { Pill, StatusBadge } from "@/components/ui";
import SubmissionForm from "./SubmissionForm";

// Renders a stored proof file (image thumbnail, inline video, or download link).
function FileTile({ file }: { file: SubmissionFile }) {
  const src = `/api/files/${file.path}`;
  if (file.kind === "image") {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-xl border border-navy-100 bg-navy-50 transition hover:shadow-lift"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={file.original_name}
          className="aspect-square w-full object-cover"
        />
      </a>
    );
  }
  if (file.kind === "video") {
    return (
      <div className="overflow-hidden rounded-xl border border-navy-100 bg-black">
        <video controls src={src} className="aspect-square w-full object-contain" />
      </div>
    );
  }
  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl border border-navy-100 bg-white px-4 py-3 text-sm font-medium text-navy-700 transition hover:shadow-lift"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="truncate">{file.original_name}</span>
    </a>
  );
}

function formatTime(iso: string): string {
  // DB times are UTC ("YYYY-MM-DD HH:MM:SS"); normalize to an ISO instant.
  const d = new Date(iso.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function MissionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const m = getMissionWithState(user.id, params.slug);
  if (!m) notFound();

  const sub = m.submission;
  const isApproved = m.state === "approved";
  const needsRevision = m.state === "needs_revision";
  const instructionLines = m.instructions
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <main className="bg-page min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        {/* Back link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-400 transition hover:text-navy-700"
        >
          <span aria-hidden>←</span> All missions
        </Link>

        {/* Header */}
        <header className="mt-4 animate-fade-up">
          <div className="flex flex-wrap items-center gap-3">
            <Pill>{m.deliverable_type}</Pill>
            <StatusBadge state={m.state} />
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            {m.title}
          </h1>
          <p className="mt-2 max-w-2xl text-navy-500">{m.short_description}</p>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          {/* Instructions */}
          <section className="card animate-fade-up">
            <h2 className="font-display text-lg font-semibold text-navy-900">
              Instructions
            </h2>
            <p className="eyebrow mt-3">{m.deliverable_type}</p>
            <ul className="mt-4 space-y-3">
              {instructionLines.map((line, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-navy-700">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full border border-mirae-200 bg-mirae-50 text-mirae">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Submission column */}
          <div className="space-y-6">
            {/* Existing submission */}
            {sub && (
              <section className="card animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-navy-900">
                    Your submission
                  </h2>
                  <StatusBadge state={m.state} />
                </div>

                {needsRevision && sub.admin_comment && (
                  <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                      Reviewer asked for changes:
                    </p>
                    <p className="mt-1 text-sm text-rose-700">{sub.admin_comment}</p>
                  </div>
                )}

                {isApproved && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M5 13l4 4L19 7"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Approved — nice work. No further action needed.
                  </div>
                )}

                {sub.memo && (
                  <p className="mt-4 whitespace-pre-wrap rounded-xl bg-navy-50 px-4 py-3 text-sm text-navy-700">
                    {sub.memo}
                  </p>
                )}

                {sub.files.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {sub.files.map((f) => (
                      <FileTile key={f.id} file={f} />
                    ))}
                  </div>
                )}

                <p className="mt-4 text-xs text-navy-400">
                  {sub.reviewed_at
                    ? `Reviewed ${formatTime(sub.reviewed_at)}`
                    : `Submitted ${formatTime(sub.updated_at)}`}
                </p>
              </section>
            )}

            {/* Submit / resubmit (hidden when approved) */}
            {isApproved ? (
              <section className="card-muted animate-fade-up">
                <p className="text-sm text-navy-500">
                  This mission is approved. Your files above remain available to view.
                </p>
              </section>
            ) : (
              <section className="card animate-fade-up">
                <h2 className="font-display text-lg font-semibold text-navy-900">
                  {needsRevision ? "Update your submission" : "Submit your proof"}
                </h2>
                <p className="mt-1 text-sm text-navy-400">
                  {needsRevision
                    ? "Address the reviewer's notes, then resubmit."
                    : "Upload photos or videos showing you completed this mission."}
                </p>
                <div className="mt-5">
                  <SubmissionForm
                    missionId={m.id}
                    slug={m.slug}
                    existing={sub ?? null}
                  />
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
