import * as React from "react";
import type { MissionState, SubmissionStatus } from "@/lib/types";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------- Button ------------------------------- */

type ButtonVariant = "primary" | "secondary" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const styles: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };
  return <button className={cn(styles[variant], className)} {...props} />;
}

/* -------------------------------- Avatar ------------------------------ */

export function Avatar({
  name,
  size = 40,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full bg-mirae-gradient font-display font-bold text-white shadow-glow",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.36 }}
    >
      {initials}
    </span>
  );
}

/* ------------------------------ ProgressBar --------------------------- */

export function ProgressBar({
  value,
  max,
  className,
}: {
  value: number;
  max: number;
  className?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-navy-100", className)}>
      <div
        className="h-full rounded-full bg-mirae-gradient transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ------------------------------- Badges ------------------------------- */

const STATE_STYLES: Record<MissionState, { label: string; cls: string; dot: string }> = {
  not_started: {
    label: "Not started",
    cls: "bg-navy-50 text-navy-500 border-navy-100",
    dot: "bg-navy-300",
  },
  submitted: {
    label: "Submitted",
    cls: "bg-mirae-50 text-mirae-700 border-mirae-200",
    dot: "bg-mirae",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  needs_revision: {
    label: "Needs revision",
    cls: "bg-rose-50 text-rose-700 border-rose-200",
    dot: "bg-rose-500",
  },
};

export function StatusBadge({
  state,
  className,
}: {
  state: MissionState;
  className?: string;
}) {
  const s = STATE_STYLES[state];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        s.cls,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

// Map a SubmissionStatus to the equivalent MissionState badge.
export function SubmissionStatusBadge({
  status,
  className,
}: {
  status: SubmissionStatus;
  className?: string;
}) {
  const map: Record<SubmissionStatus, MissionState> = {
    submitted: "submitted",
    approved: "approved",
    needs_revision: "needs_revision",
  };
  return <StatusBadge state={map[status]} className={className} />;
}

/* -------------------------------- Pill -------------------------------- */

export function Pill({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
