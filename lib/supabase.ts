import "server-only";
import { createClient } from "@supabase/supabase-js";

// Server-only Supabase client using the SERVICE ROLE key. This bypasses Row
// Level Security and must NEVER be imported into a Client Component. Every file
// that imports this is a server component, route handler, or server util.
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.",
  );
}

export const sb = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Storage bucket that holds uploaded proof (photos/videos). Create it as a
// PRIVATE bucket in the Supabase dashboard (or via schema.sql).
export const UPLOADS_BUCKET = "uploads";

/** Throws on a Supabase error, otherwise returns the data. */
export function must<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}
