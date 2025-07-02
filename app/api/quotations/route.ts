import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { customers, quotationItems, quotations, users } from '@/lib/db/schema';
import { createQuotationSchema } from '@/lib/validations/quotation';

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'quotations:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const sortBy = searchParams.get('sortBy');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];
    if (status) {
      conditions.push(eq(quotations.status, status));
    }
    if (customerId) {
      conditions.push(eq(quotations.customerId, customerId));
    }
    if (search) {
      conditions.push(
        or(
          like(quotations.quotationNumber, `%${search}%`),
          like(customers.name, `%${search}%`),
          like(customers.code, `%${search}%`),
          like(quotations.notes, `%${search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = desc(quotations.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'date-asc':
          orderByClause = asc(quotations.quotationDate);
          break;
        case 'date-desc':
          orderByClause = desc(quotations.quotationDate);
          break;
        case 'number-asc':
          orderByClause = asc(quotations.quotationNumber);
          break;
        case 'number-desc':
          orderByClause = desc(quotations.quotationNumber);
          break;
        case 'total-asc':
          orderByClause = asc(quotations.total);
          break;
        case 'total-desc':
          orderByClause = desc(quotations.total);
          break;
        default:
          orderByClause = desc(quotations.createdAt);
      }
    }

    // Fetch quotations with related data
    const quotationsData = await db
      .select({
        id: quotations.id,
        quotationNumber: quotations.quotationNumber,
        quotationDate: quotations.quotationDate,
        validUntil: quotations.validUntil,
        customerId: quotations.customerId,
        customerName: customers.name,
        customerCode: customers.code,
        subtotal: quotations.subtotal,
        tax: quotations.tax,
        total: quotations.total,
        currency: quotations.currency,
        status: quotations.status,
        notes: quotations.notes,
        createdBy: quotations.createdBy,
        createdByUser: users.firstName,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .leftJoin(users, eq(quotations.createdBy, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: quotations.id })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json({
      data: quotationsData,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'quotations:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();

    // Validate request body
    const validatedData = createQuotationSchema.parse(body);

    // Generate quotation number (QUO-YYYYMMDD-XXXX format)
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');

    // Get count of quotations today to generate sequence number
    const todayQuotations = await db
      .select({ count: quotations.id })
      .from(quotations)
      .where(like(quotations.quotationNumber, `QUO-${dateStr}-%`));

    const sequence = (todayQuotations.length + 1).toString().padStart(4, '0');
    const quotationNumber = `QUO-${dateStr}-${sequence}`;

    // Calculate totals from items
    let subtotal = 0;
    validatedData.items.forEach((item) => {
      subtotal += item.quantity * item.unitPrice;
    });

    const taxAmount = validatedData.isIncludePPN ? subtotal * 0.11 : 0;
    const total = subtotal + taxAmount;

    // Create quotation and items in a transaction
    const result = await db.transaction(async (tx) => {
      // Get user ID from authenticated session
      const createdBy = session.user.id;

      // Create quotation (ID will be auto-generated)
      const quotationData = {
        quotationNumber,
        quotationDate: new Date(validatedData.quotationDate),
        validUntil: new Date(validatedData.validUntil),
        customerId: validatedData.customerId,
        approverId: validatedData.approverId,
        isIncludePPN: validatedData.isIncludePPN,
        subtotal: subtotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: total.toFixed(2),
        currency: validatedData.currency,
        status: 'draft' as const,
        notes: validatedData.notes,
        termsAndConditions: validatedData.termsAndConditions,
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

      // Create quotation items (IDs will be auto-generated)
      const itemsToInsert = validatedData.items.map((item) => ({
        quotationId,
        productId: item.productId,
        quantity: item.quantity.toString(),
        unitPrice: item.unitPrice.toString(),
        total: (item.quantity * item.unitPrice).toString(),
        notes: item.notes,
      }));

      await tx.insert(quotationItems).values(itemsToInsert);

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

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Invalid request data', details: (error as any).errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 },
    );
  }
}
