import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword, createSession } from "@/lib/auth";
import type { AccountStatus, Role } from "@/lib/types";

type Row = { id: number; password_hash: string; role: Role; status: AccountStatus };

// POST { email, password } — approval-gated sign-in.
export async function POST(req: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const row = getDb()
    .prepare("SELECT id, password_hash, role, status FROM users WHERE email = ?")
    .get(email) as Row | undefined;

  // Generic message for unknown email or bad password (avoid user enumeration).
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  if (row.status === "pending") {
    return NextResponse.json(
      { error: "Your account is awaiting admin approval." },
      { status: 403 },
    );
  }
  if (row.status === "rejected") {
    return NextResponse.json(
      { error: "Your access request was not approved." },
      { status: 403 },
    );
  }

  await createSession(row.id);
  return NextResponse.json({
    ok: true,
    redirect: row.role === "admin" ? "/admin" : "/dashboard",
  });
}
