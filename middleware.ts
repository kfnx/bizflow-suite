import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

// Define protected routes with required permissions
const PROTECTED_ROUTES: Record<string, Permission[]> = {
  '/user-management': ['users:read'],
  '/quotations': ['quotations:read'],
  '/invoices': ['invoices:read'],
  '/products': ['products:read'],
  '/warehouses': ['warehouses:read'],
  '/reports': ['reports:view'],
  '/settings': ['settings:manage'],
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Define auth routes (login, register, etc.)
  const authRoutes = [
    '/login',
    '/register',
    '/reset-password',
    '/verification',
  ];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // If user is authenticated and trying to access auth routes, redirect to home dashboard
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not authenticated, redirect to login (protect everything except auth routes)
  if (!session && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check role-based access for protected routes
  if (session && !isAuthRoute) {
    const requiredPermissions = PROTECTED_ROUTES[pathname];

    if (requiredPermissions) {
      const hasAccess = requiredPermissions.some((permission) =>
        hasPermission(session.user.role, permission),
      );

      if (!hasAccess) {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  // Allow the request to continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
