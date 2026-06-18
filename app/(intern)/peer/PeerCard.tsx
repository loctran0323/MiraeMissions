import type { InternProgress } from "@/lib/types";
import { Avatar, ProgressBar, SubmissionStatusBadge } from "@/components/ui";

export default function PeerCard({ entry }: { entry: InternProgress }) {
  const { user, approvedCount, totalMissions, latest } = entry;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={user.name} size={40} />
          <div className="min-w-0">
            <div className="truncate font-semibold text-ink-900">
              {user.name}
            </div>
            <div className="truncate text-xs text-ink-400">{user.email}</div>
          </div>
        </div>
        <span className="shrink-0 font-display text-sm font-bold text-ink-900">
          {approvedCount}
          <span className="text-ink-300">/{totalMissions}</span>
        </span>
      </div>

      <ProgressBar value={approvedCount} max={totalMissions} className="mt-4" />

      {latest && (
        <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
          <span className="truncate text-sm text-ink-600">
            {latest.missionTitle}
          </span>
          <SubmissionStatusBadge status={latest.status} />
        </div>
      )}
    </div>
  );
}
