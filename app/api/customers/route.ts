import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customers } from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    // Build query conditions
    const conditions: any[] = [];

    // Fetch customers
    const customersData = await db
      .select({
        id: customers.id,
        code: customers.code,
        name: customers.name,
        type: customers.type,
        contactPersonName: customers.contactPersonName,
        contactPersonEmail: customers.contactPersonEmail,
        contactPersonPhone: customers.contactPersonPhone,
        createdAt: customers.createdAt,
      })
      .from(customers)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(customers.name);

    return NextResponse.json({
      data: customersData,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 },
    );
  }
}
