import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { DELIVERY_NOTE_STATUS } from '@/lib/db/enum';
import {
  branches,
  customerContactPersons,
  customers,
  deliveryNoteItems,
  deliveryNotes,
  invoices,
  products,
  users,
} from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryNoteId = params.id;
    if (!deliveryNoteId) {
      return NextResponse.json(
        { error: 'Delivery note ID is required' },
        { status: 400 },
      );
    }

    // Get delivery note with joins
    const deliveryNoteData = await db
      .select({
        id: deliveryNotes.id,
        deliveryNumber: deliveryNotes.deliveryNumber,
        invoiceId: deliveryNotes.invoiceId,
        customerId: deliveryNotes.customerId,
        branchId: deliveryNotes.branchId,
        branchName: branches.name,
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
          address: customers.address,
          city: customers.city,
          province: customers.province,
          country: customers.country,
          postalCode: customers.postalCode,
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
      .leftJoin(branches, eq(deliveryNotes.branchId, branches.id))
      .where(eq(deliveryNotes.id, deliveryNoteId))
      .limit(1);

    if (deliveryNoteData.length === 0) {
      return NextResponse.json(
        { error: 'Delivery note not found' },
        { status: 404 },
      );
    }

    const deliveryNote = deliveryNoteData[0];

    // Get customer contact persons
    const contactPersons = await db
      .select({
        id: customerContactPersons.id,
        prefix: customerContactPersons.prefix,
        name: customerContactPersons.name,
        email: customerContactPersons.email,
        phone: customerContactPersons.phone,
      })
      .from(customerContactPersons)
      .where(eq(customerContactPersons.customerId, deliveryNote.customerId));

    // Branch-based access control
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
      if (deliveryNote.branchId !== session.user.branchId) {
        return NextResponse.json(
          { error: 'Access denied to this delivery note' },
          { status: 403 },
        );
      }
    }

    // Get delivery note items
    const items = await db
      .select({
        id: deliveryNoteItems.id,
        productId: deliveryNoteItems.productId,
        quantity: deliveryNoteItems.quantity,
        // Product data - include category and additionalSpecs at top level for consistency
        name: products.name,
        category: products.category,
        additionalSpecs: products.additionalSpecs,
        // Product data for backward compatibility
        product: {
          id: products.id,
          name: products.name,
          code: products.code,
          category: products.category,
          partNumber: products.partNumber,
          machineModel: products.machineModel,
          engineNumber: products.engineNumber,
          serialNumber: products.serialNumber,
          additionalSpecs: products.additionalSpecs,
          machineTypeId: products.machineTypeId,
          unitOfMeasureId: products.unitOfMeasureId,
        },
      })
      .from(deliveryNoteItems)
      .leftJoin(products, eq(deliveryNoteItems.productId, products.id))
      .where(eq(deliveryNoteItems.deliveryNoteId, deliveryNoteId));

    // Get user data for deliveredBy and receivedBy
    const userIds = [];
    if (deliveryNote.deliveredBy) userIds.push(deliveryNote.deliveredBy);
    if (deliveryNote.receivedBy) userIds.push(deliveryNote.receivedBy);

    let userData: Record<
      string,
      { id: string; firstName: string; lastName: string | null }
    > = {};

    if (userIds.length > 0) {
      const usersData = await db
        .select({
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
        })
        .from(users)
        .where(eq(users.id, userIds[0])); // This would need to be adjusted for multiple IDs

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

    // Enhance delivery note data with user information and items
    const enhancedDeliveryNote = {
      ...deliveryNote,
      customer: {
        ...deliveryNote.customer,
        contactPersons: contactPersons,
      },
      deliveredByUser: deliveryNote.deliveredBy
        ? userData[deliveryNote.deliveredBy] || null
        : null,
      receivedByUser: deliveryNote.receivedBy
        ? userData[deliveryNote.receivedBy] || null
        : null,
      items: items.map((item) => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        category: item.category,
        additionalSpecs: item.additionalSpecs,
        quantity: item.quantity,
        product: item.product,
      })),
    };

    return NextResponse.json({
      data: enhancedDeliveryNote,
    });
  } catch (error) {
    console.error('Error fetching delivery note:', error);
    return NextResponse.json(
      { error: 'Failed to fetch delivery note' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryNoteId = params.id;
    if (!deliveryNoteId) {
      return NextResponse.json(
        { error: 'Delivery note ID is required' },
        { status: 400 },
      );
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

    // Validate items
    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      if (!item.productId) {
        return NextResponse.json(
          { error: `Product is required for item ${i + 1}` },
          { status: 400 },
        );
      }
      if (!item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: `Quantity must be at least 1 for item ${i + 1}` },
          { status: 400 },
        );
      }
    }

    // Check if delivery note exists
    const existingDeliveryNote = await db
      .select({ id: deliveryNotes.id, branchId: deliveryNotes.branchId })
      .from(deliveryNotes)
      .where(eq(deliveryNotes.id, deliveryNoteId))
      .limit(1);

    if (existingDeliveryNote.length === 0) {
      return NextResponse.json(
        { error: 'Delivery note not found' },
        { status: 404 },
      );
    }

    // Branch-based access control
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
      if (existingDeliveryNote[0].branchId !== session.user.branchId) {
        return NextResponse.json(
          { error: 'Access denied to update this delivery note' },
          { status: 403 },
        );
      }
    }

    // Update delivery note
    const updateData = {
      invoiceId: body.invoiceId || null,
      customerId: body.customerId,
      deliveryDate: new Date(body.deliveryDate),
      deliveryMethod: body.deliveryMethod || null,
      driverName: body.driverName || null,
      vehicleNumber: body.vehicleNumber || null,
      notes: body.notes || null,
      updatedAt: new Date(),
    };

    await db
      .update(deliveryNotes)
      .set(updateData)
      .where(eq(deliveryNotes.id, deliveryNoteId));

    // Delete existing items
    await db
      .delete(deliveryNoteItems)
      .where(eq(deliveryNoteItems.deliveryNoteId, deliveryNoteId));

    // Insert new items
    if (body.items && body.items.length > 0) {
      const itemsData = body.items.map((item: any) => ({
        deliveryNoteId,
        productId: item.productId,
        quantity: item.quantity,
      }));

      await db.insert(deliveryNoteItems).values(itemsData);
    }

    return NextResponse.json({
      message: 'Delivery note updated successfully',
    });
  } catch (error) {
    console.error('Error updating delivery note:', error);
    return NextResponse.json(
      { error: 'Failed to update delivery note' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const deliveryNoteId = params.id;
    if (!deliveryNoteId) {
      return NextResponse.json(
        { error: 'Delivery note ID is required' },
        { status: 400 },
      );
    }

    // Check if delivery note exists
    const existingDeliveryNote = await db
      .select({ id: deliveryNotes.id, branchId: deliveryNotes.branchId })
      .from(deliveryNotes)
      .where(eq(deliveryNotes.id, deliveryNoteId))
      .limit(1);

    if (existingDeliveryNote.length === 0) {
      return NextResponse.json(
        { error: 'Delivery note not found' },
        { status: 404 },
      );
    }

    // Branch-based access control
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
      if (existingDeliveryNote[0].branchId !== session.user.branchId) {
        return NextResponse.json(
          { error: 'Access denied to delete this delivery note' },
          { status: 403 },
        );
      }
    }

    // Delete delivery note items first
    await db
      .delete(deliveryNoteItems)
      .where(eq(deliveryNoteItems.deliveryNoteId, deliveryNoteId));

    // Delete delivery note
    await db.delete(deliveryNotes).where(eq(deliveryNotes.id, deliveryNoteId));

    return NextResponse.json({
      message: 'Delivery note deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting delivery note:', error);
    return NextResponse.json(
      { error: 'Failed to delete delivery note' },
      { status: 500 },
    );
  }
}
