import { NextRequest, NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

import { db } from '@/lib/db';
import { permissions } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');

    const permissionsData = await db
      .select({
        id: permissions.id,
        name: permissions.name,
        description: permissions.description,
        resources: permissions.resources,
        actions: permissions.actions,
        createdAt: permissions.createdAt,
        updatedAt: permissions.updatedAt,
      })
      .from(permissions)
      .orderBy(desc(permissions.name))
      .limit(limit);

    return NextResponse.json({
      data: permissionsData,
      pagination: {
        page: 1,
        limit,
        total: permissionsData.length,
        totalPages: 1,
      },
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}