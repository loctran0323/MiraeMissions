import Link from "next/link";
import type { MissionWithState } from "@/lib/types";
import { Pill, StatusBadge } from "@/components/ui";

// A single mission tile linking to its detail page. Server Component.
export function MissionCard({ mission }: { mission: MissionWithState }) {
  return (
    <Link
      href={`/missions/${mission.slug}`}
      className="card group flex h-full flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:shadow-lift"
    >
      <div className="flex items-start justify-between gap-3">
        {/* Subtle numeric index marker */}
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-navy-50 font-display text-sm font-bold text-navy-400 transition group-hover:bg-mirae-50 group-hover:text-mirae-700">
          {String(mission.sort_order).padStart(2, "0")}
        </span>
        <Pill>{mission.deliverable_type}</Pill>
      </div>

      <div className="flex-1 space-y-1.5">
        <h3 className="flex items-center gap-1.5 font-display text-lg font-semibold text-navy-900">
          <span className="flex-1">{mission.title}</span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
            className="shrink-0 text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-mirae"
          >
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </h3>
        <p className="text-sm leading-relaxed text-navy-500">
          {mission.short_description}
        </p>
      </div>

      <div className="pt-1">
        <StatusBadge state={mission.state} />
      </div>
    </Link>
  );
}
