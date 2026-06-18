import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/brand/Logo";

// Public splash. Approved users are sent straight to their home.
export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <main className="relative min-h-screen overflow-hidden bg-navy-gradient text-white">
      {/* Ambient glow + grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-hero-glow opacity-80" />
      <div
        className="pointer-events-none absolute -top-40 right-[-10%] h-[36rem] w-[36rem] rounded-full bg-mirae/20 blur-[140px]"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-5 py-8 sm:px-8">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Logo href="/" subtitle="Summer Missions" inverted />
          <Link
            href="/login"
            className="text-sm font-medium text-white/70 transition hover:text-white"
          >
            Sign in
          </Link>
        </header>

        {/* Hero */}
        <div className="flex flex-1 items-center py-16">
          <div className="max-w-2xl animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-mirae-300">
              <span className="h-1.5 w-1.5 rounded-full bg-mirae" />
              Mirae Asset Securities
            </span>

            <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              2026 Summer
              <br />
              <span className="bg-gradient-to-r from-mirae-300 via-mirae to-mirae-500 bg-clip-text text-transparent">
                Missions
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/65">
              A curated set of hands-on missions for our summer interns. Explore the firm,
              ship real deliverables, and build the habits of a Mirae Asset professional —
              one mission at a time.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/login" className="btn-primary px-6 py-3 text-base">
                Sign in
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14m-6-6 6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
              <Link
                href="/request-access"
                className="btn px-6 py-3 text-base border border-white/20 bg-white/5 text-white backdrop-blur hover:bg-white/10"
              >
                Request access
              </Link>
            </div>
          </div>
        </div>

        {/* Footer strip */}
        <footer className="flex flex-col gap-2 border-t border-white/10 py-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Mirae Asset Securities · Internship Program</span>
          <span>Access is granted by an administrator.</span>
        </footer>
      </div>
    </main>
  );
}
