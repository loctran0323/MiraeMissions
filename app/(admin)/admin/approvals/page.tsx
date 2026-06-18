import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getUsers } from "@/lib/queries";
import { Avatar, Pill } from "@/components/ui";
import { ApprovalRow } from "./ApprovalRow";

function formatDate(iso: string) {
  return new Date(iso.includes("Z") ? iso : iso + "Z").toLocaleDateString(
    undefined,
    { month: "short", day: "numeric", year: "numeric" },
  );
}

// Pending account approvals + a recap of recently decided accounts.
export default async function ApprovalsPage() {
  const user = await getSessionUser();
  if (!user || user.role !== "admin") redirect("/login");

  const pending = await getUsers({ status: "pending" });
  // Recently decided interns for context (already newest-first from the query).
  const decided = (await getUsers({ role: "intern" }))
    .filter((u) => u.status !== "pending")
    .slice(0, 8);

  return (
    <main className="bg-page min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <header className="animate-fade-up">
          <p className="eyebrow">Admin console</p>
          <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight text-navy-900 sm:text-4xl">
            Approvals
          </h1>
          <p className="mt-2 max-w-2xl text-navy-500">
            Approve new interns so they can sign in.
          </p>
        </header>

        {/* Pending requests */}
        <section className="mt-8 space-y-4">
          {pending.length === 0 ? (
            <div className="card flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="font-display text-lg font-bold text-navy-900">
                All caught up
              </p>
              <p className="text-sm text-navy-500">
                No pending account requests right now.
              </p>
            </div>
          ) : (
            pending.map((u) => <ApprovalRow key={u.id} user={u} />)
          )}
        </section>

        {/* Recently decided */}
        {decided.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide text-navy-400">
              Recently decided
            </h2>
            <div className="card animate-fade-up mt-3 divide-y divide-navy-100 p-2">
              {decided.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <Avatar name={u.name} size={36} />
                  <div className="min-w-0">
                    <div className="truncate font-medium text-navy-900">
                      {u.name}
                    </div>
                    <div className="truncate text-sm text-navy-400">
                      {u.email}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="hidden text-xs text-navy-400 sm:block">
                      {formatDate(u.created_at)}
                    </span>
                    {u.status === "approved" ? (
                      <Pill className="bg-emerald-50 text-emerald-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Approved
                      </Pill>
                    ) : (
                      <Pill className="bg-rose-50 text-rose-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                        Rejected
                      </Pill>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
