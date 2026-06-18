import "server-only";
import { sb, must, UPLOADS_BUCKET } from "./supabase";
import type {
  InternProgress,
  Mission,
  MissionState,
  MissionWithState,
  Role,
  Submission,
  SubmissionDetail,
  SubmissionFile,
  SubmissionStatus,
  User,
} from "./types";

/* ------------------------------ Missions ------------------------------ */

export async function getAllMissions(): Promise<Mission[]> {
  return must(
    await sb.from("missions").select("*").order("sort_order", { ascending: true }),
  ) as Mission[];
}

export async function getMissionBySlug(slug: string): Promise<Mission | null> {
  return (must(
    await sb.from("missions").select("*").eq("slug", slug).maybeSingle(),
  ) as Mission | null) ?? null;
}

function stateFromSubmission(sub?: Submission): MissionState {
  if (!sub) return "not_started";
  return sub.status as MissionState;
}

async function filesFor(submissionId: number): Promise<SubmissionFile[]> {
  return must(
    await sb.from("submission_files").select("*").eq("submission_id", submissionId),
  ) as SubmissionFile[];
}

/** Missions joined with a given intern's submission state. */
export async function getMissionsWithState(
  userId: number,
): Promise<MissionWithState[]> {
  const missions = await getAllMissions();
  const submissions = must(
    await sb.from("submissions").select("*").eq("user_id", userId),
  ) as Submission[];

  const subIds = submissions.map((s) => s.id);
  const filesBySub = new Map<number, SubmissionFile[]>();
  if (subIds.length) {
    const files = must(
      await sb.from("submission_files").select("*").in("submission_id", subIds),
    ) as SubmissionFile[];
    for (const f of files) {
      const arr = filesBySub.get(f.submission_id) ?? [];
      arr.push(f);
      filesBySub.set(f.submission_id, arr);
    }
  }

  return missions.map((m) => {
    const sub = submissions.find((s) => s.mission_id === m.id);
    return {
      ...m,
      state: stateFromSubmission(sub),
      submission: sub ? { ...sub, files: filesBySub.get(sub.id) ?? [] } : undefined,
    };
  });
}

export async function getMissionWithState(
  userId: number,
  slug: string,
): Promise<MissionWithState | null> {
  const m = await getMissionBySlug(slug);
  if (!m) return null;
  const sub = (must(
    await sb
      .from("submissions")
      .select("*")
      .eq("user_id", userId)
      .eq("mission_id", m.id)
      .maybeSingle(),
  ) as Submission | null) ?? undefined;
  return {
    ...m,
    state: stateFromSubmission(sub),
    submission: sub ? { ...sub, files: await filesFor(sub.id) } : undefined,
  };
}

/* ----------------------------- Submissions ---------------------------- */

/**
 * Creates a submission (or resubmits an existing one), setting status back to
 * 'submitted'. Returns the submission id so the caller can attach files.
 */
export async function upsertSubmission(
  userId: number,
  missionId: number,
  memo: string | null,
): Promise<number> {
  const existing = (must(
    await sb
      .from("submissions")
      .select("id")
      .eq("user_id", userId)
      .eq("mission_id", missionId)
      .maybeSingle(),
  ) as { id: number } | null);

  if (existing) {
    must(
      await sb
        .from("submissions")
        .update({
          status: "submitted",
          memo,
          admin_comment: null,
          updated_at: new Date().toISOString(),
          reviewed_at: null,
        })
        .eq("id", existing.id),
    );
    return existing.id;
  }

  const created = must(
    await sb
      .from("submissions")
      .insert({ user_id: userId, mission_id: missionId, status: "submitted", memo })
      .select("id")
      .single(),
  ) as { id: number };
  return created.id;
}

export async function addSubmissionFile(
  submissionId: number,
  f: { path: string; original_name: string; mime_type: string; kind: string },
): Promise<void> {
  must(
    await sb.from("submission_files").insert({ submission_id: submissionId, ...f }),
  );
}

export async function getSubmissionById(id: number): Promise<Submission | null> {
  return (must(
    await sb.from("submissions").select("*").eq("id", id).maybeSingle(),
  ) as Submission | null) ?? null;
}

/** Admin review action: approve, or send back with a required comment. */
export async function reviewSubmission(
  submissionId: number,
  status: Exclude<SubmissionStatus, "submitted">,
  comment: string | null,
): Promise<void> {
  const now = new Date().toISOString();
  must(
    await sb
      .from("submissions")
      .update({
        status,
        admin_comment: comment,
        reviewed_at: now,
        updated_at: now,
      })
      .eq("id", submissionId),
  );
}

async function hydrateDetail(sub: Submission): Promise<SubmissionDetail> {
  const user = must(
    await sb.from("users").select("id, name, email").eq("id", sub.user_id).single(),
  ) as Pick<User, "id" | "name" | "email">;
  const mission = must(
    await sb
      .from("missions")
      .select("id, title, slug, deliverable_type")
      .eq("id", sub.mission_id)
      .single(),
  ) as SubmissionDetail["mission"];
  return { ...sub, files: await filesFor(sub.id), user, mission };
}

/** All submissions across all interns (admin queue), newest activity first. */
export async function getAllSubmissionDetails(): Promise<SubmissionDetail[]> {
  const subs = must(
    await sb.from("submissions").select("*").order("updated_at", { ascending: false }),
  ) as Submission[];
  return Promise.all(subs.map(hydrateDetail));
}

