import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * @summary Get test data
 * @description Retrieve test data for demonstration purposes
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = searchParams.get('limit') || '10';
  const page = searchParams.get('page') || '1';

  return NextResponse.json({
    message: 'Test route working',
    params: { limit, page },
    timestamp: new Date().toISOString(),
  });
}

/**
 * @summary Create test data
 * @description Create new test data
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  return NextResponse.json({
    message: 'Test data created',
    data: body,
    id: Math.random().toString(36).substr(2, 9),
  }, { status: 201 });
}