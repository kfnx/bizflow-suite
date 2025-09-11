import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq, ilike, or } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { roles, rolePermissions, permissions } from '@/lib/db/schema';
import { requirePermission } from '@/lib/auth/authorization';

const roleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'roles:read');
  
  if (session instanceof NextResponse) {
    return session;
  }

  try {

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let whereCondition;
    if (search) {
      whereCondition = or(
        ilike(roles.name, `%${search}%`),
        ilike(roles.description, `%${search}%`)
      );
    }

    const [rolesData, totalCount] = await Promise.all([
      db
        .select({
          id: roles.id,
          name: roles.name,
          description: roles.description,
          createdAt: roles.createdAt,
          updatedAt: roles.updatedAt,
        })
        .from(roles)
        .where(whereCondition)
        .orderBy(desc(roles.createdAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: roles.id })
        .from(roles)
        .where(whereCondition)
        .then(result => result.length),
    ]);

    return NextResponse.json({
      data: rolesData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'roles:create');
  
  if (session instanceof NextResponse) {
    return session;
  }

  try {

    const body = await request.json();
    const validatedData = roleSchema.parse(body);

    const [newRole] = await db.insert(roles).values(validatedData);

    return NextResponse.json(
      { message: 'Role created successfully', id: newRole.insertId },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}