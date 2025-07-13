import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import {
  brands,
  machineTypes,
  products,
  suppliers,
  unitOfMeasures,
  warehouses,
} from '@/lib/db/schema';

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

    // Fetch product with related data
    const productData = await db
      .select({
        id: products.id,
        description: products.description,
        category: products.category,
        machineTypeId: products.machineTypeId,
        machineTypeName: machineTypes.name,
        unitOfMeasureId: products.unitOfMeasureId,
        unitOfMeasureName: unitOfMeasures.name,
        unitOfMeasureAbbreviation: unitOfMeasures.abbreviation,
        brandId: products.brandId,
        brandName: brands.name,
        modelOrPartNumber: products.modelOrPartNumber,
        machineNumber: products.machineNumber,
        engineNumber: products.engineNumber,
        name: products.name,
        batchOrLotNumber: products.batchOrLotNumber,
        serialNumber: products.serialNumber,
        model: products.model,
        year: products.year,
        condition: products.condition,
        status: products.status,
        price: products.price,
        engineModel: products.engineModel,
        enginePower: products.enginePower,
        operatingWeight: products.operatingWeight,
        warehouseId: products.warehouseId,
        warehouseName: warehouses.name,
        supplierId: products.supplierId,
        supplierName: suppliers.name,
        supplierCode: suppliers.code,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(machineTypes, eq(products.machineTypeId, machineTypes.id))
      .leftJoin(unitOfMeasures, eq(products.unitOfMeasureId, unitOfMeasures.id))
      .leftJoin(warehouses, eq(products.warehouseId, warehouses.id))
      .where(eq(products.id, id))
      .limit(1);

    if (productData.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ data: productData[0] });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  // Products can only be modified through imports workflow
  return NextResponse.json(
    {
      error:
        'Product modification not allowed. Products must be modified through the imports workflow.',
      redirectTo: '/imports',
    },
    { status: 403 },
  );
}

export async function DELETE(request: NextRequest) {
  // Products cannot be deleted directly
  return NextResponse.json(
    {
      error:
        'Product deletion not allowed. Products are managed through the imports workflow.',
      redirectTo: '/imports',
    },
    { status: 403 },
  );
}
