import fs from "node:fs";
import { getSessionUser } from "@/lib/auth";
import { getSubmissionById } from "@/lib/queries";
import { resolveUpload } from "@/lib/uploads";

// Guarded file server for uploaded proof. Files live outside /public; only the
// submission's owner (or an admin) may read them.

const CONTENT_TYPES: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  svg: "image/svg+xml",
  mp4: "video/mp4",
  webm: "video/webm",
  mov: "video/quicktime",
  pdf: "application/pdf",
};

function contentTypeFor(rel: string): string {
  const ext = rel.split(".").pop()?.toLowerCase() ?? "";
  return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

export async function GET(
  _req: Request,
  { params }: { params: { path: string[] } },
) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const rel = params.path.join("/");

  // The first path segment is the owning submission id.
  const submissionId = Number.parseInt(params.path[0] ?? "", 10);
  if (!Number.isFinite(submissionId)) {
    return new Response("Not found", { status: 404 });
  }

  const submission = getSubmissionById(submissionId);
  if (!submission) return new Response("Not found", { status: 404 });

  // Owner or admin only.
  if (submission.user_id !== user.id && user.role !== "admin") {
    return new Response("Forbidden", { status: 403 });
  }

  const abs = resolveUpload(rel);
  if (!abs) return new Response("Not found", { status: 404 });

  const buffer = fs.readFileSync(abs);
  return new Response(buffer, {
    headers: {
      "Content-Type": contentTypeFor(rel),
      "Content-Length": String(buffer.byteLength),
      "Cache-Control": "private, max-age=3600",
    },
  });
}

export const dynamic = "force-dynamic";
