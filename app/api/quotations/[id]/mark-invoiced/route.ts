import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { INVOICE_STATUS, QUOTATION_STATUS } from '@/lib/db/enum';
import { invoices, quotations } from '@/lib/db/schema';

const markInvoicedSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  invoiceDate: z.string().min(1, 'Invoice date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  notes: z.string().optional().nullable(),
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

    // Check if quotation exists and get details for invoice creation
    const existingQuotation = await db
      .select({
        id: quotations.id,
        status: quotations.status,
        quotationNumber: quotations.quotationNumber,
        customerId: quotations.customerId,
        subtotal: quotations.subtotal,
        tax: quotations.tax,
        total: quotations.total,
        currency: quotations.currency,
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

    // Create invoice and mark quotation as invoiced in a transaction
    const result = await db.transaction(async (tx) => {
      const now = new Date();

      // Create invoice record
      const invoiceData = {
        invoiceNumber: validatedData.invoiceNumber,
        quotationId: quotation.id,
        invoiceDate: new Date(validatedData.invoiceDate),
        dueDate: new Date(validatedData.dueDate),
        customerId: quotation.customerId!,
        subtotal: quotation.subtotal || '0.00',
        tax: quotation.tax || '0.00',
        total: quotation.total || '0.00',
        currency: quotation.currency || 'IDR',
        status: INVOICE_STATUS.DRAFT,
        notes:
          validatedData.notes ||
          `Generated from quotation ${quotation.quotationNumber}`,
        createdBy: session.user.id,
      };

      await tx.insert(invoices).values(invoiceData);

      // Get the created invoice
      const createdInvoice = await tx
        .select({ id: invoices.id })
        .from(invoices)
        .where(eq(invoices.invoiceNumber, validatedData.invoiceNumber))
        .limit(1);

      const invoiceId = createdInvoice[0].id;

      // Update quotation with invoice reference
      await tx
        .update(quotations)
        .set({
          invoicedAt: now,
          invoiceId: invoiceId,
          notes: validatedData.notes || null,
        })
        .where(eq(quotations.id, id));

      return { invoiceId, invoicedAt: now };
    });

    return NextResponse.json({
      message: 'Invoice created and quotation marked as invoiced successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        invoicedAt: result.invoicedAt,
        invoiceId: result.invoiceId,
        invoiceNumber: validatedData.invoiceNumber,
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
