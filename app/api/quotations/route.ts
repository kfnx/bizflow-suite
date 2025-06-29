import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customers, quotations, users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
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
