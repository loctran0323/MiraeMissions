"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./brand/Logo";
import { Avatar, cn } from "./ui";

export interface NavItem {
  label: string;
  href: string;
}

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
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Logo href={homeHref} />

        <nav className="hidden items-center gap-1 md:flex">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  active
                    ? "bg-mirae-50 text-mirae-700"
                    : "text-navy-500 hover:bg-navy-50 hover:text-navy-800",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <div className="text-sm font-semibold text-navy-900">{user.name}</div>
            <div className="text-xs capitalize text-navy-400">{user.role}</div>
          </div>
          <Avatar name={user.name} size={36} />
          <form action="/api/auth/logout" method="post">
            <button
              type="submit"
              aria-label="Sign out"
              className="grid h-9 w-9 place-items-center rounded-full text-navy-400 transition hover:bg-navy-50 hover:text-navy-700"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
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

      {/* Mobile nav row */}
      <nav className="flex items-center gap-1 overflow-x-auto border-t border-navy-100 px-5 py-2 md:hidden">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition",
                active ? "bg-mirae-50 text-mirae-700" : "text-navy-500",
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
