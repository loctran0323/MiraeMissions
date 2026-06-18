import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "./LoginForm";

// Centered auth card. Approved users are redirected to their home.
export default async function LoginPage() {
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
            <span className="eyebrow">Welcome back</span>
            <h1 className="mt-2 font-display text-2xl font-extrabold text-navy-900">
              Sign in to your account
            </h1>
            <p className="mt-1.5 text-sm text-navy-400">
              Enter your credentials to continue.
            </p>
          </div>

          <LoginForm />
        </div>

        <p className="mt-6 text-center text-sm text-navy-400">
          Need an account?{" "}
          <Link href="/request-access" className="font-semibold text-mirae hover:text-mirae-600">
            Request access
          </Link>
        </p>
      </div>
    </main>
  );
}
