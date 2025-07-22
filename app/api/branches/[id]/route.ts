import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { branches, users } from '@/lib/db/schema';

// GET /api/branches/[id] - Get a specific branch
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'branches:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = getDB();

    const branch = await db
      .select({
        id: branches.id,
        name: branches.name,
      })
      .from(branches)
      .where(eq(branches.id, params.id))
      .limit(1);

    if (branch.length === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json({ branch: branch[0] });
  } catch (error) {
    console.error('Error fetching branch:', error);
    return NextResponse.json(
      { error: 'Failed to fetch branch' },
      { status: 500 },
    );
  }
}

// PUT /api/branches/[id] - Update branch (requires branches:update permission)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'branches:update');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = getDB();
    const body = await request.json();

    // Validate input
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return NextResponse.json(
        { error: 'Branch name is required and must be a non-empty string' },
        { status: 400 },
      );
    }

    const name = body.name.trim();

    // Check if branch exists
    const existingBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.id, params.id))
      .limit(1);

    if (existingBranch.length === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check if another branch with the same name exists (excluding current branch)
    const duplicateBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.name, name))
      .limit(1);

    if (duplicateBranch.length > 0 && duplicateBranch[0].id !== params.id) {
      return NextResponse.json(
        { error: 'Branch with this name already exists' },
        { status: 409 },
      );
    }

    // Update branch
    await db
      .update(branches)
      .set({
        name: name,
      })
      .where(eq(branches.id, params.id));

    return NextResponse.json({ message: 'Branch updated successfully' });
  } catch (error) {
    console.error('Error updating branch:', error);
    return NextResponse.json(
      { error: 'Failed to update branch' },
      { status: 500 },
    );
  }
}

// DELETE /api/branches/[id] - Delete branch (requires branches:delete permission)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'branches:delete');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = getDB();

    // Check if branch exists
    const existingBranch = await db
      .select()
      .from(branches)
      .where(eq(branches.id, params.id))
      .limit(1);

    if (existingBranch.length === 0) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Check if branch has associated users
    const associatedUsers = await db
      .select({ count: users.id })
      .from(users)
      .where(eq(users.branchId, params.id));

    if (associatedUsers.length > 0) {
      return NextResponse.json(
        {
          error:
            'Cannot delete branch with associated users. Please reassign users first.',
        },
        { status: 409 },
      );
    }

    // Delete branch
    await db.delete(branches).where(eq(branches.id, params.id));

    return NextResponse.json({ message: 'Branch deleted successfully' });
  } catch (error) {
    console.error('Error deleting branch:', error);
    return NextResponse.json(
      { error: 'Failed to delete branch' },
      { status: 500 },
    );
  }
}
