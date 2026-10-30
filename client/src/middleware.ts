import { NextResponse } from 'next/server';

export function middleware(request: Request) {
  const url = new URL(request.url);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', url.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
