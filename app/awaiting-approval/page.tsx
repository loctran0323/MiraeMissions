import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";

export default function AwaitingApprovalPage() {
  return (
    <AuthLayout
      title="Awaiting approval"
      subtitle="Your account has been created but isn't active yet."
    >
      <div className="space-y-6">
        <div className="grid h-12 w-12 place-items-center rounded-md bg-mirae-50 text-mirae-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 7v5l3 2m6-2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-sm leading-relaxed text-ink-500">
          An administrator needs to approve your account before you can access
          the missions portal. You&rsquo;ll be able to sign in as soon as
          you&rsquo;re approved.
        </p>
        <form action="/api/auth/logout" method="post">
          <button type="submit" className="btn-outline w-full py-3">
            Sign out
          </button>
        </form>
        <p className="text-center text-sm text-ink-500">
          <Link href="/login" className="font-semibold text-mirae hover:text-mirae-600">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
