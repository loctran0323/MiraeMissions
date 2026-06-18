import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { destroySession } from "@/lib/auth";

// Clears the session and bounces to /login. Used by the TopNav sign-out form
// and the awaiting-approval page (both POST forms).
export async function POST(req: NextRequest) {
  destroySession();
  // 303 so the browser issues a GET to /login after the POST.
  return NextResponse.redirect(new URL("/login", req.url), 303);
}
