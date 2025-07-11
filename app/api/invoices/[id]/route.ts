import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { INVOICE_STATUS } from '@/lib/db/enum';
import {
  customers,
  invoiceItems,
  invoices,
  products,
  quotations,
  users,
} from '@/lib/db/schema';
import { updateInvoiceRequestSchema } from '@/lib/validations/invoice';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await requirePermission(request, 'invoices:read');
    if (session instanceof NextResponse) {
      return session;
    }

    const { id } = params;

    // Get invoice with all related data
    const invoice = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        quotationId: invoices.quotationId,
        invoiceDate: invoices.invoiceDate,
        dueDate: invoices.dueDate,
        customerId: invoices.customerId,
        subtotal: invoices.subtotal,
        tax: invoices.tax,
        total: invoices.total,
        currency: invoices.currency,
        status: invoices.status,
        paymentMethod: invoices.paymentMethod,
        notes: invoices.notes,
        createdBy: invoices.createdBy,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
        // Customer data
        customer: {
          id: customers.id,
          code: customers.code,
          name: customers.name,
          billingAddress: customers.billingAddress,
          shippingAddress: customers.shippingAddress,
          city: customers.city,
          country: customers.country,
        },
        // Quotation data
        quotation: {
          id: quotations.id,
          quotationNumber: quotations.quotationNumber,
        },
        // Created by user data
        createdByUser: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .leftJoin(quotations, eq(invoices.quotationId, quotations.id))
      .leftJoin(users, eq(invoices.createdBy, users.id))
      .where(eq(invoices.id, id))
      .limit(1);

    if (invoice.length === 0) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Get invoice items
    const items = await db
      .select({
        id: invoiceItems.id,
        productId: invoiceItems.productId,
        quantity: invoiceItems.quantity,
        unitPrice: invoiceItems.unitPrice,
        total: invoiceItems.total,
        paymentTerms: invoiceItems.paymentTerms,
        termsAndConditions: invoiceItems.termsAndConditions,
        notes: invoiceItems.notes,
        // Product data
        product: {
          id: products.id,
          code: products.code,
          name: products.name,
          price: products.price,
        },
      })
      .from(invoiceItems)
      .leftJoin(products, eq(invoiceItems.productId, products.id))
      .where(eq(invoiceItems.invoiceId, id));

    return NextResponse.json({
      data: {
        ...invoice[0],
        items,
      },
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await requirePermission(request, 'invoices:update');
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
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
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
        status: validatedData.status as INVOICE_STATUS,
        paymentMethod: validatedData.paymentMethod,
        notes: validatedData.notes,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, id));

    // Delete existing items
    await db.delete(invoiceItems).where(eq(invoiceItems.invoiceId, id));

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
