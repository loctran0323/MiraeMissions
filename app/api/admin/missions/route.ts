import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createMission } from "@/lib/queries";

// POST /api/admin/missions — create a new mission.
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: {
    title?: string;
    short_description?: string;
    deliverable_type?: string;
    instructions?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const title = body.title?.trim();
  const short_description = body.short_description?.trim();
  if (!title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!short_description) {
    return NextResponse.json(
      { error: "A short description is required." },
      { status: 400 },
    );
  }

  try {
    const mission = await createMission({
      title,
      short_description,
      deliverable_type: body.deliverable_type?.trim() || "Photo + memo",
      instructions: body.instructions?.trim() || "",
    });
    return NextResponse.json({ ok: true, mission });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to create mission." },
      { status: 500 },
    );
  }
}
