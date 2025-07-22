import { NextRequest, NextResponse } from 'next/server';
import { eq, like } from 'drizzle-orm';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth/authorization';
import { db, getDB } from '@/lib/db';
import { INVOICE_STATUS, QUOTATION_STATUS } from '@/lib/db/enum';
import { invoices, quotations } from '@/lib/db/schema';

const markInvoicedSchema = z.object({
  invoiceNumber: z.string().optional(), // Made optional
  invoiceDate: z.string().optional(), // Made optional with default
  dueDate: z.string().optional(), // Made optional with default
  notes: z.string().optional().nullable(),
});

// Helper function to fetch preview invoice number
async function generateInvoiceNumber(): Promise<string> {
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

    return invoiceNumber;
  } catch (error) {
    console.error('Error fetching preview invoice number:', error);
    throw new Error('Failed to generate invoice number');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = getDB();
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

    // Generate default values
    const now = new Date();
    const defaultInvoiceDate =
      validatedData.invoiceDate || now.toISOString().split('T')[0];
    const defaultDueDate =
      validatedData.dueDate ||
      new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]; // 14 days from now
    const invoiceNumber =
      validatedData.invoiceNumber || (await generateInvoiceNumber());

    // Create invoice and mark quotation as invoiced in a transaction
    const result = await db.transaction(async (tx) => {
      // Create invoice record with default values
      const invoiceData = {
        invoiceNumber: invoiceNumber,
        quotationId: quotation.id,
        invoiceDate: new Date(defaultInvoiceDate),
        dueDate: new Date(defaultDueDate),
        customerId: quotation.customerId!,
        subtotal: quotation.subtotal || '0.00',
        tax: quotation.tax || '0.00',
        total: quotation.total || '0.00',
        currency: quotation.currency || 'IDR',
        status: INVOICE_STATUS.DRAFT,
        paymentMethod: null, // Default value
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
        .where(eq(invoices.invoiceNumber, invoiceNumber))
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
        invoiceNumber: invoiceNumber,
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
