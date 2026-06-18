import type { InternProgress } from "@/lib/types";
import { Avatar, Pill, ProgressBar, SubmissionStatusBadge } from "@/components/ui";

// Privacy-safe peer summary card — no submission contents revealed.
export function PeerCard({ entry }: { entry: InternProgress }) {
  const { user, approvedCount, totalMissions, latest } = entry;

  return (
    <div className="card flex h-full flex-col gap-5 p-6 transition hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-center gap-3">
        <Avatar name={user.name} size={44} />
        <div className="min-w-0 flex-1">
          <div className="truncate font-display font-semibold text-navy-900">
            {user.name}
          </div>
          <div className="truncate text-sm text-navy-400">{user.email}</div>
        </div>
        <Pill>
          {approvedCount}/{totalMissions} reviewed
        </Pill>
      </div>

      <ProgressBar value={approvedCount} max={totalMissions} />

      {latest && (
        <div className="flex items-center justify-between gap-3 border-t border-navy-100 pt-4">
          <div className="min-w-0">
            <div className="text-xs font-medium uppercase tracking-wide text-navy-400">
              Latest mission
            </div>
            <div className="truncate text-sm font-medium text-navy-700">
              {latest.missionTitle}
            </div>
          </div>
          <SubmissionStatusBadge status={latest.status} />
        </div>
      )}
    </div>
  );
}
