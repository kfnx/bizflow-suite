import { NextRequest, NextResponse } from 'next/server';
import { count } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { deliveryNotes, invoices, products, quotations } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // const session = await requirePermission(request, 'dashboard:read');

  // if (session instanceof NextResponse) {
  //   return session;
  // }

  try {
    const [quotationCount, invoiceCount, deliveryNoteCount, productCount] =
      await Promise.all([
        db.select({ count: count() }).from(quotations),
        db.select({ count: count() }).from(invoices),
        db.select({ count: count() }).from(deliveryNotes),
        db.select({ count: count() }).from(products),
      ]);

    const data = {
      quotations: quotationCount[0].count,
      invoices: invoiceCount[0].count,
      deliveryNotes: deliveryNoteCount[0].count,
      products: productCount[0].count,
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching summary counts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary counts' },
      { status: 500 },
    );
  }
}
