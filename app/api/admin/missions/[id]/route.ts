import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { deleteMission } from "@/lib/queries";

// DELETE /api/admin/missions/[id] — remove a mission (and its submissions).
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const id = Number(params.id);
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid mission id." }, { status: 400 });
  }

  try {
    await deleteMission(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to delete mission." },
      { status: 500 },
    );
  }
}
