import { NextResponse } from 'next/server';
import { like } from 'drizzle-orm';

import { db } from '@/lib/db';
import { invoices } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Generate invoice number (INV/YYYY/MM/XXX format)
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Get count of invoices this month to generate sequence number
    const monthInvoices = await db
      .select({ count: invoices.id })
      .from(invoices)
      .where(like(invoices.invoiceNumber, `INV/${year}/${month}/%`));

    const sequence = (monthInvoices.length + 1).toString().padStart(3, '0');
    const invoiceNumber = `INV/${year}/${month}/${sequence}`;

    return NextResponse.json({
      data: {
        invoiceNumber,
      },
    });
  } catch (error) {
    console.error('Error generating preview invoice number:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice number' },
      { status: 500 },
    );
  }
}