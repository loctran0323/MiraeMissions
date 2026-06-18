import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getMissionsWithState } from "@/lib/queries";
import { ProgressBar } from "@/components/ui";
import { MissionCard } from "./MissionCard";

// Intern missions board.
export default async function DashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const missions = getMissionsWithState(user.id);
  const total = missions.length;
  const approvedCount = missions.filter((m) => m.state === "approved").length;
  const firstName = user.name.split(" ")[0];

  return (
    <main className="bg-page min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        {/* Hero */}
        <section className="bg-hero-glow animate-fade-up rounded-3xl border border-navy-100 px-7 py-12 sm:px-12 sm:py-14">
          <p className="eyebrow">Welcome back, {firstName}</p>
          <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-navy-900 sm:text-5xl">
            2026 Summer Missions
          </h1>
          <p className="mt-3 max-w-xl text-base text-navy-500">
            Complete each mission and upload your deliverable.
          </p>

          {/* Progress */}
          <div className="card mt-8 max-w-md p-5">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-navy-900">
                {approvedCount} of {total} reviewed
              </span>
              <span className="text-navy-400">
                {total > 0 ? Math.round((approvedCount / total) * 100) : 0}%
              </span>
            </div>
            <ProgressBar value={approvedCount} max={total} className="mt-3" />
          </div>
        </section>

        {/* Missions grid */}
        <section className="mt-10 grid animate-fade-up grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} />
          ))}
        </section>
      </div>
    </main>
  );
}
