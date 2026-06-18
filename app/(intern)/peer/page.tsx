import { getInternProgress } from "@/lib/queries";
import { PeerCard } from "./PeerCard";

// Peer progress overview — aggregate stats only, submissions stay private.
export default async function PeerPage() {
  const peers = await getInternProgress();

  return (
    <main className="bg-page min-h-screen">
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-10">
        <header className="animate-fade-up">
          <h1 className="font-display text-3xl font-bold tracking-tight text-navy-900 sm:text-4xl">
            Peer progress
          </h1>
          <p className="mt-3 max-w-2xl text-base text-navy-500">
            See how your fellow interns are progressing through the missions.
            Submission details remain private.
          </p>
        </header>

        <section className="mt-8 grid animate-fade-up grid-cols-1 gap-5 sm:grid-cols-2">
          {peers.map((entry) => (
            <PeerCard key={entry.user.id} entry={entry} />
          ))}
        </section>
      </div>
    </main>
  );
}
