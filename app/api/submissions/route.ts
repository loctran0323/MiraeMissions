import { getSessionUser } from "@/lib/auth";
import {
  addSubmissionFile,
  getAllMissions,
  upsertSubmission,
} from "@/lib/queries";
import { saveUploadedFile } from "@/lib/uploads";

// Intern submission endpoint: persists the memo + uploaded proof files and
// (re)sets the submission to 'submitted'. Resubmission reuses the same row.
export async function POST(req: Request) {
  const user = await getSessionUser();
  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();

    const missionId = Number.parseInt(String(formData.get("missionId") ?? ""), 10);
    if (!Number.isFinite(missionId)) {
      return Response.json({ error: "Invalid mission" }, { status: 400 });
    }

    // Verify the mission actually exists.
    const mission = getAllMissions().find((m) => m.id === missionId);
    if (!mission) {
      return Response.json({ error: "Mission not found" }, { status: 404 });
    }

    const memoRaw = formData.get("memo");
    const memo =
      typeof memoRaw === "string" && memoRaw.trim() ? memoRaw.trim() : null;

    const files = formData
      .getAll("files")
      .filter((f): f is File => f instanceof File && f.size > 0);

    // Require proof: at least one file or a memo.
    if (files.length === 0 && !memo) {
      return Response.json(
        { error: "Add at least one photo/video or a memo." },
        { status: 400 },
      );
    }

    const subId = upsertSubmission(user.id, missionId, memo);

    for (const file of files) {
      const saved = await saveUploadedFile(subId, file);
      addSubmissionFile(subId, saved);
    }

    return Response.json({ ok: true, submissionId: subId });
  } catch (err) {
    console.error("submission failed", err);
    return Response.json({ error: "Something went wrong." }, { status: 500 });
  }
}
