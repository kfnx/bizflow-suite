import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { DELIVERY_NOTE_STATUS } from '@/lib/db/enum';
import { branches, deliveryNotes } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryNoteId = params.id;
    if (!deliveryNoteId) {
      return NextResponse.json(
        { error: 'Delivery note ID is required' },
        { status: 400 },
      );
    }

    // Check if delivery note exists and get current status
    const existingDeliveryNote = await db
      .select({
        id: deliveryNotes.id,
        status: deliveryNotes.status,
        branchId: deliveryNotes.branchId,
      })
      .from(deliveryNotes)
      .where(eq(deliveryNotes.id, deliveryNoteId))
      .limit(1);

    if (existingDeliveryNote.length === 0) {
      return NextResponse.json(
        { error: 'Delivery note not found' },
        { status: 404 },
      );
    }

    const deliveryNote = existingDeliveryNote[0];

    // Check if delivery note can be cancelled
    if (deliveryNote.status === DELIVERY_NOTE_STATUS.DELIVERED) {
      return NextResponse.json(
        { error: 'Cannot cancel a delivered delivery note' },
        { status: 400 },
      );
    }

    if (deliveryNote.status === DELIVERY_NOTE_STATUS.CANCELLED) {
      return NextResponse.json(
        { error: 'Delivery note is already cancelled' },
        { status: 400 },
      );
    }

    // Branch-based access control
    const branchName = session.user.branchId
      ? await db
          .select({ name: branches.name })
          .from(branches)
          .where(eq(branches.id, session.user.branchId))
          .limit(1)
          .then((result) => result[0]?.name || null)
          .catch(() => null)
      : null;

    if (branchName && !branchName.startsWith('HO') && session.user.branchId) {
      if (deliveryNote.branchId !== session.user.branchId) {
        return NextResponse.json(
          { error: 'Access denied to cancel this delivery note' },
          { status: 403 },
        );
      }
    }

    // Update delivery note status to cancelled
    await db
      .update(deliveryNotes)
      .set({
        status: DELIVERY_NOTE_STATUS.CANCELLED,
        updatedAt: new Date(),
      })
      .where(eq(deliveryNotes.id, deliveryNoteId));

    return NextResponse.json({
      message: 'Delivery note cancelled successfully',
      status: DELIVERY_NOTE_STATUS.CANCELLED,
    });
  } catch (error) {
    console.error('Error cancelling delivery note:', error);
    return NextResponse.json(
      { error: 'Failed to cancel delivery note' },
      { status: 500 },
    );
  }
}