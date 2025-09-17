import { NextRequest, NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { IMPORT_STATUS } from '@/lib/db/enum';
import {
  importItems,
  imports,
  InsertProduct,
  products,
  users,
  warehouseStocks,
} from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'imports:approve');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;

    // Check if import exists and is pending
    const importData = await db
      .select()
      .from(imports)
      .where(eq(imports.id, id))
      .limit(1);

    if (importData.length === 0) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    if (importData[0].status !== IMPORT_STATUS.PENDING) {
      return NextResponse.json(
        { error: 'Import is not in pending status' },
        { status: 400 },
      );
    }

    // Get import items from database
    const items = await db
      .select()
      .from(importItems)
      .where(eq(importItems.importId, id));

    // Keep track of created products for warehouseStocks creation
    const createdProducts: {
      productId: string;
      quantity: number;
      condition: string;
      notes?: string;
    }[] = [];

    // Process each import item
    for (const item of items) {
      if (item.category === 'serialized') {
        // For serialized products, check for duplicates
        if (!item.serialNumber) {
          return NextResponse.json(
            { error: 'Serial number is required for serialized products' },
            { status: 400 },
          );
        }

        const existingProduct = await db
          .select()
          .from(products)
          .where(eq(products.serialNumber, item.serialNumber))
          .limit(1);

        if (existingProduct.length > 0) {
          return NextResponse.json(
            {
              error: `Product with serial number ${item.serialNumber} already exists`,
            },
            { status: 409 },
          );
        }

        const productData: InsertProduct = {
          name: item.name,
          code: item.serialNumber || item.partNumber || '', // Use serial number as code for serialized products
          description: item.description,
          category: item.category,
          brandId: item.brandId,
          machineTypeId: item.machineTypeId,
          machineModel: item.machineModel,
          serialNumber: item.serialNumber,
          engineNumber: item.engineNumber,
          additionalSpecs: item.additionalSpecs,
          price: (
            Number(item.priceRMB) * Number(importData[0].exchangeRateRMBtoIDR)
          ).toFixed(2),
          isActive: true,
        };
        await db.insert(products).values(productData);

        // Get the created product ID by serial number
        const createdProduct = await db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.serialNumber, item.serialNumber))
          .orderBy(desc(products.createdAt))
          .limit(1);

        if (createdProduct.length > 0) {
          createdProducts.push({
            productId: createdProduct[0].id,
            quantity: 1, // Serialized products are always quantity 1
            condition: item.condition || 'new',
            notes: `Import from ${importData[0].id} - ${item.serialNumber}`,
          });
        }
      } else {
        // For non-serialized/bulk products, check for duplicates by part number
        if (!item.partNumber) {
          return NextResponse.json(
            { error: 'Part number is required for non-serialized products' },
            { status: 400 },
          );
        }

        const existingProduct = await db
          .select()
          .from(products)
          .where(eq(products.partNumber, item.partNumber))
          .limit(1);

        if (existingProduct.length > 0) {
          return NextResponse.json(
            {
              error: `Product with part number ${item.partNumber} already exists`,
            },
            { status: 409 },
          );
        }

        // Create new non-serialized product
        const insertData: InsertProduct = {
          name: item.name,
          code: item.partNumber, // Use part number as code for non-serialized products
          description: item.description,
          category: item.category,
          brandId: item.brandId,
          unitOfMeasureId: item.unitOfMeasureId,
          partNumber: item.partNumber,
          batchOrLotNumber: item.batchOrLotNumber,
          additionalSpecs: item.additionalSpecs,
          price: (
            Number(item.priceRMB) * Number(importData[0].exchangeRateRMBtoIDR)
          ).toFixed(2),
          isActive: true,
        };
        await db.insert(products).values(insertData);

        // Get the created product ID by part number
        const createdProduct = await db
          .select({ id: products.id })
          .from(products)
          .where(eq(products.partNumber, item.partNumber))
          .orderBy(desc(products.createdAt))
          .limit(1);

        if (createdProduct.length > 0) {
          createdProducts.push({
            productId: createdProduct[0].id,
            quantity: item.quantity || 1,
            condition: item.condition || 'new',
            notes: `Import from ${importData[0].id} - ${item.partNumber}`,
          });
        }
      }
    }

    // Create warehouseStocks entries for the imported products
    if (createdProducts.length > 0) {
      const warehouseStockData = createdProducts.map((product) => ({
        warehouseId: importData[0].warehouseId,
        productId: product.productId,
        condition: product.condition,
        quantity: product.quantity,
      }));

      await db.insert(warehouseStocks).values(warehouseStockData);
    }

    // Update import status to verified
    await db
      .update(imports)
      .set({
        status: IMPORT_STATUS.VERIFIED,
        verifiedBy: session.user.id,
        verifiedAt: new Date(),
      })
      .where(eq(imports.id, id));

    return NextResponse.json({
      message: 'Import verified successfully',
    });
  } catch (error) {
    console.error('Error verifying import:', error);
    return NextResponse.json(
      { error: 'Failed to verify import' },
      { status: 500 },
    );
  }
}
