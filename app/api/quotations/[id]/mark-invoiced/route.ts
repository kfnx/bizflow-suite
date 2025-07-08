import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations } from '@/lib/db/schema';

const markInvoicedSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice ID is required'),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = await getDB();
    const { id } = params;

    // Parse request body
    const body = await request.json();
    const validatedData = markInvoicedSchema.parse(body);

    // Check if quotation exists
    const existingQuotation = await db
      .select({
        id: quotations.id,
        status: quotations.status,
        quotationNumber: quotations.quotationNumber,
        invoicedAt: quotations.invoicedAt,
      })
      .from(quotations)
      .where(eq(quotations.id, id))
      .limit(1);

    if (existingQuotation.length === 0) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 },
      );
    }

    const quotation = existingQuotation[0];

    // Check if quotation is in 'accepted' status
    if (quotation.status !== QUOTATION_STATUS.ACCEPTED) {
      return NextResponse.json(
        { error: 'Only accepted quotations can be marked as invoiced' },
        { status: 400 },
      );
    }

    // Check if quotation is already invoiced
    if (quotation.invoicedAt) {
      return NextResponse.json(
        { error: 'Quotation is already marked as invoiced' },
        { status: 400 },
      );
    }

    // Mark quotation as invoiced
    const now = new Date();

    await db
      .update(quotations)
      .set({
        invoicedAt: now,
        invoiceId: validatedData.invoiceId,
      })
      .where(eq(quotations.id, id));

    return NextResponse.json({
      message: 'Quotation marked as invoiced successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        invoicedAt: now,
        invoiceId: validatedData.invoiceId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error marking quotation as invoiced:', error);
    return NextResponse.json(
      { error: 'Failed to mark quotation as invoiced' },
      { status: 500 },
    );
  }
}
