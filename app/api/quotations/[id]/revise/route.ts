import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations } from '@/lib/db/schema';

const reviseQuotationSchema = z.object({
  revisionReason: z.string().min(1, 'Revision reason is required'),
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
    const { id } = params;

    // Parse request body
    const body = await request.json();
    const validatedData = reviseQuotationSchema.parse(body);

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
        { error: 'Only sent quotations can be revised' },
        { status: 400 },
      );
    }

    // Update quotation status to draft (revised) with revision reason
    const status = QUOTATION_STATUS.DRAFT;
    const now = new Date();

    await db
      .update(quotations)
      .set({
        status,
        customerResponseDate: now,
        revisionReason: validatedData.revisionReason,
        customerResponseNotes: validatedData.responseNotes,
      })
      .where(eq(quotations.id, id));

    return NextResponse.json({
      message:
        'Quotation revision requested successfully. The quotation has been returned to draft status for editing.',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        status,
        customerResponseDate: now,
        revisionReason: validatedData.revisionReason,
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

    console.error('Error requesting quotation revision:', error);
    return NextResponse.json(
      { error: 'Failed to request quotation revision' },
      { status: 500 },
    );
  }
}
