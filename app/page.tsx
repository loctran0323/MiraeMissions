import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo, MiraeMark } from "@/components/brand/Logo";
import { ArrowRight } from "@/components/ui";

export default async function LandingPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-ink-950 text-white">
      {/* ambient brand accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-mirae/20 blur-[130px]" />
        <div className="absolute -bottom-48 -left-24 h-[30rem] w-[30rem] rounded-full bg-mirae/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* top bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <Logo href="/" inverted withProgram={false} />
      </header>

      {/* centered hero */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6">
        <div className="animate-fade-up flex flex-col items-center text-center">
          <MiraeMark size={46} inverted />
          <span className="mt-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-mirae-300">
            2026 Summer Internship
          </span>
          <h1 className="mt-4 font-display text-5xl font-bold tracking-tightest sm:text-6xl">
            Summer Missions
          </h1>
          <div className="mt-10 flex items-center gap-3">
            <Link href="/login" className="btn-primary px-7 py-3 text-[15px]">
              Sign in <ArrowRight />
            </Link>
            <Link
              href="/request-access"
              className="btn px-7 py-3 text-[15px] border border-white/20 text-white hover:bg-white/10"
            >
              Request access
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 px-8 py-6 text-center text-xs text-white/30">
        © 2026 Mirae Asset Securities
      </footer>
    </div>
  );
}
