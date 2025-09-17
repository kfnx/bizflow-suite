import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, inArray, like, or } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { DELIVERY_NOTE_STATUS } from '@/lib/db/enum';
import {
  branches,
  customers,
  deliveryNoteItems,
  deliveryNotes,
  invoices,
  quotations,
  users,
} from '@/lib/db/schema';
import { generateNextDeliveryNumber } from '@/lib/utils/delivery-number';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      whereConditions.push(eq(deliveryNotes.branchId, session.user.branchId));
    }

    if (search) {
      whereConditions.push(
        or(
          like(deliveryNotes.deliveryNumber, `%${search}%`),
          like(deliveryNotes.notes, `%${search}%`),
        ),
      );
    }

    if (status && status !== 'all') {
      // Validate that the status is a valid enum value
      const validStatuses = Object.values(DELIVERY_NOTE_STATUS);
      if (validStatuses.includes(status as DELIVERY_NOTE_STATUS)) {
        whereConditions.push(
          eq(deliveryNotes.status, status as DELIVERY_NOTE_STATUS),
        );
      }
    }

    if (branch) {
      whereConditions.push(eq(deliveryNotes.branchId, branch));
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
      .leftJoin(branches, eq(deliveryNotes.branchId, branches.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .then((result) => result.length);

    // Get delivery notes with pagination and joins
    const deliveryNotesData = await db
      .select({
        id: deliveryNotes.id,
        deliveryNumber: deliveryNotes.deliveryNumber,
        invoiceId: deliveryNotes.invoiceId,
        quotationId: deliveryNotes.quotationId,
        customerId: deliveryNotes.customerId,
        branchId: deliveryNotes.branchId,
        branchName: branches.name,
        deliveryDate: deliveryNotes.deliveryDate,
        deliveryMethod: deliveryNotes.deliveryMethod,
        driverName: deliveryNotes.driverName,
        vehicleNumber: deliveryNotes.vehicleNumber,
        status: deliveryNotes.status,
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
      .from(deliveryNotes)
      .leftJoin(customers, eq(deliveryNotes.customerId, customers.id))
      .leftJoin(invoices, eq(deliveryNotes.invoiceId, invoices.id))
      .leftJoin(quotations, eq(deliveryNotes.quotationId, quotations.id))
      .leftJoin(users, eq(deliveryNotes.createdBy, users.id))
      .leftJoin(branches, eq(deliveryNotes.branchId, branches.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(orderBy)
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(totalCount / limit);

    // Fetch user data for createdBy
    const userIds = new Set<string>();
    deliveryNotesData.forEach((note) => {
      if (note.createdBy) userIds.add(note.createdBy);
    });

    let userData: Record<
      string,
      { id: string; firstName: string; lastName: string | null }
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
          { id: string; firstName: string; lastName: string | null }
        >,
      );
    }

    // Enhance delivery notes data with user information
    const enhancedDeliveryNotesData = deliveryNotesData.map((note) => ({
      ...note,
      createdByUser: note.createdBy
        ? userData[note.createdBy] || null
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

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Basic validation
    if (!body.customerId) {
      return NextResponse.json(
        { error: 'Customer is required' },
        { status: 400 },
      );
    }

    if (!body.deliveryDate) {
      return NextResponse.json(
        { error: 'Delivery date is required' },
        { status: 400 },
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'At least one item is required' },
        { status: 400 },
      );
    }

    // Generate delivery number if not provided
    let deliveryNumber = body.deliveryNumber;
    if (!deliveryNumber) {
      deliveryNumber = await generateNextDeliveryNumber();
    }

    // Create delivery note
    const deliveryNoteData = {
      deliveryNumber,
      invoiceId: body.invoiceId || null,
      quotationId: body.quotationId || null,
      customerId: body.customerId,
      branchId: session.user.branchId || null,
      deliveryDate: new Date(body.deliveryDate),
      deliveryMethod: body.deliveryMethod || null,
      driverName: body.driverName || null,
      vehicleNumber: body.vehicleNumber || null,
      status: DELIVERY_NOTE_STATUS.PENDING,
      notes: body.notes || null,
      createdBy: session.user.id,
    };

    // Insert delivery note and get the ID
    const result = await db.insert(deliveryNotes).values(deliveryNoteData);
    
    // Get the inserted delivery note to get its ID
    const insertedDeliveryNote = await db
      .select()
      .from(deliveryNotes)
      .where(eq(deliveryNotes.deliveryNumber, deliveryNumber))
      .limit(1);
    
    const deliveryNoteId = insertedDeliveryNote[0]?.id;

    // Insert delivery note items
    if (body.items && body.items.length > 0 && deliveryNoteId) {
      const deliveryNoteItemsData = body.items.map((item: { productId: string; quantity: number; warehouseId: string }) => ({
        deliveryNoteId,
        productId: item.productId,
        quantity: item.quantity,
        warehouseId: item.warehouseId,
      }));

      await db.insert(deliveryNoteItems).values(deliveryNoteItemsData);
    }

    return NextResponse.json(
      {
        message: 'Delivery note created successfully',
        deliveryNumber,
        id: deliveryNoteId,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating delivery note:', error);
    return NextResponse.json(
      { error: 'Failed to create delivery note' },
      { status: 500 },
    );
  }
}
