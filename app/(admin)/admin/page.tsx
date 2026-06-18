import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getAllSubmissionDetails } from "@/lib/queries";
import { Pill } from "@/components/ui";
import { ReviewCard } from "./ReviewCard";

// Admin review queue: every submission, awaiting-review items first.
export default async function ReviewQueuePage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/login");

  const subs = await getAllSubmissionDetails();

  // Awaiting review first; otherwise keep newest-activity order from the query.
  const order = { submitted: 0, needs_revision: 1, approved: 2 } as const;
  const sorted = [...subs].sort((a, b) => order[a.status] - order[b.status]);

  const counts = {
    submitted: subs.filter((s) => s.status === "submitted").length,
    approved: subs.filter((s) => s.status === "approved").length,
    needs_revision: subs.filter((s) => s.status === "needs_revision").length,
  };

  return (
    <main className="bg-page min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <header className="animate-fade-up">
          <p className="eyebrow">Admin console</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Review queue
          </h1>
          <p className="mt-2 max-w-2xl text-navy-500">
            Approve completed missions or send them back with a note so interns
            know exactly what to fix.
          </p>

          {/* Summary stat pills */}
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Pill className="bg-mirae-50 text-mirae-700">
              <span className="h-1.5 w-1.5 rounded-full bg-mirae" />
              {counts.submitted} awaiting review
            </Pill>
            <Pill className="bg-emerald-50 text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {counts.approved} approved
            </Pill>
            <Pill className="bg-rose-50 text-rose-700">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              {counts.needs_revision} need revision
            </Pill>
          </div>
        </header>

        <section className="mt-8 space-y-5">
          {sorted.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="font-display text-lg font-bold text-navy-900">
                Nothing to review yet
              </p>
              <p className="text-sm text-navy-500">
                Submissions will appear here as interns complete their missions.
              </p>
            </div>
          ) : (
            sorted.map((s) => <ReviewCard key={s.id} submission={s} />)
          )}
        </section>
      </div>
    </main>
  );
}
