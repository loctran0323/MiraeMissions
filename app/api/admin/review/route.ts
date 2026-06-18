import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { reviewSubmission } from "@/lib/queries";

// POST /api/admin/review — approve a submission or send it back with a note.
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    submissionId?: number;
    action?: "approve" | "needs_revision";
    comment?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { submissionId, action, comment } = body;
  if (!submissionId || (action !== "approve" && action !== "needs_revision")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (action === "approve") {
    await reviewSubmission(submissionId, "approved", null);
    return NextResponse.json({ ok: true });
  }

  // Send back: a non-empty comment is required.
  const note = comment?.trim();
  if (!note) {
    return NextResponse.json(
      { error: "A comment is required when sending back for revision." },
      { status: 400 },
    );
  }
  await reviewSubmission(submissionId, "needs_revision", note);
  return NextResponse.json({ ok: true });
}
