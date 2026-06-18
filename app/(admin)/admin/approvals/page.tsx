import { PageHeader, Avatar } from "@/components/ui";
import { getUsers } from "@/lib/queries";
import { ApprovalRow } from "./ApprovalRow";

export default async function ApprovalsPage() {
  const pending = await getUsers({ status: "pending" });
  const all = await getUsers({ role: "intern" });
  const decided = all.filter((u) => u.status !== "pending");

  return (
    <main className="min-h-screen bg-white">
      <div className="container-site py-10 sm:py-12">
        <div className="animate-fade-up">
          <PageHeader
            eyebrow="Administration"
            title="Approvals"
            description="Approve new interns so they can sign in."
          />
        </div>

        {/* Pending requests */}
        <section className="mt-8 animate-fade-up">
          <div className="mb-4 flex items-center gap-3">
            <span className="eyebrow">Pending requests</span>
            {pending.length > 0 && (
              <span className="font-display text-sm font-bold text-mirae">
                {pending.length}
              </span>
            )}
          </div>

          {pending.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-ink-50 px-6 py-12 text-center">
              <p className="font-semibold text-ink-900">No pending requests</p>
              <p className="mt-1 text-sm text-ink-500">
                New access requests will appear here for review.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {pending.map((u) => (
                <ApprovalRow key={u.id} user={u} />
              ))}
            </div>
          )}
        </section>

        {/* Recently decided */}
        <section className="mt-12 animate-fade-up">
          <span className="eyebrow mb-4 inline-block">Recently decided</span>

          {decided.length === 0 ? (
            <p className="text-sm text-ink-400">No decisions yet.</p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-line">
              <ul className="divide-y divide-line">
                {decided.map((u) => (
                  <li
                    key={u.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar name={u.name} size={34} />
                      <div className="min-w-0">
                        <div className="truncate font-semibold text-ink-900">
                          {u.name}
                        </div>
                        <div className="truncate text-xs text-ink-400">
                          {u.email}
                        </div>
                      </div>
                    </div>
                    <span
                      className={
                        "inline-flex shrink-0 items-center gap-1.5 rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide " +
                        (u.status === "approved"
                          ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                          : "border-rose-100 bg-rose-50 text-rose-700")
                      }
                    >
                      <span
                        className={
                          "h-1.5 w-1.5 rounded-full " +
                          (u.status === "approved"
                            ? "bg-emerald-500"
                            : "bg-rose-500")
                        }
                      />
                      {u.status === "approved" ? "Approved" : "Rejected"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
