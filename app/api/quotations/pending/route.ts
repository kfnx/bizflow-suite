import { NextRequest, NextResponse } from 'next/server';
import { and, eq, isNull } from 'drizzle-orm';

import { requireAnyRole, requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import {
  customers,
  products,
  quotationItems,
  quotations,
  users,
} from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  // Check if user has manager or director role
  const roleCheck = await requireAnyRole(request, ['manager', 'director']);
  if (roleCheck instanceof NextResponse) {
    return roleCheck;
  }

  try {
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Fetch pending quotations (status = 'sent') assigned to the current user as approver
    const pendingQuotations = await db
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
        status: quotations.status,
        notes: quotations.notes,
        termsAndConditions: quotations.termsAndConditions,
        createdBy: quotations.createdBy,
        createdByUser: users.firstName,
        approvedBy: quotations.approvedBy,
        createdAt: quotations.createdAt,
        updatedAt: quotations.updatedAt,
      })
      .from(quotations)
      .leftJoin(customers, eq(quotations.customerId, customers.id))
      .leftJoin(users, eq(quotations.createdBy, users.id))
      .where(
        and(
          eq(quotations.status, QUOTATION_STATUS.SUBMITTED),
          isNull(quotations.approvedBy),
          isNull(quotations.invoiceId), // Exclude quotations that have been invoiced
        ),
      )
      .orderBy(quotations.createdAt)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: quotations.id })
      .from(quotations)
      .where(
        and(
          eq(quotations.status, QUOTATION_STATUS.SUBMITTED),
          isNull(quotations.approvedBy),
          isNull(quotations.invoiceId), // Exclude quotations that have been invoiced
        ),
      );

    // Fetch quotation items for each quotation
    const quotationsWithItems = await Promise.all(
      pendingQuotations.map(async (quotation) => {
        const items = await db
          .select({
            id: quotationItems.id,
            productId: quotationItems.productId,
            name: products.name,
            quantity: quotationItems.quantity,
            unitPrice: quotationItems.unitPrice,
            total: quotationItems.total,
            notes: quotationItems.notes,
          })
          .from(quotationItems)
          .leftJoin(products, eq(quotationItems.productId, products.id))
          .where(eq(quotationItems.quotationId, quotation.id));

        return {
          ...quotation,
          items,
        };
      }),
    );

    return NextResponse.json({
      data: quotationsWithItems,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching pending quotations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending quotations' },
      { status: 500 },
    );
  }
}
