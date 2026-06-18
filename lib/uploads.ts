import "server-only";
import { sb, UPLOADS_BUCKET, must } from "./supabase";
import type { FileKind } from "./types";

// Uploaded proof (photos/videos) lives in a PRIVATE Supabase Storage bucket and
// is served through a guarded route handler so only the owner or an admin can
// view it. Stored `path` is the object key within the bucket.

export function kindFromMime(mime: string): FileKind {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return "other";
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(-80);
}

/**
 * Uploads a File to Storage under <submissionId>/<unique> and returns the
 * metadata to store in submission_files. `path` is the object key.
 */
export async function saveUploadedFile(
  submissionId: number,
  file: File,
): Promise<{ path: string; original_name: string; mime_type: string; kind: FileKind }> {
  const safe = sanitize(file.name || "file");
  const unique = `${Date.now()}-${Math.round(performance.now())}-${safe}`;
  const key = `${submissionId}/${unique}`;

  const bytes = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "application/octet-stream";

  must(
    await sb.storage.from(UPLOADS_BUCKET).upload(key, bytes, {
      contentType,
      upsert: false,
    }),
  );

  return {
    path: key,
    original_name: file.name || unique,
    mime_type: contentType,
    kind: kindFromMime(file.type || ""),
  };
}

/** Downloads a stored object from the private bucket, or null if missing. */
export async function downloadUpload(key: string): Promise<Blob | null> {
  const { data, error } = await sb.storage.from(UPLOADS_BUCKET).download(key);
  if (error || !data) return null;
  return data;
}
