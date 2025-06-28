import { NextRequest, NextResponse } from 'next/server';
import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customers, quotations, users } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const customerId = searchParams.get('customerId');
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
      .orderBy(desc(quotations.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: quotations.id })
      .from(quotations)
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
