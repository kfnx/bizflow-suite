import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { db } from '@/lib/db';
import { permissions, rolePermissions } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

const permissionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  resources: z.string().optional(),
  actions: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const permission = await db
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
      .where(eq(permissions.id, id))
      .then(result => result[0]);

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(permission);
  } catch (error) {
    console.error('Error fetching permission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = permissionSchema.parse(body);

    const existingPermission = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(eq(permissions.id, id))
      .then(result => result[0]);

    if (!existingPermission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      );
    }

    await db
      .update(permissions)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(permissions.id, id));

    return NextResponse.json({ message: 'Permission updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error updating permission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await params;

    const existingPermission = await db
      .select({ id: permissions.id })
      .from(permissions)
      .where(eq(permissions.id, id))
      .then(result => result[0]);

    if (!existingPermission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      );
    }

    // Delete role permissions first
    await db
      .delete(rolePermissions)
      .where(eq(rolePermissions.permissionId, id));

    // Delete the permission
    await db.delete(permissions).where(eq(permissions.id, id));

    return NextResponse.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    console.error('Error deleting permission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}