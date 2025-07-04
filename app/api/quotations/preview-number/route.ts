import { NextResponse } from 'next/server';
import { like } from 'drizzle-orm';

import { db } from '@/lib/db';
import { quotations } from '@/lib/db/schema';

export async function GET() {
  try {
    // Generate quotation number (QT/YYYY/MM/XXX format)
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Get count of quotations this month to generate sequence number
    const monthQuotations = await db
      .select({ count: quotations.id })
      .from(quotations)
      .where(like(quotations.quotationNumber, `QT/${year}/${month}/%`));

    const sequence = (monthQuotations.length + 1).toString().padStart(3, '0');
    const quotationNumber = `QT/${year}/${month}/${sequence}`;

    return NextResponse.json({
      data: {
        quotationNumber,
      },
    });
  } catch (error) {
    console.error('Error generating preview quotation number:', error);
    return NextResponse.json(
      { error: 'Failed to generate quotation number' },
      { status: 500 },
    );
  }
}