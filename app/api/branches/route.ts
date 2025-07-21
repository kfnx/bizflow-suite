import { NextRequest, NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { branches } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

// GET /api/branches - Get all branches
export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const branchesData = await db
      .select({
        id: branches.id,
        name: branches.name,
      })
      .from(branches)
      .orderBy(branches.name);

    return NextResponse.json({
      data: branchesData,
    });
  } catch (error) {
    console.error('Error fetching branches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branches' },
      { status: 500 },
    );
  }
}
