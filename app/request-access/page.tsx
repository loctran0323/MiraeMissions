import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/brand/Logo";
import { RequestForm } from "./RequestForm";

// Public "request access" page — creates a pending intern account.
export default async function RequestAccessPage() {
  const user = await getSessionUser();
  if (user) redirect(user.role === "admin" ? "/admin" : "/dashboard");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-page px-5 py-12">
      <div className="pointer-events-none absolute inset-0 bg-hero-glow" />
      <div className="relative w-full max-w-md animate-fade-up">
        <div className="mb-8 flex justify-center">
          <Logo href="/" subtitle="Summer Missions" />
        </div>

        <div className="card p-8 shadow-lift">
          <div className="mb-6 text-center">
            <span className="eyebrow">Join the program</span>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-navy-900">
              Request access
            </h1>
            <p className="mt-1.5 text-sm text-navy-400">
              Create your account — an admin will review and approve it.
            </p>
          </div>

          <RequestForm />
        </div>

        <p className="mt-6 text-center text-sm text-navy-400">
          Already approved?{" "}
          <Link href="/login" className="font-semibold text-mirae hover:text-mirae-600">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
