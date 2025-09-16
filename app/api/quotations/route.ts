import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, inArray, isNull, like, or } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import {
  branches,
  customerContactPersons,
  customers,
  quotationItems,
  quotations,
  users,
} from '@/lib/db/schema';
import { createQuotationRequestSchema } from '@/lib/validations/quotation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'quotations:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
    const branch = searchParams.get('branch');
    const sortBy = searchParams.get('sortBy');
    const readyForInvoice = searchParams.get('ready_for_invoice');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    // Branch-based access control
    // HO users see all branches, others can only see their own branch
    // get branch name from branchId
    const branchName = session.user.branchId
      ? await db
          .select({ name: branches.name })
          .from(branches)
          .where(eq(branches.id, session.user.branchId))
          .limit(1)
          .then((result) => result[0]?.name || null)
          .catch(() => null)
      : null;
    if (branchName && !branchName.startsWith('HO') && session.user.branchId) {
      conditions.push(eq(quotations.branchId, session.user.branchId));
    }
    if (status && status !== 'all') {
      const statusValue =
        QUOTATION_STATUS[status.toUpperCase() as keyof typeof QUOTATION_STATUS];
      if (statusValue) {
        conditions.push(eq(quotations.status, statusValue));
      } else {
        console.warn('Invalid status value:', status);
      }
    }
    if (customerId) {
      conditions.push(eq(quotations.customerId, customerId));
    }
    if (branch) {
      conditions.push(eq(quotations.branchId, branch));
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
    if (readyForInvoice === 'true') {
      // Filter for quotations that are accepted but not yet invoiced
      conditions.push(isNull(quotations.invoiceId));
    }

    // Build order by clause
    let orderByClause = desc(quotations.createdAt);
    if (sortBy) {
      switch (sortBy) {
        case 'newest-first':
          orderByClause = desc(quotations.createdAt);
          break;
        case 'oldest-first':
          orderByClause = asc(quotations.createdAt);
          break;
        case 'date-asc':
        case 'quotation-date-asc':
          orderByClause = asc(quotations.quotationDate);
          break;
        case 'date-desc':
        case 'quotation-date-desc':
          orderByClause = desc(quotations.quotationDate);
          break;
        case 'valid-until-asc':
          orderByClause = asc(quotations.validUntil);
          break;
        case 'valid-until-desc':
          orderByClause = desc(quotations.validUntil);
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
        customerType: customers.type,
        customerAddress: customers.address,
        customerContactPerson: customerContactPersons.name,
        customerContactPersonPrefix: customerContactPersons.prefix,
        customerContactPersonEmail: customerContactPersons.email,
        customerContactPersonPhone: customerContactPersons.phone,
        branchId: quotations.branchId,
        branchName: branches.name,
        subtotal: quotations.subtotal,
        tax: quotations.tax,
        total: quotations.total,
        status: quotations.status,
        notes: quotations.notes,
        createdBy: quotations.createdBy,
        createdByUserFirstName: users.firstName,
        createdByUserLastName: users.lastName,
        invoiceId: quotations.invoiceId,
        invoicedAt: quotations.invoicedAt,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .leftJoin(
        customerContactPersons,
        eq(quotations.customerId, customerContactPersons.customerId),
      )
      .leftJoin(users, eq(quotations.createdBy, users.id))
      .leftJoin(branches, eq(quotations.branchId, branches.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: quotations.id })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .leftJoin(
        customerContactPersons,
        eq(quotations.customerId, customerContactPersons.customerId),
      )
      .leftJoin(branches, eq(quotations.branchId, branches.id))
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

    // Validate request body using Zod schema
    const validationResult = createQuotationRequestSchema.safeParse(body);

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

    // Generate quotation number (QT/YYYY/MM/XXX format)
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');

    // Get count of quotations this month to generate sequence number
    const monthQuotations = await db
      .select({ count: quotations.id })
      .from(quotations)
      .where(like(quotations.quotationNumber, `QT/${year}/${month}/%`));

    const sequence = (monthQuotations.length + 1).toString().padStart(3, '0');
    const quotationNumber = `QT/${year}/${month}/${sequence}`;

    // Calculate totals from items
    let subtotal = 0;
    validatedData.items.forEach(
      (item: { quantity: number; unitPrice: string }) => {
        // Parse unit price using proper number formatter
        const cleanPrice = item.unitPrice.replace(/\./g, '').replace(',', '.');
        const unitPrice = parseFloat(cleanPrice) || 0;

        // Validate that the price is within reasonable bounds
        if (unitPrice > 999999999999.99) {
          throw new Error(
            `Unit price ${item.unitPrice} is too large. Maximum allowed is 999,999,999,999.99`,
          );
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
      const branchId = session.user.branchId || '';

      // Create quotation (ID will be auto-generated)
      const quotationData = {
        quotationNumber,
        quotationDate: new Date(validatedData.quotationDate),
        validUntil: new Date(validatedData.validUntil),
        customerId: validatedData.customerId,
        isIncludePPN: validatedData.isIncludePPN || false,
        subtotal: subtotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: total.toFixed(2),
        status: validatedData.status,
        notes: validatedData.notes,
        termsAndConditions: validatedData.termsAndConditions,
        branchId,
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
              throw new Error(
                `Unit price ${item.unitPrice} is too large. Maximum allowed is 999,999,999,999.99`,
              );
            }

            const itemTotal = item.quantity * unitPrice;
            if (itemTotal > 999999999999.99) {
              throw new Error(
                `Item total ${itemTotal.toLocaleString()} is too large. Maximum allowed is 999,999,999,999.99`,
              );
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
        customerContactPerson: customerContactPersons.name,
        customerContactPersonPrefix: customerContactPersons.prefix,
        customerContactPersonEmail: customerContactPersons.email,
        customerContactPersonPhone: customerContactPersons.phone,
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
      .leftJoin(
        customerContactPersons,
        eq(quotations.customerId, customerContactPersons.customerId),
      )
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
