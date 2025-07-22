import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

import { requireAdmin } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { DEFAULT_PASSWORD } from '@/lib/db/constants';
import { users } from '@/lib/db/schema';

// POST /api/users/[id]/reset-password - Reset user password to default (requires admin access)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAdmin(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = getDB();

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, params.id))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const targetUser = existingUser[0];

    // Prevent users from resetting their own password
    if (params.id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot reset your own password' },
        { status: 403 },
      );
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

    // Update the user's password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, params.id));

    return NextResponse.json({
      message: 'Password reset successfully',
      defaultPassword: DEFAULT_PASSWORD,
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    return NextResponse.json(
      { error: 'Failed to reset password' },
      { status: 500 },
    );
  }
}
