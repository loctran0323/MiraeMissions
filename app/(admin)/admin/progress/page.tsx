import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getInternProgress } from "@/lib/queries";
import {
  Avatar,
  ProgressBar,
  SubmissionStatusBadge,
} from "@/components/ui";

function formatDate(iso: string) {
  return new Date(iso.includes("Z") ? iso : iso + "Z").toLocaleDateString(
    undefined,
    { month: "short", day: "numeric" },
  );
}

// Overview of every approved intern's progress toward all missions.
export default async function ProgressPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/login");

  const interns = await getInternProgress();
  const totalMissions = interns[0]?.totalMissions ?? 0;

  // Aggregate completion across the whole cohort.
  const totalApproved = interns.reduce((s, i) => s + i.approvedCount, 0);
  const totalPossible = interns.length * totalMissions;
  const overallPct =
    totalPossible > 0 ? Math.round((totalApproved / totalPossible) * 100) : 0;

  return (
    <main className="bg-page min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <header className="animate-fade-up">
          <p className="eyebrow">Admin console</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Intern progress
          </h1>
          <p className="mt-2 max-w-2xl text-navy-500">
            Track how each intern is advancing through the summer missions.
          </p>
        </header>

        {/* Aggregate cohort completion */}
        <section className="card animate-fade-up mt-8 p-6 sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-sm font-medium text-navy-400">
                Cohort completion
              </div>
              <div className="font-display text-3xl font-extrabold text-navy-900">
                {overallPct}%
              </div>
            </div>
            <div className="text-right text-sm text-navy-500">
              <div>
                <span className="font-semibold text-navy-900">
                  {totalApproved}
                </span>{" "}
                approved
              </div>
              <div>
                {interns.length} interns · {totalMissions} missions each
              </div>
            </div>
          </div>
          <ProgressBar
            value={totalApproved}
            max={totalPossible}
            className="mt-4 h-2.5"
          />
        </section>

        {/* Per-intern cards */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          {interns.length === 0 ? (
            <div className="card col-span-full py-16 text-center text-navy-500">
              No approved interns yet.
            </div>
          ) : (
            interns.map((i) => (
              <article
                key={i.user.id}
                className="card animate-fade-up p-6 transition hover:-translate-y-0.5 hover:shadow-lift"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={i.user.name} size={44} />
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-navy-900">
                      {i.user.name}
                    </div>
                    <div className="truncate text-sm text-navy-400">
                      {i.user.email}
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-display text-lg font-bold text-navy-900">
                      {i.approvedCount}
                      <span className="text-navy-300">/{i.totalMissions}</span>
                    </div>
                    <div className="text-xs text-navy-400">approved</div>
                  </div>
                </div>

                <ProgressBar
                  value={i.approvedCount}
                  max={i.totalMissions}
                  className="mt-4"
                />

                <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                  {i.latest ? (
                    <>
                      <span className="min-w-0 truncate text-navy-500">
                        {i.latest.missionTitle}
                      </span>
                      <div className="flex shrink-0 items-center gap-2">
                        <SubmissionStatusBadge status={i.latest.status} />
                        <span className="text-xs text-navy-400">
                          {formatDate(i.latest.updated_at)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-navy-400">No activity yet</span>
                  )}
                </div>
              </article>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
