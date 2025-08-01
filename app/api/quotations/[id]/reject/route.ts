import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireAnyRole, requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations } from '@/lib/db/schema';

interface RejectQuotationRequest {
  reason: string;
}

const customerRejectSchema = z.object({
  rejectionReason: z.string().min(1, 'Rejection reason is required'),
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
    const body = await request.json();

    // Check if this is a customer response rejection (has rejectionReason field)
    if ('rejectionReason' in body) {
      // Customer response rejection (sent -> rejected)
      const validatedData = customerRejectSchema.parse(body);

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
          { error: 'Only sent quotations can be rejected' },
          { status: 400 },
        );
      }

      // Update quotation status to rejected with rejection reason
      const status = QUOTATION_STATUS.REJECTED;
      const now = new Date();

      await db
        .update(quotations)
        .set({
          status,
          customerResponseDate: now,
          rejectionReason: validatedData.rejectionReason,
          customerResponseNotes: validatedData.responseNotes,
        })
        .where(eq(quotations.id, id));

      return NextResponse.json({
        message: 'Quotation rejected',
        data: {
          id: quotation.id,
          quotationNumber: quotation.quotationNumber,
          status,
          customerResponseDate: now,
          rejectionReason: validatedData.rejectionReason,
          customerResponseNotes: validatedData.responseNotes,
        },
      });
    } else {
      // Internal approval rejection (submitted -> rejected)
      // Check if user has manager or director role
      const roleCheck = await requireAnyRole(request, ['manager', 'director']);
      if (roleCheck instanceof NextResponse) {
        return roleCheck;
      }

      const validatedData = body as RejectQuotationRequest;

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
        message: 'Quotation rejected',
        data: {
          id: quotation.id,
          quotationNumber: quotation.quotationNumber,
          status,
          reason: validatedData.reason,
        },
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

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
