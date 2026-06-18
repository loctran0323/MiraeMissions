// Shared domain types — the data contract for the whole app.

export type Role = "intern" | "admin";

// Account approval lifecycle. A user cannot sign in until an admin approves them.
export type AccountStatus = "pending" | "approved" | "rejected";

// A submission's review lifecycle.
//  - submitted:       intern sent it, awaiting admin review
//  - approved:        admin accepted it (counts toward "reviewed" progress)
//  - needs_revision:  admin sent it back with a comment; intern must resubmit
export type SubmissionStatus = "submitted" | "approved" | "needs_revision";

// Per-mission status from a given intern's perspective (derived, not stored).
export type MissionState =
  | "not_started"
  | "submitted"
  | "approved"
  | "needs_revision";

export type FileKind = "image" | "video" | "other";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  created_at: string;
}

export interface Mission {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  instructions: string; // newline-separated lines, rendered as a list/paragraphs
  deliverable_type: string; // e.g. "Photo + memo", "Photo / video + memo"
  sort_order: number;
}

export interface SubmissionFile {
  id: number;
  submission_id: number;
  path: string; // relative path under the uploads dir
  original_name: string;
  mime_type: string;
  kind: FileKind;
}

export interface Submission {
  id: number;
  user_id: number;
  mission_id: number;
  status: SubmissionStatus;
  memo: string | null;
  admin_comment: string | null;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
}

// Mission joined with the current intern's latest submission state.
export interface MissionWithState extends Mission {
  state: MissionState;
  submission?: Submission & { files: SubmissionFile[] };
}

// A submission enriched with its author + mission, for admin/peer views.
export interface SubmissionDetail extends Submission {
  files: SubmissionFile[];
  user: Pick<User, "id" | "name" | "email">;
  mission: Pick<Mission, "id" | "title" | "slug" | "deliverable_type">;
}

// Per-intern progress summary used on admin + peer-progress pages.
export interface InternProgress {
  user: Pick<User, "id" | "name" | "email">;
  approvedCount: number;
  totalMissions: number;
  latest?: {
    missionTitle: string;
    status: SubmissionStatus;
    updated_at: string;
  };
}

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}
