import "server-only";
import path from "node:path";
import fs from "node:fs";
import type { FileKind } from "./types";

// Uploaded proof (photos/videos) lives outside /public and is served through a
// guarded route handler so only the owner or an admin can view it.
export const UPLOADS_DIR = path.join(process.cwd(), "uploads");

export function kindFromMime(mime: string): FileKind {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "other";
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
}

/**
 * Persists an uploaded File to disk under uploads/<submissionId>/ and returns
 * the metadata to store in submission_files. `path` is relative to UPLOADS_DIR.
 */
export async function saveUploadedFile(
  submissionId: number,
  file: File,
): Promise<{ path: string; original_name: string; mime_type: string; kind: FileKind }> {
  const dir = path.join(UPLOADS_DIR, String(submissionId));
  fs.mkdirSync(dir, { recursive: true });

  const safe = sanitize(file.name || "file");
  const unique = `${Date.now()}-${Math.round(performance.now())}-${safe}`;
  const abs = path.join(dir, unique);

  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(abs, bytes);

  return {
    path: path.join(String(submissionId), unique),
    original_name: file.name || unique,
    mime_type: file.type || "application/octet-stream",
    kind: kindFromMime(file.type || ""),
  };
}

/** Resolves a stored relative path to an absolute path, guarding traversal. */
export function resolveUpload(relPath: string): string | null {
  const abs = path.join(UPLOADS_DIR, relPath);
  if (!abs.startsWith(UPLOADS_DIR)) return null;
  if (!fs.existsSync(abs)) return null;
  return abs;
}
