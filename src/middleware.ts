import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_PAGES = ['/sign-in', '/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token')?.value;
  const isAuthenticated = Boolean(accessToken);
  const isAuthPage = AUTH_PAGES.includes(pathname);
  const isProtected = pathname.startsWith('/me');

  if (isProtected && !isAuthenticated) {
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/me/portfolio', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/me/:path*', '/sign-in', '/register'],
};
