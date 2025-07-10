import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { invoices, invoiceItems } from '@/lib/db/schema';
import { updateInvoiceRequestSchema } from '@/lib/validations/invoice';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await requireAuth(request);
    if (session instanceof NextResponse) {
      return session;
    }

    const { id } = params;
    const body = await request.json();
    
    // Validate request body
    const validatedData = updateInvoiceRequestSchema.parse(body);

    // Check if invoice exists
    const existingInvoice = await db
      .select()
      .from(invoices)
      .where(eq(invoices.id, id))
      .limit(1);

    if (existingInvoice.length === 0) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 },
      );
    }

    // Calculate totals
    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
    const tax = subtotal * 0.11; // 11% tax
    const total = subtotal + tax;

    // Update invoice
    await db
      .update(invoices)
      .set({
        invoiceDate: new Date(validatedData.invoiceDate),
        dueDate: new Date(validatedData.dueDate),
        customerId: validatedData.customerId,
        subtotal: subtotal.toString(),
        tax: tax.toString(),
        total: total.toString(),
        currency: validatedData.currency,
        status: validatedData.status,
        paymentMethod: validatedData.paymentMethod,
        notes: validatedData.notes,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, id));

    // Delete existing items
    await db
      .delete(invoiceItems)
      .where(eq(invoiceItems.invoiceId, id));

    // Insert new items
    if (validatedData.items.length > 0) {
      await db.insert(invoiceItems).values(
        validatedData.items.map((item) => ({
          invoiceId: id,
          productId: item.productId,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
          total: (item.quantity * item.unitPrice).toString(),
          paymentTerms: item.paymentTerms,
          termsAndConditions: item.termsAndConditions,
          notes: item.notes,
        })),
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice updated successfully',
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 },
    );
  }
}