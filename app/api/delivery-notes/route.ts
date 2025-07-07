import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, inArray, like, or } from 'drizzle-orm';

import { db } from '@/lib/db';
import { customers, deliveryNotes, invoices, users } from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

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
          like(deliveryNotes.deliveryNumber, `%${search}%`),
          like(deliveryNotes.notes, `%${search}%`),
        ),
      );
    }

    if (status && status !== 'all') {
      whereConditions.push(eq(deliveryNotes.status, status));
    }

    // Build order by
    let orderBy;
    switch (sortBy) {
      case 'oldest-first':
        orderBy = asc(deliveryNotes.createdAt);
        break;
      case 'number-asc':
        orderBy = asc(deliveryNotes.deliveryNumber);
        break;
      case 'number-desc':
        orderBy = desc(deliveryNotes.deliveryNumber);
        break;
      case 'delivery-date-asc':
        orderBy = asc(deliveryNotes.deliveryDate);
        break;
      case 'delivery-date-desc':
        orderBy = desc(deliveryNotes.deliveryDate);
        break;
      default:
        orderBy = desc(deliveryNotes.createdAt);
    }

    // Get total count for pagination
    const totalCount = await db
      .select({ count: deliveryNotes.id })
      .from(deliveryNotes)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .then((result) => result.length);

    // Get delivery notes with pagination and joins
    const deliveryNotesData = await db
      .select({
        id: deliveryNotes.id,
        deliveryNumber: deliveryNotes.deliveryNumber,
        invoiceId: deliveryNotes.invoiceId,
        customerId: deliveryNotes.customerId,
        deliveryDate: deliveryNotes.deliveryDate,
        deliveryMethod: deliveryNotes.deliveryMethod,
        driverName: deliveryNotes.driverName,
        vehicleNumber: deliveryNotes.vehicleNumber,
        status: deliveryNotes.status,
        deliveredBy: deliveryNotes.deliveredBy,
        receivedBy: deliveryNotes.receivedBy,
        notes: deliveryNotes.notes,
        createdBy: deliveryNotes.createdBy,
        createdAt: deliveryNotes.createdAt,
        updatedAt: deliveryNotes.updatedAt,
        // Customer data
        customer: {
          id: customers.id,
          code: customers.code,
          name: customers.name,
        },
        // Invoice data
        invoice: {
          id: invoices.id,
          invoiceNumber: invoices.invoiceNumber,
        },
        // Created by user data
        createdByUser: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        },
      })
      .from(deliveryNotes)
      .leftJoin(customers, eq(deliveryNotes.customerId, customers.id))
      .leftJoin(invoices, eq(deliveryNotes.invoiceId, invoices.id))
      .leftJoin(users, eq(deliveryNotes.createdBy, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    // Fetch user data for deliveredBy and receivedBy separately
    const userIds = new Set<string>();
    deliveryNotesData.forEach((note) => {
      if (note.deliveredBy) userIds.add(note.deliveredBy);
      if (note.receivedBy) userIds.add(note.receivedBy);
    });

    let userData: Record<
      string,
      { id: string; firstName: string; lastName: string }
    > = {};
    if (userIds.size > 0) {
      const usersData = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .where(inArray(users.id, Array.from(userIds)));

      userData = usersData.reduce(
        (acc, user) => {
          acc[user.id] = user;
          return acc;
        },
        {} as Record<
          string,
          { id: string; firstName: string; lastName: string }
        >,
      );
    }

    // Enhance delivery notes data with user information
    const enhancedDeliveryNotesData = deliveryNotesData.map((note) => ({
      ...note,
      deliveredByUser: note.deliveredBy
        ? userData[note.deliveredBy] || null
        : null,
      receivedByUser: note.receivedBy
        ? userData[note.receivedBy] || null
        : null,
    }));

    return NextResponse.json({
      data: enhancedDeliveryNotesData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching delivery notes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery notes' },
      { status: 500 },
    );
  }
}
