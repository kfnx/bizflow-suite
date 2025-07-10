import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

// Define protected FRONTEND routes with required permissions
// Note: API routes are handled separately in their individual route files
const PROTECTED_ROUTES: Record<string, Permission[]> = {
  '/user-management': ['users:read'],
  '/quotations': ['quotations:read'],
  '/invoices': ['invoices:read'],
  '/products': ['products:read'],
  '/warehouses': ['warehouses:read'],
  '/settings': ['settings:manage'],
  '/pending-approvals': ['quotations:read'],
};

// Define role-based access for specific routes
const ROLE_BASED_ROUTES: Record<string, string[]> = {
  '/pending-approvals': ['manager', 'director'],
  '/user-management': ['manager', 'director'],
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

  // Check role-based access for protected FRONTEND routes only
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

    // Check role-based access for specific routes
    const requiredRoles = ROLE_BASED_ROUTES[pathname];

    if (requiredRoles) {
      const hasRoleAccess = requiredRoles.includes(session.user.role);

      if (!hasRoleAccess) {
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
     * - api/ (ALL API routes - handled by individual route files)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
