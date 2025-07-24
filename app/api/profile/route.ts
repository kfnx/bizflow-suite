import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { branches, users } from '@/lib/db/schema';

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const user = await db
      .select({
        id: users.id,
        code: users.code,
        firstName: users.firstName,
        lastName: users.lastName,
        NIK: users.NIK,
        email: users.email,
        jobTitle: users.jobTitle,
        joinDate: users.joinDate,
        type: users.type,
        phone: users.phone,
        avatar: users.avatar,
        role: users.role,
        signature: users.signature,
        isActive: users.isActive,
        isAdmin: users.isAdmin,
        branchId: users.branchId,
        branchName: branches.name,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .leftJoin(branches, eq(users.branchId, branches.id))
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (user.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ user: user[0] });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 },
    );
  }
}
