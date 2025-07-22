import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/lib/auth';
import { hasPermission, Permission } from '@/lib/permissions';

export async function requireAuth(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return session;
}

export async function requirePermission(
  request: NextRequest,
  permission: Permission,
) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  // Bypass permission check if user is admin
  if (session.user.isAdmin) {
    return session;
  }

  if (!hasPermission(session.user, permission)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 },
    );
  }

  return session;
}

export async function requireAnyPermission(
  request: NextRequest,
  permissions: Permission[],
) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  const hasAny = permissions.some((permission) =>
    hasPermission(session.user, permission),
  );

  if (!hasAny) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient permissions' },
      { status: 403 },
    );
  }

  return session;
}

export async function requireRole(request: NextRequest, requiredRole: string) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  if (session.user.role !== requiredRole) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient role' },
      { status: 403 },
    );
  }

  return session;
}

export async function requireAnyRole(
  request: NextRequest,
  requiredRoles: string[],
) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  if (!requiredRoles.includes(session.user.role)) {
    return NextResponse.json(
      { error: 'Forbidden - Insufficient role' },
      { status: 403 },
    );
  }

  return session;
}

export async function requireAdmin(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  if (!session.user.isAdmin) {
    return NextResponse.json(
      { error: 'Forbidden - Administrator access required' },
      { status: 403 },
    );
  }

  return session;
}
