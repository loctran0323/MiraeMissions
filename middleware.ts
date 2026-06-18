import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Edge-safe gate: only checks for the presence of the session cookie.
// Do NOT import "@/lib/*" here (server-only / native modules).
// Authoritative role + status checks happen in the route-group layouts.
const COOKIE_NAME = "mirae_session";

export function middleware(req: NextRequest) {
  const hasSession = Boolean(req.cookies.get(COOKIE_NAME));
  if (!hasSession) {
    const url = new URL("/login", req.url);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/missions/:path*", "/peer/:path*", "/admin/:path*"],
};
