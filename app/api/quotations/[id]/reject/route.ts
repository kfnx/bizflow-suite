import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAnyRole, requireAuth } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
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
        approverId: quotations.approverId,
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

    // Check if the current user is the assigned approver
    if (quotation.approverId !== session.user.id) {
      return NextResponse.json(
        { error: 'You are not authorized to reject this quotation' },
        { status: 403 },
      );
    }

    // Check if quotation is in 'draft' status
    if (quotation.status !== 'draft') {
      return NextResponse.json(
        { error: 'Only draft quotations can be rejected' },
        { status: 400 },
      );
    }

    // Update quotation status to 'rejected' and add rejection reason to notes
    await db
      .update(quotations)
      .set({
        status: 'rejected',
        notes: validatedData.reason,
      })
      .where(eq(quotations.id, id));

    return NextResponse.json({
      message: 'Quotation rejected successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        status: 'rejected',
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
