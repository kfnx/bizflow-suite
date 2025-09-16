import { NextResponse } from 'next/server';
import { desc, like, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { deliveryNotes } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

async function generateNextDeliveryNumber(): Promise<string> {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const prefix = `DN/${year}/${month}/`;

  // Use a transaction to atomically find the next sequence number
  return await db.transaction(async (tx) => {
    // Lock the table to prevent concurrent access
    await tx.execute(sql`LOCK TABLES delivery_notes WRITE`);

    try {
      // Find the highest sequence number for this month
      const result = await tx
        .select({
          deliveryNumber: deliveryNotes.deliveryNumber,
        })
        .from(deliveryNotes)
        .where(like(deliveryNotes.deliveryNumber, `${prefix}%`))
        .orderBy(desc(deliveryNotes.deliveryNumber))
        .limit(1);

      let nextSequence = 1;
      if (result.length > 0) {
        const lastNumber = result[0].deliveryNumber;
        const lastSequence = parseInt(lastNumber.split('/').pop() || '0');
        nextSequence = lastSequence + 1;
      }

      const sequence = nextSequence.toString().padStart(3, '0');
      return `${prefix}${sequence}`;
    } finally {
      await tx.execute(sql`UNLOCK TABLES`);
    }
  });
}

export async function GET() {
  try {
    const deliveryNumber = await generateNextDeliveryNumber();

    return NextResponse.json({
      data: {
        deliveryNumber,
      },
    });
  } catch (error) {
    console.error('Error generating delivery note number:', error);
    return NextResponse.json(
      { error: 'Failed to generate delivery note number' },
      { status: 500 },
    );
  }
}
