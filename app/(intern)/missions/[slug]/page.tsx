import Link from "next/link";
import { redirect, notFound } from "next/navigation";

import { getSessionUser } from "@/lib/auth";
import { getMissionWithState } from "@/lib/queries";
import { Pill, StatusBadge } from "@/components/ui";
import type { SubmissionFile } from "@/lib/types";

import SubmissionForm from "./SubmissionForm";

function formatTime(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function MediaGallery({ files }: { files: SubmissionFile[] }) {
  if (files.length === 0) return null;

  const images = files.filter((f) => f.kind === "image");
  const videos = files.filter((f) => f.kind === "video");
  const others = files.filter((f) => f.kind === "other");

  return (
    <div className="mt-5 flex flex-col gap-5">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {images.map((f) => (
            <a
              key={f.id}
              href={`/api/files/${f.path}`}
              target="_blank"
              rel="noreferrer"
              className="group block overflow-hidden rounded-md border border-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/files/${f.path}`}
                alt={f.original_name}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </a>
          ))}
        </div>
      )}

      {videos.map((f) => (
        <video
          key={f.id}
          controls
          src={`/api/files/${f.path}`}
          className="w-full rounded-md border border-line bg-ink-950"
        />
      ))}

      {others.length > 0 && (
        <ul className="flex flex-col divide-y divide-line rounded-md border border-line">
          {others.map((f) => (
            <li key={f.id}>
              <a
                href={`/api/files/${f.path}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm text-ink-700 transition-colors hover:bg-ink-50"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="shrink-0 text-ink-400"
                  aria-hidden
                >
                  <path
                    d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="truncate">{f.original_name}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default async function MissionDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const m = await getMissionWithState(user.id, params.slug);
  if (!m) notFound();

  const submission = m.submission;
  const instructionLines = m.instructions
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <main className="min-h-screen bg-white">
      <div className="container-site py-10 sm:py-12">
        <Link href="/dashboard" className="arrow-link">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="rotate-180"
            aria-hidden
          >
            <path
              d="M5 12h14m0 0l-6-6m6 6l-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          All missions
        </Link>

        {/* Header */}
        <div className="mt-6 border-b border-line pb-8 animate-fade-up">
          <span className="eyebrow mb-3">Mission</span>
          <h1 className="font-display text-3xl font-bold tracking-tightest text-ink-900 sm:text-4xl">
            {m.title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-ink-500">
            {m.short_description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <StatusBadge state={m.state} />
            <Pill>{m.deliverable_type}</Pill>
          </div>
        </div>

        {/* Body */}
        <div className="mt-8 grid gap-8 animate-fade-up lg:grid-cols-[1.4fr_1fr]">
          {/* LEFT */}
          <div className="flex flex-col gap-8">
            <section className="card p-6">
              <h2 className="font-display text-lg font-semibold text-ink-900">
                Instructions
              </h2>
              <p className="mt-1 text-sm text-ink-500">
                Deliverable: {m.deliverable_type}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {instructionLines.map((line, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border border-ink-200 text-mirae"
                      aria-hidden
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-sm leading-relaxed text-ink-600">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {submission && (
              <section className="card p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-display text-lg font-semibold text-ink-900">
                    Your submission
                  </h2>
                  <StatusBadge state={m.state} />
                </div>
                <p className="mt-1 text-xs uppercase tracking-wide text-ink-400">
                  {submission.updated_at &&
                  submission.updated_at !== submission.created_at
                    ? `Updated ${formatTime(submission.updated_at)}`
                    : `Submitted ${formatTime(submission.created_at)}`}
                </p>

                {submission.status === "approved" && (
                  <div className="mt-5 rounded-md border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                    This mission has been approved. Nice work.
                  </div>
                )}

                {submission.status === "needs_revision" &&
                  submission.admin_comment && (
                    <div className="mt-5 rounded-md border border-rose-100 bg-rose-50 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                        Reviewer requested changes
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-rose-700/90">
                        {submission.admin_comment}
                      </p>
                    </div>
                  )}

                {submission.memo && (
                  <div className="mt-5">
                    <p className="eyebrow mb-2">Memo</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-600">
                      {submission.memo}
                    </p>
                  </div>
                )}

                <MediaGallery files={submission.files} />
              </section>
            )}
          </div>

          {/* RIGHT */}
          <div>
            <div className="lg:sticky lg:top-8">
              {m.state === "approved" ? (
                <section className="card p-6">
                  <div className="grid h-10 w-10 place-items-center rounded-md border border-emerald-100 bg-emerald-50 text-emerald-600">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">
                    Mission approved
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">
                    Your proof has been reviewed and approved. There's nothing
                    more to do here.
                  </p>
                </section>
              ) : (
                <SubmissionForm missionId={m.id} existing={submission ?? null} />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
