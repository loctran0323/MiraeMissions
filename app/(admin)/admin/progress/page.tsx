import {
  PageHeader,
  Avatar,
  ProgressBar,
  SubmissionStatusBadge,
} from "@/components/ui";
import { getInternProgress } from "@/lib/queries";

export default async function ProgressPage() {
  const interns = await getInternProgress();

  const totalMissions = interns[0]?.totalMissions ?? 0;
  const cohortApproved = interns.reduce((sum, i) => sum + i.approvedCount, 0);
  const cohortTotal = interns.length * totalMissions;
  const cohortPct =
    cohortTotal > 0 ? Math.round((cohortApproved / cohortTotal) * 100) : 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="container-site py-10 sm:py-12">
        <div className="animate-fade-up">
          <PageHeader
            eyebrow="Administration"
            title="Intern progress"
            description="Track every intern's completion across all missions."
          />
        </div>

        {/* Aggregate card */}
        <div className="mt-8 card p-6 animate-fade-up sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="eyebrow mb-3">Cohort completion</span>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-5xl font-bold tracking-tightest text-ink-900">
                  {cohortApproved}
                </span>
                <span className="font-display text-2xl font-semibold text-ink-300">
                  / {cohortTotal}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-500">
                approved deliverables across {interns.length}{" "}
                {interns.length === 1 ? "intern" : "interns"}
              </p>
            </div>
            <div className="font-display text-3xl font-bold tracking-tightest text-mirae">
              {cohortPct}%
            </div>
          </div>
          <ProgressBar value={cohortApproved} max={cohortTotal} className="mt-6" />
        </div>

        {interns.length === 0 ? (
          <div className="mt-8 rounded-lg border border-dashed border-line bg-ink-50 px-6 py-16 text-center animate-fade-up">
            <p className="font-display text-lg font-semibold text-ink-900">
              No interns yet
            </p>
            <p className="mt-1 text-sm text-ink-500">
              Approved interns will appear here once they join the cohort.
            </p>
          </div>
        ) : (
          <>
            {/* Table (md+) */}
            <div className="mt-8 hidden overflow-hidden rounded-lg border border-line animate-fade-up md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-line bg-ink-50 text-left text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                    <th className="px-5 py-3">Intern</th>
                    <th className="px-5 py-3">Approved</th>
                    <th className="px-5 py-3 w-48">Progress</th>
                    <th className="px-5 py-3">Latest activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {interns.map((i) => (
                    <tr key={i.user.id} className="transition hover:bg-ink-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={i.user.name} size={34} />
                          <div>
                            <div className="font-semibold text-ink-900">
                              {i.user.name}
                            </div>
                            <div className="text-xs text-ink-400">
                              {i.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-display font-bold text-ink-900">
                          {i.approvedCount}
                        </span>
                        <span className="text-ink-300">
                          {" "}
                          / {i.totalMissions}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <ProgressBar
                          value={i.approvedCount}
                          max={i.totalMissions}
                        />
                      </td>
                      <td className="px-5 py-4">
                        {i.latest ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-ink-700">
                              {i.latest.missionTitle}
                            </span>
                            <SubmissionStatusBadge status={i.latest.status} />
                          </div>
                        ) : (
                          <span className="text-ink-300">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card list (mobile) */}
            <div className="mt-8 space-y-3 animate-fade-up md:hidden">
              {interns.map((i) => (
                <div key={i.user.id} className="card p-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={i.user.name} size={36} />
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-ink-900">
                        {i.user.name}
                      </div>
                      <div className="truncate text-xs text-ink-400">
                        {i.user.email}
                      </div>
                    </div>
                    <div className="ml-auto text-right">
                      <span className="font-display font-bold text-ink-900">
                        {i.approvedCount}
                      </span>
                      <span className="text-ink-300"> / {i.totalMissions}</span>
                    </div>
                  </div>
                  <ProgressBar
                    value={i.approvedCount}
                    max={i.totalMissions}
                    className="mt-4"
                  />
                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-3 text-sm">
                    {i.latest ? (
                      <>
                        <span className="text-ink-700">
                          {i.latest.missionTitle}
                        </span>
                        <SubmissionStatusBadge status={i.latest.status} />
                      </>
                    ) : (
                      <span className="text-ink-300">No activity yet</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
