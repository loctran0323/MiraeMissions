import Link from "next/link";
import type { MissionWithState } from "@/lib/types";
import { ArrowRight, Pill, StatusBadge } from "@/components/ui";

// A single mission rendered as a full-width list row (corporate list format).
export default function MissionCard({
  mission,
  index,
}: {
  mission: MissionWithState;
  index: number;
}) {
  return (
    <Link
      href={`/missions/${mission.slug}`}
      className="group flex items-center gap-5 px-5 py-4 transition-colors hover:bg-ink-50"
    >
      <span className="w-8 shrink-0 font-display text-sm font-bold text-mirae">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="min-w-0 flex-1">
        <h3 className="truncate font-display text-[15px] font-semibold text-ink-900">
          {mission.title}
        </h3>
        <p className="mt-0.5 truncate text-sm text-ink-500">
          {mission.short_description}
        </p>
      </div>

      <Pill className="hidden md:inline-flex">{mission.deliverable_type}</Pill>
      <StatusBadge state={mission.state} />
      <ArrowRight className="shrink-0 text-ink-300 transition-all group-hover:translate-x-0.5 group-hover:text-mirae" />
    </Link>
  );
}
