import { NextRequest, NextResponse } from 'next/server';
import { count, eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import {
  DELIVERY_NOTE_STATUS,
  INVOICE_STATUS,
  PRODUCT_STATUS,
  QUOTATION_STATUS,
} from '@/lib/db/enum';
import { deliveryNotes, invoices, products, quotations } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // const session = await requirePermission(request, 'dashboard:read');

  // if (session instanceof NextResponse) {
  //   return session;
  // }

  try {
    // Get quotation counts by status
    const quotationStatuses = Object.values(QUOTATION_STATUS);
    const quotationCounts = await Promise.all(
      quotationStatuses.map(async (status) => {
        const result = await db
          .select({ count: count() })
          .from(quotations)
          .where(eq(quotations.status, status));
        return { status, count: result[0].count };
      }),
    );

    // Get invoice counts by status
    const invoiceStatuses = Object.values(INVOICE_STATUS);
    const invoiceCounts = await Promise.all(
      invoiceStatuses.map(async (status) => {
        const result = await db
          .select({ count: count() })
          .from(invoices)
          .where(eq(invoices.status, status));
        return { status, count: result[0].count };
      }),
    );

    // Get delivery note counts by status
    const deliveryStatuses = Object.values(DELIVERY_NOTE_STATUS);
    const deliveryNoteCounts = await Promise.all(
      deliveryStatuses.map(async (status) => {
        const result = await db
          .select({ count: count() })
          .from(deliveryNotes)
          .where(eq(deliveryNotes.status, status));
        return { status, count: result[0].count };
      }),
    );

    // Get product counts by status
    const productStatuses = Object.values(PRODUCT_STATUS);
    const productCounts = await Promise.all(
      productStatuses.map(async (status) => {
        const result = await db
          .select({ count: count() })
          .from(products)
          .where(eq(products.status, status));
        return { status, count: result[0].count };
      }),
    );

    // Calculate total counts
    const totalQuotations = quotationCounts.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const totalInvoices = invoiceCounts.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const totalDeliveryNotes = deliveryNoteCounts.reduce(
      (sum, item) => sum + item.count,
      0,
    );
    const totalProducts = productCounts.reduce(
      (sum, item) => sum + item.count,
      0,
    );

    const data = {
      quotations: {
        total: totalQuotations,
        byStatus: quotationCounts.reduce(
          (acc, item) => {
            acc[item.status] = item.count;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
      invoices: {
        total: totalInvoices,
        byStatus: invoiceCounts.reduce(
          (acc, item) => {
            acc[item.status] = item.count;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
      deliveryNotes: {
        total: totalDeliveryNotes,
        byStatus: deliveryNoteCounts.reduce(
          (acc, item) => {
            acc[item.status] = item.count;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
      products: {
        total: totalProducts,
        byStatus: productCounts.reduce(
          (acc, item) => {
            acc[item.status] = item.count;
            return acc;
          },
          {} as Record<string, number>,
        ),
      },
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
