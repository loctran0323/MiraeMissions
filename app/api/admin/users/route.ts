import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { setUserStatus } from "@/lib/queries";

// POST /api/admin/users — approve or reject a pending account.
export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: { userId?: number; action?: "approve" | "reject" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { userId, action } = body;
  if (!userId || (action !== "approve" && action !== "reject")) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  setUserStatus(userId, action === "approve" ? "approved" : "rejected");
  return NextResponse.json({ ok: true });
}
