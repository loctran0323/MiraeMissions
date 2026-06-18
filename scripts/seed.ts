import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { MISSION_SEEDS } from "../lib/missions-data";

// Idempotent seed: missions (keyed by slug), a default admin, and two demo
// interns. Safe to re-run. Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY.
//
//   npm run seed

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env.");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

async function main() {
  // Missions — upsert by slug, preserving order.
  const rows = MISSION_SEEDS.map((m, i) => ({ ...m, sort_order: i }));
  const { error: mErr } = await sb.from("missions").upsert(rows, { onConflict: "slug" });
  if (mErr) throw mErr;
  console.log(`Seeded ${rows.length} missions.`);

  await ensureUser({
    name: "Mirae Admin",
    email: "admin@miraeasset.com",
    password: "admin1234",
    role: "admin",
    status: "approved",
  });
  await ensureUser({
    name: "Loc Tran",
    email: "loc@miraeasset.com",
    password: "intern1234",
    role: "intern",
    status: "approved",
  });
  await ensureUser({
    name: "Cookie Run",
    email: "ckrun91@gmail.com",
    password: "intern1234",
    role: "intern",
    status: "pending",
  });

  console.log("Seed complete.");
}

async function ensureUser(u: {
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
}) {
  const { data: existing } = await sb
    .from("users")
    .select("id")
    .eq("email", u.email)
    .maybeSingle();
  if (existing) {
    console.log(`User ${u.email} already exists — skipping.`);
    return;
  }
  const { error } = await sb.from("users").insert({
    name: u.name,
    email: u.email,
    password_hash: bcrypt.hashSync(u.password, 10),
    role: u.role,
    status: u.status,
  });
  if (error) throw error;
  console.log(`Created ${u.role} ${u.email}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
