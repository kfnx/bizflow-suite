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

  if (!hasPermission(session.user.role, permission)) {
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
    hasPermission(session.user.role, permission),
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
