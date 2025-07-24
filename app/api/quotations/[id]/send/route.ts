import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
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

  try {
    const { id } = params;

    // Check if quotation exists
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

    // Check if quotation is in 'approved' status
    if (quotation.status !== QUOTATION_STATUS.APPROVED) {
      return NextResponse.json(
        { error: 'Only approved quotations can be sent' },
        { status: 400 },
      );
    }

    // Update quotation status to sent
    const status = QUOTATION_STATUS.SENT;
    await db.update(quotations).set({ status }).where(eq(quotations.id, id));

    return NextResponse.json({
      message: 'Quotation sent successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        status,
      },
    });
  } catch (error) {
    console.error('Error sending quotation:', error);
    return NextResponse.json(
      { error: 'Failed to send quotation' },
      { status: 500 },
    );
  }
}
