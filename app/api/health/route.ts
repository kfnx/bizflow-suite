import { NextResponse } from 'next/server';

import { getDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/health - Health check endpoint
export async function GET() {
  try {
    const db = getDB();

    // Test database connection by running a simple query
    await db.execute('SELECT 1 as test');

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
