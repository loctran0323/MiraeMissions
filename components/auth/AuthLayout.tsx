import Link from "next/link";
import { Logo, MiraeMark } from "@/components/brand/Logo";

// Split-screen corporate auth layout: dark brand panel + form column.
export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-32 top-10 h-[34rem] w-[34rem] rounded-full bg-mirae/20 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-mirae/10 blur-[120px]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Logo href="/" inverted />
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-mirae-300">
              <span className="h-3 w-[3px] bg-mirae" />
              2026 Summer Internship
            </span>
            <h2 className="mt-6 max-w-md font-display text-4xl font-bold leading-tight tracking-tightest">
              Your summer at Mirae Asset starts here.
            </h2>
            <p className="mt-5 max-w-md text-white/60">
              Complete missions, submit your proof, and get reviewed by the team
              — all in one place.
            </p>
          </div>
          <div>
            <MiraeMark size={22} inverted />
            <span className="sr-only">Mirae Asset Securities</span>
          </div>
        </div>
      </div>

      {/* Form column */}
      <div className="flex flex-col bg-white">
        <div className="flex items-center justify-between border-b border-line px-6 py-5 lg:hidden">
          <Logo href="/" />
        </div>
        <div className="flex flex-1 items-center justify-center px-6 py-12">
          <div className="w-full max-w-sm">
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink-900">
              {title}
            </h1>
            {subtitle && <p className="mt-2 text-sm text-ink-500">{subtitle}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </div>
        <div className="px-6 pb-8 text-center text-xs text-ink-400">
          <Link href="/" className="hover:text-ink-700">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
