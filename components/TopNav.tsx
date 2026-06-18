"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./brand/Logo";
import { Avatar, cn } from "./ui";

export interface NavItem {
  label: string;
  href: string;
}

// Corporate header: thin utility bar, logo + horizontal nav, user + sign out.
export function TopNav({
  items,
  user,
  homeHref = "/dashboard",
}: {
  items: NavItem[];
  user: { name: string; role: string };
  homeHref?: string;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-white shadow-header">
      {/* Utility bar */}
      <div className="border-b border-line bg-ink-50">
        <div className="container-site flex h-8 items-center justify-end gap-4 text-[11px] font-medium tracking-wide text-ink-400">
          <span>Mirae Asset Securities</span>
          <span className="h-3 w-px bg-line" />
          <span>2026 Summer Internship</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container-site flex h-16 items-center justify-between">
        <Logo href={homeHref} />

        <nav className="hidden items-center gap-8 md:flex">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-5 text-sm font-semibold transition-colors",
                  active ? "text-ink-900" : "text-ink-500 hover:text-ink-900",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-0.5 bg-mirae transition-transform",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-[13px] font-semibold leading-tight text-ink-900">
              {user.name}
            </div>
            <div className="text-[11px] uppercase tracking-wide text-ink-400">
              {user.role}
            </div>
          </div>
          <Avatar name={user.name} size={34} />
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              aria-label="Sign out"
              className="grid h-9 w-9 place-items-center rounded-md border border-line text-ink-400 transition hover:border-ink-300 hover:text-ink-700"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 12H4m0 0l4-4m-4 4l4 4M14 4h3a3 3 0 013 3v10a3 3 0 01-3 3h-3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-line px-5 py-2 md:hidden">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded px-3 py-1.5 text-sm font-semibold transition",
                active ? "bg-ink-900 text-white" : "text-ink-500",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
