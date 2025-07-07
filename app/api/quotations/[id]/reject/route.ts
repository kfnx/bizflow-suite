import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAnyRole, requireAuth } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations } from '@/lib/db/schema';

interface RejectQuotationRequest {
  reason: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
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
    const db = await getDB();
    const { id } = params;
    const body = await request.json();

    // Use request body as RejectQuotationRequest
    const validatedData = body as RejectQuotationRequest;

    // Check if quotation exists and is assigned to the current user as approver
    const existingQuotation = await db
      .select({
        id: quotations.id,
        status: quotations.status,
        quotationNumber: quotations.quotationNumber,
      })
      .from(quotations)
      .where(eq(quotations.id, id))
      .limit(1);

    if (existingQuotation.length === 0) {
      return NextResponse.json(
        { error: 'Quotation not found' },
        { status: 404 },
      );
    }

    const quotation = existingQuotation[0];

    // Check if quotation is in 'submitted' status
    if (quotation.status !== QUOTATION_STATUS.SUBMITTED) {
      return NextResponse.json(
        { error: 'Only submitted quotations can be rejected' },
        { status: 400 },
      );
    }

    // Update quotation status to 'rejected' and add rejection reason to notes
    const status = QUOTATION_STATUS.REJECTED;
    await db
      .update(quotations)
      .set({
        status,
        notes: validatedData.reason,
      })
      .where(eq(quotations.id, id));

    return NextResponse.json({
      message: 'Quotation rejected successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        status,
        reason: validatedData.reason,
      },
    });
  } catch (error) {
    console.error('Error rejecting quotation:', error);

    if (error instanceof Error && error.message.includes('validation')) {
      return NextResponse.json(
        { error: 'Validation error', details: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: 'Failed to reject quotation' },
      { status: 500 },
    );
  }
}
