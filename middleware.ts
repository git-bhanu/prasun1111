import { type NextRequest, NextResponse } from 'next/server';
import { LOCKED_PATHS } from '@/lib/locked-paths';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLocked = LOCKED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (isLocked) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/installations/:path*',
    '/films/:path*',
    '/design/:path*',
    '/writings/:path*',
    '/shop/:path*',
    '/cart/:path*',
  ],
};
