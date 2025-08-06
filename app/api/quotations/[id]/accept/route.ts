import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

import { requireAuth } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { QUOTATION_STATUS } from '@/lib/db/enum';
import { quotations, purchaseOrders } from '@/lib/db/schema';
import { uploadFile, validateFileType, validateFileSize } from '@/lib/minio';

const acceptQuotationSchema = z.object({
  approvalType: z.string().min(1, 'Approval type is required'),
  purchaseOrderNumber: z.string().min(1, 'Purchase order number is required'),
  purchaseOrderDate: z.string().min(1, 'Purchase order date is required'),
  document: z.string().optional(),
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

    // Parse form data instead of JSON
    const formData = await request.formData();

    // Extract form fields
    const approvalType = formData.get('approvalType') as string;
    const purchaseOrderNumber = formData.get('purchaseOrderNumber') as string;
    const purchaseOrderDate = formData.get('purchaseOrderDate') as string;
    const responseNotes = formData.get('responseNotes') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!approvalType?.trim()) {
      return NextResponse.json(
        { error: 'Approval type is required' },
        { status: 400 },
      );
    }

    if (!purchaseOrderNumber?.trim()) {
      return NextResponse.json(
        { error: 'Purchase order number is required' },
        { status: 400 },
      );
    }

    if (!purchaseOrderDate?.trim()) {
      return NextResponse.json(
        { error: 'Purchase order date is required' },
        { status: 400 },
      );
    }

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

    // Parse the date string to Date object
    const purchaseOrderDateObj = new Date(purchaseOrderDate);
    if (isNaN(purchaseOrderDateObj.getTime())) {
      return NextResponse.json(
        { error: 'Invalid purchase order date format' },
        { status: 400 },
      );
    }

    // Handle file upload if provided
    let documentUrl: string | null = null;
    if (file && file.size > 0) {
      // Validate file type
      if (!validateFileType(file.name)) {
        return NextResponse.json(
          { error: 'Invalid file type. Allowed types: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF' },
          { status: 400 },
        );
      }

      // Validate file size
      if (!validateFileSize(file.size)) {
        return NextResponse.json(
          { error: 'File size too large. Maximum size: 10MB' },
          { status: 400 },
        );
      }

      // Convert file to buffer and upload to MinIO
      const buffer = Buffer.from(await file.arrayBuffer());
      documentUrl = await uploadFile(buffer, file.name, file.type);
    }

    // Create purchase order
    const [purchaseOrder] = await db
      .insert(purchaseOrders)
      .values({
        quotationId: id,
        number: purchaseOrderNumber.trim(),
        date: purchaseOrderDateObj,
        approvalType: approvalType.trim(),
        document: documentUrl,
        createdBy: session.user.id,
      });

    // Get the created purchase order data
    const [createdPurchaseOrder] = await db
      .select({
        id: purchaseOrders.id,
        number: purchaseOrders.number,
        date: purchaseOrders.date,
        approvalType: purchaseOrders.approvalType,
        document: purchaseOrders.document,
      })
      .from(purchaseOrders)
      .where(eq(purchaseOrders.quotationId, id))
      .limit(1);

    // Update quotation status to accepted
    const status = QUOTATION_STATUS.ACCEPTED;
    const now = new Date();

    await db
      .update(quotations)
      .set({
        status,
        purchaseOrderId: createdPurchaseOrder.id,
        customerResponseDate: now,
        customerResponseNotes: responseNotes?.trim() || null,
      })
      .where(eq(quotations.id, id));

    return NextResponse.json({
      message: 'Quotation accepted successfully',
      data: {
        id: quotation.id,
        quotationNumber: quotation.quotationNumber,
        status,
        customerResponseDate: now,
        customerResponseNotes: responseNotes?.trim() || null,
        purchaseOrder: {
          id: createdPurchaseOrder.id,
          number: createdPurchaseOrder.number,
          date: createdPurchaseOrder.date,
          approvalType: createdPurchaseOrder.approvalType,
          document: createdPurchaseOrder.document,
        },
      },
    });
  } catch (error) {
    console.error('Error accepting quotation:', error);
    return NextResponse.json(
      { error: 'Failed to accept quotation' },
      { status: 500 },
    );
  }
}
