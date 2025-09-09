import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { permissions } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  resources: z.string().optional(),
  actions: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let whereCondition;
    if (search) {
      whereCondition = or(
        ilike(permissions.name, `%${search}%`),
        ilike(permissions.description, `%${search}%`)
      );
    }

    const [permissionsData, totalCount] = await Promise.all([
      db
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
        .where(whereCondition)
        .orderBy(desc(permissions.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: permissions.id })
        .from(permissions)
        .where(whereCondition)
        .then(result => result.length),
    ]);

    return NextResponse.json({
      data: permissionsData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const validatedData = permissionSchema.parse(body);

    const [newPermission] = await db.insert(permissions).values(validatedData);

    return NextResponse.json(
      { message: 'Permission created successfully', id: newPermission.insertId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating permission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}