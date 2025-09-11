import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { INVOICE_STATUS } from '@/lib/db/enum';
import {
  branches,
  customers,
  invoiceItems,
  invoices,
  quotations,
  users,
} from '@/lib/db/schema';
import { hasPermission } from '@/lib/permissions';
import { updateInvoiceRequestSchema } from '@/lib/validations/invoice';
import { parseNumberFromDots } from '@/utils/number-formatter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and permissions
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Re-implement permission check once database is available
    if (!session.user.isAdmin) {
      // return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const branch = searchParams.get('branch');
    const sortBy = searchParams.get('sortBy') || 'newest-first';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    // Branch-based access control// Branch-based access control
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
      whereConditions.push(eq(invoices.branchId, session.user.branchId));
    }

    if (search) {
      whereConditions.push(
        or(
          like(invoices.invoiceNumber, `%${search}%`),
          like(invoices.notes, `%${search}%`),
        ),
      );
    }

    if (status && status !== 'all') {
      whereConditions.push(eq(invoices.status, status as INVOICE_STATUS));
    }

    if (branch) {
      whereConditions.push(eq(invoices.branchId, branch));
    }

    // Build order by
    let orderBy;
    switch (sortBy) {
      case 'oldest-first':
        orderBy = asc(invoices.createdAt);
        break;
      case 'number-asc':
        orderBy = asc(invoices.invoiceNumber);
        break;
      case 'number-desc':
        orderBy = desc(invoices.invoiceNumber);
        break;
      case 'due-date-asc':
        orderBy = asc(invoices.dueDate);
        break;
      case 'due-date-desc':
        orderBy = desc(invoices.dueDate);
        break;
      case 'total-asc':
        orderBy = asc(invoices.total);
        break;
      case 'total-desc':
        orderBy = desc(invoices.total);
        break;
      default:
        orderBy = desc(invoices.createdAt);
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: invoices.id })
      .from(invoices)
      .leftJoin(branches, eq(invoices.branchId, branches.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .then((result) => result.length);

    // Get invoices with pagination and joins
    const invoicesData = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        quotationId: invoices.quotationId,
        invoiceDate: invoices.invoiceDate,
        dueDate: invoices.dueDate,
        customerId: invoices.customerId,
        branchId: invoices.branchId,
        branchName: branches.name,
        subtotal: invoices.subtotal,
        tax: invoices.tax,
        total: invoices.total,
        currency: invoices.currency,
        status: invoices.status,
        paymentTerms: invoices.paymentTerms,
        isIncludePPN: invoices.isIncludePPN,
        createdBy: invoices.createdBy,
        createdAt: invoices.createdAt,
        updatedAt: invoices.updatedAt,
        // Customer data
        customer: {
          id: customers.id,
          code: customers.code,
          name: customers.name,
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
      .leftJoin(branches, eq(invoices.branchId, branches.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: invoicesData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'invoices:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = updateInvoiceRequestSchema.safeParse(body);

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

    // Calculate totals from items
    let subtotal = 0;
    validatedData.items.forEach(
      (item: { quantity: number; unitPrice: string }) => {
        // Parse unit price using proper number formatter
        const cleanPrice = parseNumberFromDots(item.unitPrice);
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

    // Create invoice and items in a transaction
    const result = await db.transaction(async (tx) => {
      // Get user ID from authenticated session
      const createdBy = session.user.id;
      const branchId = session.user.branchId || '';

      // Create invoice (ID will be auto-generated)
      const invoiceData = {
        invoiceNumber,
        invoiceDate: new Date(validatedData.invoiceDate),
        dueDate: new Date(validatedData.dueDate),
        customerId: validatedData.customerId,
        branchId,
        contractNumber: null,
        customerPoNumber: null,
        subtotal: subtotal.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: total.toFixed(2),
        currency: validatedData.currency || 'IDR',
        status:
          (validatedData.status as INVOICE_STATUS) || INVOICE_STATUS.DRAFT,
        paymentTerms: validatedData.paymentTerms,
        notes: validatedData.notes,
        salesmanUserId: createdBy,
        isIncludePPN: validatedData.isIncludePPN || false,
        createdBy,
      };

      await tx.insert(invoices).values(invoiceData);

      // Get the generated invoice ID
      const createdInvoiceResult = await tx
        .select({ id: invoices.id })
        .from(invoices)
        .where(eq(invoices.invoiceNumber, invoiceNumber))
        .limit(1);

      const invoiceId = createdInvoiceResult[0].id;

      if (validatedData.items.length > 0) {
        // Create invoice items (IDs will be auto-generated)
        const itemsToInsert = validatedData.items.map(
          (item: {
            productId: string;
            quantity: number;
            unitPrice: string;
          }) => {
            // Parse unit price using proper number formatter
            const cleanPrice = parseNumberFromDots(item.unitPrice);
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
              invoiceId,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: unitPrice.toFixed(2),
              total: itemTotal.toFixed(2),
            };
          },
        );

        await tx.insert(invoiceItems).values(itemsToInsert);
      }

      return { invoiceId, invoiceNumber };
    });

    // Fetch the created invoice with related data
    const createdInvoice = await db
      .select({
        id: invoices.id,
        invoiceNumber: invoices.invoiceNumber,
        invoiceDate: invoices.invoiceDate,
        dueDate: invoices.dueDate,
        customerId: invoices.customerId,
        branchId: invoices.branchId,
        subtotal: invoices.subtotal,
        tax: invoices.tax,
        total: invoices.total,
        currency: invoices.currency,
        status: invoices.status,
        paymentTerms: invoices.paymentTerms,
        notes: invoices.notes,
        isIncludePPN: invoices.isIncludePPN,
        createdBy: invoices.createdBy,
        createdAt: invoices.createdAt,
        // Customer data
        customer: {
          id: customers.id,
          code: customers.code,
          name: customers.name,
        },
      })
      .from(invoices)
      .leftJoin(customers, eq(invoices.customerId, customers.id))
      .where(eq(invoices.id, result.invoiceId))
      .limit(1);

    return NextResponse.json({
      message: 'Invoice created successfully',
      data: createdInvoice[0],
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to create invoice',
      },
      { status: 500 },
    );
  }
}
