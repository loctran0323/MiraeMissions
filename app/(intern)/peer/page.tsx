import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { getInternProgress } from "@/lib/queries";
import { PageHeader } from "@/components/ui";
import PeerCard from "./PeerCard";

export default async function PeerPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const peers = await getInternProgress();

  return (
    <main className="min-h-screen bg-white">
      <div className="container-site py-10 sm:py-12">
        <PageHeader
          eyebrow="Cohort"
          title="Peer progress"
          description="See how your fellow interns are progressing. Submission details stay private."
        />

        {peers.length === 0 ? (
          <div className="mt-8 rounded-lg border border-line bg-white px-6 py-16 text-center animate-fade-up">
            <p className="font-display text-lg font-semibold text-ink-900">
              No interns yet
            </p>
            <p className="mt-2 text-sm text-ink-500">
              Your cohort will appear here as members are approved.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 animate-fade-up sm:grid-cols-2 lg:grid-cols-3">
            {peers.map((p) => (
              <PeerCard key={p.user.id} entry={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
