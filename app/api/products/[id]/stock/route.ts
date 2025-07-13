import { NextRequest, NextResponse } from 'next/server';

import { requirePermission } from '@/lib/auth/authorization';
import { getProductStockSummary } from '@/lib/utils/stock-calculations';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'products:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;
    const { searchParams } = request.nextUrl;

    // Optional filtering
    const includeZeroStock = searchParams.get('includeZeroStock') === 'true';

    const stockSummary = await getProductStockSummary(id);

    if (!stockSummary) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Filter warehouses with zero stock if requested
    let warehouseStocks = stockSummary.warehouseStocks;

    if (!includeZeroStock) {
      warehouseStocks = warehouseStocks.filter((stock) => stock.quantity > 0);
    }

    const result = {
      ...stockSummary,
      warehouseStocks,
      totalQuantity: warehouseStocks.reduce(
        (sum, stock) => sum + stock.quantity,
        0,
      ),
    };

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error fetching product stock:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product stock' },
      { status: 500 },
    );
  }
}
