import { PageHeader } from "@/components/ui";
import { getAllSubmissionDetails } from "@/lib/queries";
import { ReviewCard } from "./ReviewCard";

export default async function ReviewQueuePage() {
  const subs = await getAllSubmissionDetails();

  const inReview = subs.filter((s) => s.status === "submitted").length;
  const approved = subs.filter((s) => s.status === "approved").length;
  const needsRevision = subs.filter((s) => s.status === "needs_revision").length;

  // Awaiting review first, then everything else (already newest-first from query).
  const order: Record<string, number> = {
    submitted: 0,
    needs_revision: 1,
    approved: 2,
  };
  const sorted = [...subs].sort(
    (a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9),
  );

  const stats = [
    { label: "In review", value: inReview, accent: true },
    { label: "Approved", value: approved },
    { label: "Needs revision", value: needsRevision },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="container-site py-10 sm:py-12">
        <div className="animate-fade-up">
          <PageHeader
            eyebrow="Administration"
            title="Review queue"
            description="Review intern submissions. Approve them, or send them back with feedback."
          />
        </div>

        <div className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line animate-fade-up">
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-5 py-5">
              <div
                className={
                  "font-display text-3xl font-bold tracking-tightest " +
                  (s.accent ? "text-mirae" : "text-ink-900")
                }
              >
                {s.value}
              </div>
              <div className="mt-1 text-xs font-medium uppercase tracking-wide text-ink-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {sorted.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-line bg-ink-50 px-6 py-16 text-center animate-fade-up">
            <p className="font-display text-lg font-semibold text-ink-900">
              Nothing to review yet
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Submissions from interns will appear here as they come in.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4 animate-fade-up">
            {sorted.map((s) => (
              <ReviewCard key={s.id} submission={s} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
