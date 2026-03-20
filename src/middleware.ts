import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const role = process.env.SITE_ROLE;

  // ─── CLIENT TICKETING SITE (Port 3000) ───────────────────────────────────
  if (role === 'public') {
    // Root "/" → redirect straight to the client flight search
    if (url.pathname === '/') {
      url.pathname = '/flights';
      return NextResponse.redirect(url);
    }
    // Block the agent dashboard from being accessible on the public site
    if (url.pathname.startsWith('/dashboard')) {
      url.pathname = '/flights';
      return NextResponse.redirect(url);
    }
  }

  // ─── AGENT DASHBOARD SITE (Port 3001) ────────────────────────────────────
  if (role === 'admin') {
    // Root "/" → redirect straight to the agent dashboard
    if (url.pathname === '/') {
      url.pathname = '/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
