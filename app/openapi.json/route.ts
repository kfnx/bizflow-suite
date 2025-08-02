import { NextResponse } from 'next/server';
import { OpenAPIGenerator } from '@/lib/api-docs/openapi-generator';

export const dynamic = 'force-dynamic';

// GET /openapi.json - Serve dynamically generated OpenAPI specification
export async function GET() {
  try {
    const generator = new OpenAPIGenerator();
    const spec = await generator.generateSpec();

    return NextResponse.json(spec);
  } catch (error) {
    console.error('Error generating OpenAPI spec:', error);
    return NextResponse.json(
      { error: 'Failed to generate OpenAPI specification' },
      { status: 500 },
    );
  }
}