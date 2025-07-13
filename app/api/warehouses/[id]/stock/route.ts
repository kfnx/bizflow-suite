import { NextRequest, NextResponse } from 'next/server';

import { requirePermission } from '@/lib/auth/authorization';
import { getWarehouseStockSummary } from '@/lib/utils/stock-calculations';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'warehouses:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;
    const { searchParams } = request.nextUrl;

    // Optional filtering
    const includeZeroStock = searchParams.get('includeZeroStock') === 'true';
    const sortBy = searchParams.get('sortBy') || 'quantity-desc';

    const stockSummary = await getWarehouseStockSummary(id);

    // Filter and sort products
    let products = stockSummary.products;

    if (!includeZeroStock) {
      products = products.filter((product) => product.quantity > 0);
    }

    // Sort products based on sortBy parameter
    switch (sortBy) {
      case 'quantity-asc':
        products.sort((a, b) => a.quantity - b.quantity);
        break;
      case 'quantity-desc':
        products.sort((a, b) => b.quantity - a.quantity);
        break;
      case 'name-asc':
        products.sort((a, b) =>
          (a.productName || '').localeCompare(b.productName || ''),
        );
        break;
      case 'name-desc':
        products.sort((a, b) =>
          (b.productName || '').localeCompare(a.productName || ''),
        );
        break;
      case 'code-asc':
        products.sort((a, b) =>
          (a.productCode || '').localeCompare(b.productCode || ''),
        );
        break;
      case 'code-desc':
        products.sort((a, b) =>
          (b.productCode || '').localeCompare(a.productCode || ''),
        );
        break;
      default:
        products.sort((a, b) => b.quantity - a.quantity);
    }

    const result = {
      ...stockSummary,
      products,
      totalProducts: products.length,
      totalQuantity: products.reduce(
        (sum, product) => sum + product.quantity,
        0,
      ),
    };

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error fetching warehouse stock:', error);
    return NextResponse.json(
      { error: 'Failed to fetch warehouse stock' },
      { status: 500 },
    );
  }
}
