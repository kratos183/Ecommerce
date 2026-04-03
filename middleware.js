import { NextResponse } from 'next/server';
import { verifyToken } from './lib/jwt';

export async function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  if (pathname === '/api/products' && request.nextUrl.searchParams.get('seed') === 'true') {
    return NextResponse.next();
  }

  const protectedPaths = [
    '/dashboard',
    '/checkout',
    '/api/orders'
  ];

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    if (!token) {
      if (pathname.startsWith('/api/')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const user = await verifyToken(token);
    if (!user) {
      if (pathname.startsWith('/api/')) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (pathname.startsWith('/dashboard/admin') && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (pathname.startsWith('/api/products') && request.method !== 'GET' && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/checkout', '/api/orders/:path*']
};
