import "server-only";
import { getDb } from "./db";
import type {
  InternProgress,
  Mission,
  MissionState,
  MissionWithState,
  Submission,
  SubmissionDetail,
  SubmissionFile,
  SubmissionStatus,
  User,
} from "./types";

/* ------------------------------ Missions ------------------------------ */

export function getAllMissions(): Mission[] {
  return getDb()
    .prepare("SELECT * FROM missions ORDER BY sort_order ASC")
    .all() as Mission[];
}

export function getMissionBySlug(slug: string): Mission | null {
  return (getDb()
    .prepare("SELECT * FROM missions WHERE slug = ?")
    .get(slug) as Mission) ?? null;
}

function stateFromSubmission(sub?: Submission): MissionState {
  if (!sub) return "not_started";
  return sub.status as MissionState;
}

function filesFor(submissionId: number): SubmissionFile[] {
  return getDb()
    .prepare("SELECT * FROM submission_files WHERE submission_id = ?")
    .all(submissionId) as SubmissionFile[];
}

/** Missions joined with a given intern's submission state. */
export function getMissionsWithState(userId: number): MissionWithState[] {
  const missions = getAllMissions();
  return missions.map((m) => {
    const sub = getDb()
      .prepare("SELECT * FROM submissions WHERE user_id = ? AND mission_id = ?")
      .get(userId, m.id) as Submission | undefined;
    return {
      ...m,
      state: stateFromSubmission(sub),
      submission: sub ? { ...sub, files: filesFor(sub.id) } : undefined,
    };
  });
}

export function getMissionWithState(
  userId: number,
  slug: string,
): MissionWithState | null {
  const m = getMissionBySlug(slug);
  if (!m) return null;
  const sub = getDb()
    .prepare("SELECT * FROM submissions WHERE user_id = ? AND mission_id = ?")
    .get(userId, m.id) as Submission | undefined;
  return {
    ...m,
    state: stateFromSubmission(sub),
    submission: sub ? { ...sub, files: filesFor(sub.id) } : undefined,
  };
}

/* ----------------------------- Submissions ---------------------------- */

/**
 * Creates a submission (or resubmits an existing one), setting status back to
 * 'submitted'. Returns the submission id so the caller can attach files.
 */
export function upsertSubmission(
  userId: number,
  missionId: number,
  memo: string | null,
): number {
  const db = getDb();
  const existing = db
    .prepare("SELECT * FROM submissions WHERE user_id = ? AND mission_id = ?")
    .get(userId, missionId) as Submission | undefined;

  if (existing) {
    db.prepare(
      `UPDATE submissions
       SET status = 'submitted', memo = ?, admin_comment = NULL,
           updated_at = datetime('now'), reviewed_at = NULL
       WHERE id = ?`,
    ).run(memo, existing.id);
    return existing.id;
  }

  const res = db
    .prepare(
      `INSERT INTO submissions (user_id, mission_id, status, memo)
       VALUES (?, ?, 'submitted', ?)`,
    )
    .run(userId, missionId, memo);
  return Number(res.lastInsertRowid);
}

export function addSubmissionFile(
  submissionId: number,
  f: { path: string; original_name: string; mime_type: string; kind: string },
): void {
  getDb()
    .prepare(
      `INSERT INTO submission_files (submission_id, path, original_name, mime_type, kind)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(submissionId, f.path, f.original_name, f.mime_type, f.kind);
}

export function getSubmissionById(id: number): Submission | null {
  return (getDb()
    .prepare("SELECT * FROM submissions WHERE id = ?")
    .get(id) as Submission) ?? null;
}

/** Admin review action: approve, or send back with a required comment. */
export function reviewSubmission(
  submissionId: number,
  status: Exclude<SubmissionStatus, "submitted">,
  comment: string | null,
): void {
  getDb()
    .prepare(
      `UPDATE submissions
       SET status = ?, admin_comment = ?, reviewed_at = datetime('now'),
           updated_at = datetime('now')
       WHERE id = ?`,
    )
    .run(status, comment, submissionId);
}

function hydrateDetail(sub: Submission): SubmissionDetail {
  const db = getDb();
  const user = db
    .prepare("SELECT id, name, email FROM users WHERE id = ?")
    .get(sub.user_id) as Pick<User, "id" | "name" | "email">;
  const mission = db
    .prepare("SELECT id, title, slug, deliverable_type FROM missions WHERE id = ?")
    .get(sub.mission_id) as SubmissionDetail["mission"];
  return { ...sub, files: filesFor(sub.id), user, mission };
}

/** All submissions across all interns (admin queue), newest activity first. */
export function getAllSubmissionDetails(): SubmissionDetail[] {
  const subs = getDb()
    .prepare("SELECT * FROM submissions ORDER BY updated_at DESC")
    .all() as Submission[];
  return subs.map(hydrateDetail);
}

export function getSubmissionDetail(id: number): SubmissionDetail | null {
  const sub = getSubmissionById(id);
  return sub ? hydrateDetail(sub) : null;
}

/* ------------------------------ Progress ------------------------------ */

/** Per-intern progress for the peer-progress + admin overview pages. */
export function getInternProgress(): InternProgress[] {
  const db = getDb();
  const total = (db.prepare("SELECT COUNT(*) AS c FROM missions").get() as { c: number }).c;
  const interns = db
    .prepare(
      "SELECT id, name, email FROM users WHERE role = 'intern' AND status = 'approved' ORDER BY name ASC",
    )
    .all() as Pick<User, "id" | "name" | "email">[];

  return interns.map((u) => {
    const approvedCount = (db
      .prepare(
        "SELECT COUNT(*) AS c FROM submissions WHERE user_id = ? AND status = 'approved'",
      )
      .get(u.id) as { c: number }).c;

    const latest = db
      .prepare(
        `SELECT m.title AS missionTitle, s.status AS status, s.updated_at AS updated_at
         FROM submissions s JOIN missions m ON m.id = s.mission_id
         WHERE s.user_id = ? ORDER BY s.updated_at DESC LIMIT 1`,
      )
      .get(u.id) as InternProgress["latest"] | undefined;

    return { user: u, approvedCount, totalMissions: total, latest };
  });
}

/* -------------------------- Account approval -------------------------- */

export function getUsers(filter?: { status?: string; role?: string }): User[] {
  const clauses: string[] = [];
  const params: Record<string, string> = {};
  if (filter?.status) {
    clauses.push("status = @status");
    params.status = filter.status;
  }
  if (filter?.role) {
    clauses.push("role = @role");
    params.role = filter.role;
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return getDb()
    .prepare(
      `SELECT id, name, email, role, status, created_at FROM users ${where} ORDER BY created_at DESC`,
    )
    .all(params) as User[];
}

export function setUserStatus(
  userId: number,
  status: "approved" | "rejected",
): void {
  getDb().prepare("UPDATE users SET status = ? WHERE id = ?").run(status, userId);
}
