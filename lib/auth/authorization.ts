import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { auth, signOut } from '@/lib/auth';
import { db } from '@/lib/db';
import { branches, users } from '@/lib/db/schema';
import {
  hasAnyPermission,
  hasAnyRole,
  hasPermission,
  hasRole,
  Permission,
} from '@/lib/permissions/server';

// Simple in-memory cache for session validation (5 minute TTL)
const sessionValidationCache = new Map<
  string,
  { isValid: boolean; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function validateSession(session: any) {
  const cacheKey = `${session.user.id}-${session.user.branchId}`;
  const cached = sessionValidationCache.get(cacheKey);

  // Return cached result if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.isValid;
  }
  try {
    // Check if user still exists and is active
    const currentUser = await db
      .select({
        id: users.id,
        branchId: users.branchId,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!currentUser.length || !currentUser[0].isActive) {
      console.log('User no longer exists or is inactive, invalidating session');
      return false;
    }

    const dbUser = currentUser[0];

    // Check if branchId has changed
    if (dbUser.branchId !== session.user.branchId) {
      console.log(
        `User branchId changed from ${session.user.branchId} to ${dbUser.branchId}, invalidating session`,
      );
      return false;
    }

    // If user has a branchId, verify the branch still exists
    if (dbUser.branchId) {
      const branchExists = await db
        .select({ id: branches.id })
        .from(branches)
        .where(eq(branches.id, dbUser.branchId))
        .limit(1);

      if (!branchExists.length) {
        console.log(
          `User's branch ${dbUser.branchId} no longer exists, invalidating session`,
        );
        return false;
      }
    }

    // Cache the valid result
    sessionValidationCache.set(cacheKey, {
      isValid: true,
      timestamp: Date.now(),
    });
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    // Cache the invalid result for a shorter time
    sessionValidationCache.set(cacheKey, {
      isValid: false,
      timestamp: Date.now(),
    });
    return false;
  }
}

// Utility function to clear session validation cache for a user
export function clearSessionValidationCache(userId?: string) {
  if (userId) {
    // Clear specific user's cache entries
    const keysToDelete = Array.from(sessionValidationCache.keys()).filter(
      (key) => key.startsWith(`${userId}-`),
    );
    keysToDelete.forEach((key) => sessionValidationCache.delete(key));
  } else {
    // Clear all cache entries
    sessionValidationCache.clear();
  }
}

export async function requireAuth(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Validate session data against current database state
  const isSessionValid = await validateSession(session);
  if (!isSessionValid) {
    // Session is invalid, return unauthorized to force re-login
    return NextResponse.json(
      {
        error: 'Session invalid - please log in again',
        code: 'SESSION_INVALID',
      },
      { status: 401 },
    );
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

  // Check permission (admins automatically pass)
  if (
    !(await hasPermission(session.user.id, permission, session.user.isAdmin))
  ) {
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

  // Check if user has any of the required permissions (admins automatically pass)
  if (
    !(await hasAnyPermission(
      session.user.id,
      permissions,
      session.user.isAdmin,
    ))
  ) {
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

  // Check if user has the required role (admins automatically pass)
  if (!(await hasRole(session.user.id, requiredRole, session.user.isAdmin))) {
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

  // Check if user has any of the required roles (admins automatically pass)
  if (
    !(await hasAnyRole(session.user.id, requiredRoles, session.user.isAdmin))
  ) {
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
