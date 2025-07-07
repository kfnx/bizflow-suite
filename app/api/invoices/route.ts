import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customers, invoices, quotations, users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const sortBy = searchParams.get('sortBy') || 'newest-first';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          like(invoices.invoiceNumber, `%${search}%`),
          like(invoices.notes, `%${search}%`),
        ),
      );
    }

    if (status && status !== 'all') {
      whereConditions.push(eq(invoices.status, status));
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
