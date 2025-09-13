import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { auth } from '@/lib/auth';
import { hasAnyRole, Permission } from '@/lib/permissions';

// Define protected FRONTEND routes with required permissions
// Note: API routes are handled separately in their individual route files
const PROTECTED_ROUTES: Record<string, Permission[]> = {
  '/users': ['users:read'],
  '/quotations': ['quotations:read'],
  '/invoices': ['invoices:read'],
  '/products': ['products:read'],
  '/delivery-notes': ['deliveries:read'],
  '/warehouses': ['warehouses:read'],
  '/branches': ['branches:read'],
  '/quotations/pending': ['quotations:read'],
  '/imports/pending': ['imports:read'],
};

// Define role-based access for specific routes
const ROLE_BASED_ROUTES: Record<string, string[]> = {
  '/quotations/pending': ['manager', 'director'],
  '/imports/pending': ['import-manager', 'director'],
  '/users': ['manager', 'director'],
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

  // admin bypass everything
  const isAdmin = session?.user.isAdmin;
  if (isAdmin) {
    return NextResponse.next();
  }

  // Note: Permission and role checks are now handled at the component/page level
  // since they require async database queries. This middleware only handles
  // basic authentication and admin bypass.
  // Individual pages should use PermissionGate or check permissions in their components.

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
