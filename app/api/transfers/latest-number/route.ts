import { NextResponse } from 'next/server';
import { like } from 'drizzle-orm';

import { db } from '@/lib/db';
import { transfers } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Generate transfer number (TRF/YYYY/MM/XXX format)
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Get count of transfers this month to generate sequence number
    const monthTransfers = await db
      .select({ count: transfers.id })
      .from(transfers)
      .where(like(transfers.transferNumber, `TRF/${year}/${month}/%`));

    const sequence = (monthTransfers.length + 1).toString().padStart(3, '0');
    const transferNumber = `TRF/${year}/${month}/${sequence}`;

    return NextResponse.json({
      data: {
        transferNumber,
      },
    });
  } catch (error) {
    console.error('Error generating transfer number:', error);
    return NextResponse.json(
      { error: 'Failed to generate transfer number' },
      { status: 500 },
    );
  }
}
