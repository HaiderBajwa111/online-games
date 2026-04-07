import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Protect admin pages but allow the login page and auth routes
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login' || pathname.startsWith('/admin/auth')) {
      return NextResponse.next();
    }

    const token = req.cookies.get('token')?.value;
    if (!token) return NextResponse.redirect(new URL('/admin/login', req.url));

    // Skip heavy verification in middleware (edge runtime). Server-side APIs
    // will perform full verification for protected actions.
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
