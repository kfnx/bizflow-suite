import { NextRequest, NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { DELIVERY_NOTE_STATUS } from '@/lib/db/enum';
import {
  branches,
  deliveryNotes,
  deliveryNoteItems,
  products,
  warehouseStocks
} from '@/lib/db/schema';

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

    // Check if delivery note is already delivered
    if (deliveryNote.status === DELIVERY_NOTE_STATUS.DELIVERED) {
      return NextResponse.json(
        { error: 'Delivery note is already delivered' },
        { status: 400 },
      );
    }

    // Check if delivery note is cancelled
    if (deliveryNote.status === DELIVERY_NOTE_STATUS.CANCELLED) {
      return NextResponse.json(
        { error: 'Cannot execute a cancelled delivery note' },
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
          { error: 'Access denied to execute this delivery note' },
          { status: 403 },
        );
      }
    }

    // Get delivery note items to update warehouse stocks
    const deliveryItems = await db
      .select({
        id: deliveryNoteItems.id,
        productId: deliveryNoteItems.productId,
        quantity: deliveryNoteItems.quantity,
        warehouseId: deliveryNoteItems.warehouseId,
      })
      .from(deliveryNoteItems)
      .where(eq(deliveryNoteItems.deliveryNoteId, deliveryNoteId));

    // Use a database transaction to ensure atomicity
    await db.transaction(async (tx) => {
      // Update warehouse stocks - reduce quantities for delivered items
      // For each item, we need to reduce the quantity from the specific warehouse
      for (const item of deliveryItems) {
        // Get current warehouse stocks for this product in the specific warehouse
        const currentStocks = await tx
          .select({
            id: warehouseStocks.id,
            warehouseId: warehouseStocks.warehouseId,
            quantity: warehouseStocks.quantity,
            condition: warehouseStocks.condition,
          })
          .from(warehouseStocks)
          .where(
            and(
              eq(warehouseStocks.productId, item.productId),
              eq(warehouseStocks.warehouseId, item.warehouseId)
            )
          )
          .orderBy(warehouseStocks.createdAt); // FIFO approach

        let remainingToDeliver = item.quantity;

        // Reduce from available stocks (prioritizing 'new' condition, then 'used', then 'refurbished')
        const stocksByCondition = {
          new: currentStocks.filter(s => s.condition === 'new' && (s.quantity || 0) > 0),
          used: currentStocks.filter(s => s.condition === 'used' && (s.quantity || 0) > 0),
          refurbished: currentStocks.filter(s => s.condition === 'refurbished' && (s.quantity || 0) > 0),
        };

        // Process in order: new -> used -> refurbished
        for (const condition of ['new', 'used', 'refurbished'] as const) {
          for (const stock of stocksByCondition[condition]) {
            if (remainingToDeliver <= 0) break;

            const currentQuantity = stock.quantity || 0;
            const quantityToReduce = Math.min(remainingToDeliver, currentQuantity);
            const newQuantity = currentQuantity - quantityToReduce;

            await tx
              .update(warehouseStocks)
              .set({
                quantity: newQuantity,
                updatedAt: new Date(),
              })
              .where(eq(warehouseStocks.id, stock.id));

            remainingToDeliver -= quantityToReduce;
          }
          if (remainingToDeliver <= 0) break;
        }

        // If there's still remaining quantity to deliver, it means insufficient stock
        // This shouldn't happen in a well-managed system, but we'll throw an error to rollback
        if (remainingToDeliver > 0) {
          throw new Error(
            `Insufficient stock for product ${item.productId} in warehouse ${item.warehouseId}. ` +
            `Remaining quantity ${remainingToDeliver} could not be fulfilled.`
          );
        }
      }

      // Update delivery note status to delivered
      await tx
        .update(deliveryNotes)
        .set({
          status: DELIVERY_NOTE_STATUS.DELIVERED,
          updatedAt: new Date(),
        })
        .where(eq(deliveryNotes.id, deliveryNoteId));
    });

    return NextResponse.json({
      message: 'Delivery note executed successfully',
      status: DELIVERY_NOTE_STATUS.DELIVERED,
      warehouseStocksUpdated: deliveryItems.length,
    });
  } catch (error) {
    console.error('Error executing delivery note:', error);
    return NextResponse.json(
      { error: 'Failed to execute delivery note' },
      { status: 500 },
    );
  }
}