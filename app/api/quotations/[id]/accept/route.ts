import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth/authorization';
import { getDB } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations } from '@/lib/db/schema';

const acceptQuotationSchema = z.object({
  acceptanceInfo: z.string().min(1, 'Acceptance information is required'),
  responseNotes: z.string().optional().nullable(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requireAuth(request);

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const db = await getDB();
    const { id } = params;

    // Parse request body
    const body = await request.json();
    const validatedData = acceptQuotationSchema.parse(body);

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

    // Check if quotation is in 'sent' status
    if (quotation.status !== QUOTATION_STATUS.SENT) {
      return NextResponse.json(
        { error: 'Only sent quotations can be accepted' },
        { status: 400 },
      );
    }

    // Update quotation status to accepted with acceptance info
    const status = QUOTATION_STATUS.ACCEPTED;
    const now = new Date();

    await db
      .update(quotations)
      .set({
        status,
        customerResponseDate: now,
        customerAcceptanceInfo: validatedData.acceptanceInfo,
        customerResponseNotes: validatedData.responseNotes,
      })
      .where(eq(quotations.id, id));

    return NextResponse.json({
      message: 'Quotation accepted successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        status,
        customerResponseDate: now,
        customerAcceptanceInfo: validatedData.acceptanceInfo,
        customerResponseNotes: validatedData.responseNotes,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    console.error('Error accepting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to accept quotation' },
      { status: 500 },
    );
  }
}
