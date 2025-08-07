import { NextResponse } from 'next/server';
import { like } from 'drizzle-orm';

import { db } from '@/lib/db';
import { deliveryNotes } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Generate delivery note number (DN/YYYY/MM/XXX format)
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Get count of delivery notes this month to generate sequence number
    const monthDeliveryNotes = await db
      .select({ count: deliveryNotes.id })
      .from(deliveryNotes)
      .where(like(deliveryNotes.deliveryNumber, `DN/${year}/${month}/%`));

    const sequence = (monthDeliveryNotes.length + 1)
      .toString()
      .padStart(3, '0');
    const deliveryNumber = `DN/${year}/${month}/${sequence}`;

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
