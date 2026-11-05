import { NextResponse } from "next/server";

/**
 * The session cookie is set by the API origin, so this middleware cannot read the role.
 * Role checks live in the brand, influencer, and admin layouts, which call GET /api/me.
 */
export function middleware(request: Request) {
  const url = new URL(request.url);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", url.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
