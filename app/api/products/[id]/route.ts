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
        code: products.code,
        description: products.description,
        category: products.category,
        machineTypeId: products.machineTypeId,
        machineTypeName: machineTypes.name,
        unitOfMeasureId: products.unitOfMeasureId,
        unitOfMeasureName: unitOfMeasures.name,
        unitOfMeasureAbbreviation: unitOfMeasures.abbreviation,
        brandId: products.brandId,
        brandName: brands.name,
        partNumber: products.partNumber,
        modelNumber: products.modelNumber,
        engineNumber: products.engineNumber,
        quantity: products.quantity,
        name: products.name,
        batchOrLotNumber: products.batchOrLotNumber,
        serialNumber: products.serialNumber,
        additionalSpecs: products.additionalSpecs,
        condition: products.condition,
        status: products.status,
        price: products.price,
        warehouseId: products.warehouseId,
        warehouseName: warehouses.name,
        supplierId: products.supplierId,
        supplierName: suppliers.name,
        supplierCode: suppliers.code,
        importNotes: products.importNotes,
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'products:update');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;
    const body = await request.json();

    // Update product
    await db
      .update(products)
      .set({
        name: body.name,
        code: body.code,
        description: body.description,
        category: body.category,
        brandId: body.brandId,
        machineTypeId: body.machineTypeId,
        unitOfMeasureId: body.unitOfMeasureId,
        modelNumber: body.modelNumber,
        engineNumber: body.engineNumber,
        serialNumber: body.serialNumber,
        additionalSpecs: body.additionalSpecs,
        partNumber: body.partNumber,
        batchOrLotNumber: body.batchOrLotNumber,
        condition: body.condition,
        status: body.status,
        price: body.price,
        warehouseId: body.warehouseId,
        supplierId: body.supplierId,
        importNotes: body.importNotes,
        isActive: body.isActive,
      })
      .where(eq(products.id, id));

    // Fetch and return the updated product with relations
    const updatedProductData = await db
      .select({
        id: products.id,
        code: products.code,
        description: products.description,
        category: products.category,
        machineTypeId: products.machineTypeId,
        machineTypeName: machineTypes.name,
        unitOfMeasureId: products.unitOfMeasureId,
        unitOfMeasureName: unitOfMeasures.name,
        unitOfMeasureAbbreviation: unitOfMeasures.abbreviation,
        brandId: products.brandId,
        brandName: brands.name,
        partNumber: products.partNumber,
        modelNumber: products.modelNumber,
        engineNumber: products.engineNumber,
        name: products.name,
        batchOrLotNumber: products.batchOrLotNumber,
        serialNumber: products.serialNumber,
        additionalSpecs: products.additionalSpecs,
        condition: products.condition,
        status: products.status,
        price: products.price,
        warehouseId: products.warehouseId,
        warehouseName: warehouses.name,
        supplierId: products.supplierId,
        supplierName: suppliers.name,
        supplierCode: suppliers.code,
        importNotes: products.importNotes,
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

    return NextResponse.json({ data: updatedProductData[0] });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 },
    );
  }
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
