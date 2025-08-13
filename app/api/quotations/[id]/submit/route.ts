import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations } from '@/lib/db/schema';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'quotations:update');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;

    // Check if quotation exists and is in draft status
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

    if (
      existingQuotation[0].status !== QUOTATION_STATUS.DRAFT &&
      existingQuotation[0].status !== QUOTATION_STATUS.REVISED
    ) {
      return NextResponse.json(
        { error: 'Only draft and revised quotations can be submitted' },
        { status: 400 },
      );
    }

    // Update quotation status to submitted
    await db
      .update(quotations)
      .set({
        status: QUOTATION_STATUS.SUBMITTED,
        updatedAt: new Date(),
      })
      .where(eq(quotations.id, id));

    return NextResponse.json(
      {
        message: 'Quotation submitted successfully',
        data: {
          id: existingQuotation[0].id,
          quotationNumber: existingQuotation[0].quotationNumber,
          status: QUOTATION_STATUS.SUBMITTED,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error submitting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to submit quotation' },
      { status: 500 },
    );
  }
}
