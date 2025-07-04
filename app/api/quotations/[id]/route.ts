import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  customers,
  products,
  quotationItems,
  quotations,
  users,
} from '@/lib/db/schema';
import { UpdateQuotationRequest } from '@/lib/validations/quotation';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Fetch quotation with related data
    const quotationData = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        validUntil: quotations.validUntil,
        customerId: quotations.customerId,
        customerName: customers.name,
        customerCode: customers.code,
        approverId: quotations.approverId,
        isIncludePPN: quotations.isIncludePPN,
        subtotal: quotations.subtotal,
        tax: quotations.tax,
        total: quotations.total,
        currency: quotations.currency,
        status: quotations.status,
        notes: quotations.notes,
        termsAndConditions: quotations.termsAndConditions,
        createdBy: quotations.createdBy,
        createdByUser: users.firstName,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .leftJoin(users, eq(quotations.createdBy, users.id))
      .where(eq(quotations.id, id))
      .limit(1);

    if (quotationData.length === 0) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 },
      );
    }

    // Fetch approver name and role if approver exists
    let approverName: string | undefined;
    let approverRole: string | undefined;

    if (quotationData[0].approverId) {
      const approver = await db
        .select({
          firstName: users.firstName,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, quotationData[0].approverId))
        .limit(1);

      if (approver.length > 0) {
        approverName = approver[0].firstName;
        approverRole = approver[0].role;
      }
    }

    // Fetch quotation items
    const items = await db
      .select({
        id: quotationItems.id,
        productId: quotationItems.productId,
        productCode: products.code,
        productName: products.name,
        quantity: quotationItems.quantity,
        unitPrice: quotationItems.unitPrice,
        total: quotationItems.total,
        notes: quotationItems.notes,
      })
      .from(quotationItems)
      .leftJoin(products, eq(quotationItems.productId, products.id))
      .where(eq(quotationItems.quotationId, id));

    return NextResponse.json({
      data: {
        ...quotationData[0],
        approverName,
        approverRole,
        items,
      },
    });
  } catch (error) {
    console.error('Error fetching quotation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotation' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Use request body as UpdateQuotationRequest
    const validatedData = body as UpdateQuotationRequest;

    // Check if quotation exists and is in draft status
    const existingQuotation = await db
      .select({ status: quotations.status })
      .from(quotations)
      .where(eq(quotations.id, id))
      .limit(1);

    if (existingQuotation.length === 0) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 },
      );
    }

    if (existingQuotation[0].status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft quotations can be edited' },
        { status: 400 },
      );
    }

    // Update quotation and items in a transaction
    const result = await db.transaction(async (tx) => {
      // Prepare update data for quotation
      const updateData: any = {};

      if (validatedData.quotationDate) {
        updateData.quotationDate = new Date(validatedData.quotationDate)
          .toISOString()
          .split('T')[0];
      }
      if (validatedData.validUntil) {
        updateData.validUntil = new Date(validatedData.validUntil)
          .toISOString()
          .split('T')[0];
      }
      if (validatedData.customerId) {
        updateData.customerId = validatedData.customerId;
      }
      if (validatedData.approverId !== undefined) {
        updateData.approverId = validatedData.approverId;
      }
      if (validatedData.isIncludePPN !== undefined) {
        updateData.isIncludePPN = validatedData.isIncludePPN;
      }
      if (validatedData.currency) {
        updateData.currency = validatedData.currency;
      }
      if (validatedData.notes !== undefined) {
        updateData.notes = validatedData.notes;
      }
      if (validatedData.termsAndConditions !== undefined) {
        updateData.termsAndConditions = validatedData.termsAndConditions;
      }

      // If items are provided, recalculate totals
      // Note: This endpoint would need to be restructured to handle items properly
      // if ((validatedData as any).items) {
      //   let subtotal = 0;
      //   (validatedData as any).items.forEach((item) => {
      //     subtotal += item.quantity * item.unitPrice;
      //   });

      //   const taxAmount = validatedData.isIncludePPN ? subtotal * 0.11 : 0;
      //   const total = subtotal + taxAmount;

      //   updateData.subtotal = subtotal.toString();
      //   updateData.tax = taxAmount.toString();
      //   updateData.total = total.toString();

      //   // Delete existing items and create new ones
      //   await tx
      //     .delete(quotationItems)
      //     .where(eq(quotationItems.quotationId, id));

      //   const itemsToInsert = validatedData.items.map((item) => ({
      //     quotationId: id,
      //     productId: item.productId,
      //     quantity: item.quantity.toString(),
      //     unitPrice: item.unitPrice.toString(),
      //     total: (item.quantity * item.unitPrice).toString(),
      //     notes: item.notes,
      //   }));

      //   await tx.insert(quotationItems).values(itemsToInsert);
      // }

      // Update quotation if there's data to update
      if (Object.keys(updateData).length > 0) {
        await tx
          .update(quotations)
          .set(updateData)
          .where(eq(quotations.id, id));
      }

      return { success: true };
    });

    // Fetch updated quotation with related data
    const updatedQuotation = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        validUntil: quotations.validUntil,
        customerId: quotations.customerId,
        customerName: customers.name,
        customerCode: customers.code,
        approverId: quotations.approverId,
        subtotal: quotations.subtotal,
        tax: quotations.tax,
        total: quotations.total,
        currency: quotations.currency,
        status: quotations.status,
        notes: quotations.notes,
        termsAndConditions: quotations.termsAndConditions,
        createdBy: quotations.createdBy,
        createdByUser: users.firstName,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .leftJoin(users, eq(quotations.createdBy, users.id))
      .where(eq(quotations.id, id))
      .limit(1);

    // Fetch approver name and role if approver exists
    let approverName: string | undefined;
    let approverRole: string | undefined;

    if (updatedQuotation[0].approverId) {
      const approver = await db
        .select({
          firstName: users.firstName,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, updatedQuotation[0].approverId))
        .limit(1);

      if (approver.length > 0) {
        approverName = approver[0].firstName;
        approverRole = approver[0].role;
      }
    }

    return NextResponse.json({
      message: 'Quotation updated successfully',
      data: {
        ...updatedQuotation[0],
        approverName,
        approverRole,
      },
    });
  } catch (error) {
    console.error('Error updating quotation:', error);

    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to update quotation' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    // Delete the quotation
    await db.delete(quotations).where(eq(quotations.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to delete quotation' },
      { status: 500 },
    );
  }
}