export async function getSubmissionDetail(
  id: number,
): Promise<SubmissionDetail | null> {
  const sub = await getSubmissionById(id);
  return sub ? hydrateDetail(sub) : null;
}

/* ------------------------------ Progress ------------------------------ */

/** Per-intern progress for the peer-progress + admin overview pages. */
export async function getInternProgress(): Promise<InternProgress[]> {
  const totalCount =
    (
      await sb.from("missions").select("id", { count: "exact", head: true })
    ).count ?? 0;

  const interns = must(
    await sb
      .from("users")
      .select("id, name, email")
      .eq("role", "intern")
      .eq("status", "approved")
      .order("name", { ascending: true }),
  ) as Pick<User, "id" | "name" | "email">[];

  return Promise.all(
    interns.map(async (u) => {
      const approvedCount =
        (
          await sb
            .from("submissions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", u.id)
            .eq("status", "approved")
        ).count ?? 0;

      const latestRows = must(
        await sb
          .from("submissions")
          .select("updated_at, status, missions(title)")
          .eq("user_id", u.id)
          .order("updated_at", { ascending: false })
          .limit(1),
      ) as Array<{
        updated_at: string;
        status: SubmissionStatus;
        missions: { title: string } | { title: string }[] | null;
      }>;

      const row = latestRows[0];
      const missionRel = Array.isArray(row?.missions) ? row?.missions[0] : row?.missions;
      const latest = row
        ? {
            missionTitle: missionRel?.title ?? "",
            status: row.status,
            updated_at: row.updated_at,
          }
        : undefined;

      return { user: u, approvedCount, totalMissions: totalCount, latest };
    }),
  );
}

/* -------------------------- Account approval -------------------------- */

export async function getUsers(filter?: {
  status?: string;
  role?: string;
}): Promise<User[]> {
  let query = sb
    .from("users")
    .select("id, name, email, role, status, created_at")
    .order("created_at", { ascending: false });
  if (filter?.status) query = query.eq("status", filter.status);
  if (filter?.role) query = query.eq("role", filter.role);
  return must(await query) as User[];
}

export async function setUserStatus(
  userId: number,
  status: "approved" | "rejected",
): Promise<void> {
  must(await sb.from("users").update({ status }).eq("id", userId));
}

/* ------------------------------- Auth -------------------------------- */
// Used by the login/register routes so all DB access stays in one module.

export async function getUserAuthByEmail(email: string): Promise<
  | { id: number; password_hash: string; role: Role; status: User["status"] }
  | null
> {
  return (must(
    await sb
      .from("users")
      .select("id, password_hash, role, status")
      .eq("email", email)
      .maybeSingle(),
  ) as { id: number; password_hash: string; role: Role; status: User["status"] } | null) ?? null;
}

export async function emailExists(email: string): Promise<boolean> {
  const count =
    (
      await sb
        .from("users")
        .select("id", { count: "exact", head: true })
        .eq("email", email)
    ).count ?? 0;
  return count > 0;
}

export async function createPendingIntern(
  name: string,
  email: string,
  passwordHash: string,
): Promise<void> {
  must(
    await sb.from("users").insert({
      name,
      email,
      password_hash: passwordHash,
      role: "intern",
      status: "pending",
    }),
  );
}

/* --------------------------- Mission admin ---------------------------- */

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Creates a mission (admin). Generates a unique slug and appends to the end. */
export async function createMission(data: {
  title: string;
  short_description: string;
  deliverable_type: string;
  instructions: string;
}): Promise<Mission> {
  // Unique slug: append -2, -3, ... if the base is taken.
  const base = slugify(data.title) || "mission";
  let slug = base;
  for (let n = 2; ; n++) {
    const existing = await sb
      .from("missions")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();
    if (!existing.data) break;
    slug = `${base}-${n}`;
  }

  // Next sort_order = current max + 1.
  const maxRow = (must(
    await sb
      .from("missions")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1),
  ) as { sort_order: number }[])[0];
  const sort_order = (maxRow?.sort_order ?? -1) + 1;

  return must(
    await sb
      .from("missions")
      .insert({
        slug,
        title: data.title,
        short_description: data.short_description,
        deliverable_type: data.deliverable_type,
        instructions: data.instructions,
        sort_order,
      })
      .select("*")
      .single(),
  ) as Mission;
}

/** Deletes a mission (admin). Cleans up any uploaded files, then cascades. */
export async function deleteMission(id: number): Promise<void> {
  // Best-effort: remove uploaded objects for this mission's submissions before
  // the DB cascade drops their rows.
  const subs = (must(
    await sb.from("submissions").select("id").eq("mission_id", id),
  ) as { id: number }[]).map((s) => s.id);

  if (subs.length) {
    const files = must(
      await sb.from("submission_files").select("path").in("submission_id", subs),
    ) as { path: string }[];
    if (files.length) {
      await sb.storage.from(UPLOADS_BUCKET).remove(files.map((f) => f.path));
    }
  }

  must(await sb.from("missions").delete().eq("id", id));
}

/** Reads the live session user record (used by auth.getSessionUser). */
export async function getSessionUserRecord(uid: number): Promise<
  Pick<User, "id" | "name" | "email" | "role" | "status"> | null
> {
  return (must(
    await sb
      .from("users")
      .select("id, name, email, role, status")
      .eq("id", uid)
      .maybeSingle(),
  ) as Pick<User, "id" | "name" | "email" | "role" | "status"> | null) ?? null;
}
