import { NextResponse } from 'next/server';

import { generateNextInvoiceNumber } from '@/lib/utils/invoice-number';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const invoiceNumber = await generateNextInvoiceNumber();

    return NextResponse.json({
      data: {
        invoiceNumber,
      },
    });
  } catch (error) {
    console.error('Error generating invoice number:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice number' },
      { status: 500 },
    );
  }
}
