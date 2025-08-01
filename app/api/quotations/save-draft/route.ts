import { NextRequest, NextResponse } from 'next/server';
import { eq, like } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { customers, quotationItems, quotations, users } from '@/lib/db/schema';
import { createQuotationDraftRequestSchema } from '@/lib/validations/quotation';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'quotations:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = createQuotationDraftRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // Calculate totals from items
    let subtotal = 0;
    validatedData.items.forEach(
      (item: { quantity: number; unitPrice: string }) => {
        // Parse unit price using proper number formatter
        const cleanPrice = item.unitPrice.replace(/\./g, '').replace(',', '.');
        const unitPrice = parseFloat(cleanPrice) || 0;
        
        // Validate that the price is within reasonable bounds
        if (unitPrice > 999999999999.99) {
          throw new Error(`Unit price ${item.unitPrice} is too large. Maximum allowed is 999,999,999,999.99`);
        }
        
        subtotal += item.quantity * unitPrice;
      },
    );

    const taxAmount = validatedData.isIncludePPN ? subtotal * 0.11 : 0;
    const total = subtotal + taxAmount;

    // Create quotation and items in a transaction
    const result = await db.transaction(async (tx) => {
      // Get user ID from authenticated session
      const createdBy = session.user.id;
      const branchId = session.user.branchId;
      const { quotationNumber } = validatedData;
      // Create quotation (ID will be auto-generated)
      const quotationData = {
        quotationNumber,
        quotationDate: new Date(validatedData.quotationDate),
        validUntil: new Date(validatedData.validUntil),
        customerId: validatedData.customerId || null,
        isIncludePPN: validatedData.isIncludePPN || false,
        subtotal: subtotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: total.toFixed(2),
        status: QUOTATION_STATUS.DRAFT,
        notes: validatedData.notes || null, // Handle optional text fields
        termsAndConditions: validatedData.termsAndConditions || null, // Handle optional text fields
        branchId: branchId || null,
        createdBy,
      };

      await tx.insert(quotations).values(quotationData);

      // Get the generated quotation ID
      const createdQuotationResult = await tx
        .select({ id: quotations.id })
        .from(quotations)
        .where(eq(quotations.quotationNumber, quotationNumber))
        .limit(1);

      const quotationId = createdQuotationResult[0].id;
      // TODO: handle quotation items difference during draft vs submitted
      if (validatedData.items.length > 0) {
        // Create quotation items (IDs will be auto-generated)
        const itemsToInsert = validatedData.items.map(
          (item: {
            productId: string;
            quantity: number;
            unitPrice: string;
            notes?: string;
          }) => {
            // Parse unit price using proper number formatter
            const cleanPrice = item.unitPrice
              .replace(/\./g, '')
              .replace(',', '.');
            const unitPrice = parseFloat(cleanPrice) || 0;
            
            // Validate that the price is within reasonable bounds
            if (unitPrice > 999999999999.99) {
              throw new Error(`Unit price ${item.unitPrice} is too large. Maximum allowed is 999,999,999,999.99`);
            }
            
            const itemTotal = item.quantity * unitPrice;
            if (itemTotal > 999999999999.99) {
              throw new Error(`Item total ${itemTotal.toLocaleString()} is too large. Maximum allowed is 999,999,999,999.99`);
            }
            
            return {
              quotationId,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: unitPrice.toFixed(2),
              total: itemTotal.toFixed(2),
              notes: item.notes,
            };
          },
        );

        await tx.insert(quotationItems).values(itemsToInsert);
      }

      return { quotationId, quotationNumber };
    });

    // Fetch the created quotation with related data
    const createdQuotation = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        validUntil: quotations.validUntil,
        customerId: quotations.customerId,
        customerName: customers.name,
        customerCode: customers.code,
        customerType: customers.type,
        subtotal: quotations.subtotal,
        tax: quotations.tax,
        total: quotations.total,
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
      .where(eq(quotations.id, result.quotationId))
      .limit(1);

    return NextResponse.json(
      {
        message: 'Quotation created successfully',
        data: createdQuotation[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating quotation:', error);

    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 },
    );
  }
}
