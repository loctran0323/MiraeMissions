import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getMissionsWithState } from "@/lib/queries";
import { PageHeader, ProgressBar } from "@/components/ui";
import MissionCard from "./MissionCard";

export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const missions = await getMissionsWithState(user.id);

  const approvedCount = missions.filter((m) => m.state === "approved").length;
  const submittedCount = missions.filter((m) => m.state === "submitted").length;
  const notStartedCount = missions.filter(
    (m) => m.state === "not_started",
  ).length;

  const stats = [
    { label: "Approved", value: approvedCount },
    { label: "In review", value: submittedCount },
    { label: "Not started", value: notStartedCount },
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="container-site py-10 sm:py-12">
        <PageHeader
          eyebrow="2026 Summer Missions"
          title={`Welcome back, ${user.name.split(" ")[0]}`}
          description="Complete each mission and submit your proof for review."
        >
          <div className="w-[14rem]">
            <div className="flex items-baseline justify-between">
              <span className="font-display text-2xl font-bold text-ink-900">
                {approvedCount}
                <span className="text-ink-300"> / {missions.length}</span>
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                Approved
              </span>
            </div>
            <ProgressBar
              value={approvedCount}
              max={missions.length}
              className="mt-3"
            />
          </div>
        </PageHeader>

        <div className="animate-fade-up">
          <div className="mt-8 grid grid-cols-3 divide-x divide-line overflow-hidden rounded-lg border border-line">
            {stats.map((s) => (
              <div key={s.label} className="px-5 py-4">
                <div className="font-display text-2xl font-bold text-ink-900">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {missions.length === 0 ? (
            <div className="mt-8 rounded-lg border border-line bg-white px-6 py-16 text-center">
              <p className="font-display text-lg font-semibold text-ink-900">
                No missions yet
              </p>
              <p className="mt-2 text-sm text-ink-500">
                Missions will appear here once they are published.
              </p>
            </div>
          ) : (
            <div className="mt-8 divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
              {missions.map((m, i) => (
                <MissionCard key={m.id} mission={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
