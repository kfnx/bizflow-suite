import { NextResponse } from 'next/server';

// Database imports moved to shared utility

import { generateNextDeliveryNumber } from '@/lib/utils/delivery-number';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const deliveryNumber = await generateNextDeliveryNumber();

    return NextResponse.json({
      data: {
        deliveryNumber,
      },
    });
  } catch (error) {
    console.error('Error generating delivery note number:', error);
    return NextResponse.json(
      { error: 'Failed to generate delivery note number' },
      { status: 500 },
    );
  }
}
