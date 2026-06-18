import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

// Shown to users whose account exists but isn't approved yet.
export default function AwaitingApprovalPage() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-page px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Logo href="/" subtitle="Summer Missions" />
        </div>

        <div className="card p-8 text-center shadow-lift">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mirae-50 text-mirae-600">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 7v5l3 2m6-2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="mt-5 font-display text-2xl font-extrabold text-navy-900">
            Awaiting approval
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-navy-400">
            Your account has been created and is pending review. An administrator will
            approve your access shortly — please check back soon.
          </p>

          <form action="/api/auth/logout" method="POST" className="mt-7">
            <button type="submit" className="btn-secondary w-full py-3">
              Sign out
            </button>
          </form>

          <p className="mt-4 text-sm text-navy-400">
            Back to{" "}
            <Link href="/login" className="font-semibold text-mirae hover:text-mirae-600">
              sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
