import * as React from "react";
import type { MissionState, SubmissionStatus } from "@/lib/types";

export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------- Button ------------------------------- */

type ButtonVariant = "primary" | "dark" | "outline" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  const styles: Record<ButtonVariant, string> = {
    primary: "btn-primary",
    dark: "btn-dark",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };
  return <button className={cn(styles[variant], className)} {...props} />;
}

/* ------------------------------- Arrow -------------------------------- */

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M5 12h14m0 0l-6-6m6 6l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* -------------------------------- Avatar ------------------------------ */

export function Avatar({
  name,
  size = 36,
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
        "grid shrink-0 place-items-center rounded-md bg-ink-900 font-display font-semibold text-white",
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
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-ink-100", className)}>
      <div
        className="h-full rounded-full bg-mirae transition-all duration-700"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/* ------------------------------- Badges ------------------------------- */

const STATE_STYLES: Record<MissionState, { label: string; cls: string; dot: string }> = {
  not_started: {
    label: "Not started",
    cls: "bg-ink-50 text-ink-500 border-line",
    dot: "bg-ink-300",
  },
  submitted: {
    label: "In review",
    cls: "bg-mirae-50 text-mirae-700 border-mirae-100",
    dot: "bg-mirae",
  },
  approved: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  needs_revision: {
    label: "Needs revision",
    cls: "bg-rose-50 text-rose-700 border-rose-100",
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
        "inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        s.cls,
        className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

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
        "inline-flex items-center gap-1.5 rounded border border-line bg-white px-2 py-0.5 text-[11px] font-medium text-ink-500",
        className,
      )}
    >
      {children}
    </span>
  );
}

/* --------------------------- Page section head ------------------------ */

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <span className="eyebrow mb-3">{eyebrow}</span>}
        <h1 className="font-display text-3xl font-bold tracking-tightest text-ink-900 sm:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">{description}</p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
