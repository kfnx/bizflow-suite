import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAnyRole, requireAuth } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations } from '@/lib/db/schema';

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

    // Check if quotation is in 'sent' status
    if (quotation.status !== QUOTATION_STATUS.SUBMITTED) {
      return NextResponse.json(
        { error: 'Only submmitted quotations can be approved' },
        { status: 400 },
      );
    }

    // Update quotation approver. status is not changed
    await db
      .update(quotations)
      .set({ approvedBy: session.user.id })
      .where(eq(quotations.id, id));

    return NextResponse.json({
      message: 'Quotation approved successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        approvedBy: session.user.id,
      },
    });
  } catch (error) {
    console.error('Error approving quotation:', error);
    return NextResponse.json(
      { error: 'Failed to approve quotation' },
      { status: 500 },
    );
  }
}
