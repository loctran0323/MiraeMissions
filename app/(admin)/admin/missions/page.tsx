import { getAllMissions } from "@/lib/queries";
import { PageHeader } from "@/components/ui";
import { MissionManager } from "./MissionManager";

// Always reflect the current DB (this page doesn't read cookies directly).
export const dynamic = "force-dynamic";

export default async function AdminMissionsPage() {
  const missions = await getAllMissions();

  return (
    <main className="min-h-screen bg-white">
      <div className="container-site py-10 sm:py-12">
        <PageHeader
          eyebrow="Administration"
          title="Manage missions"
          description="Add new missions for interns to complete, or remove ones you no longer need."
        />
        <div className="mt-8">
          <MissionManager missions={missions} />
        </div>
      </div>
    </main>
  );
}
