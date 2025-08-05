import { NextRequest, NextResponse } from 'next/server';
import { desc, eq, like } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { IMPORT_STATUS } from '@/lib/db/enum';
import {
  importItems,
  imports,
  InsertProduct,
  products,
  transferItems,
  transfers,
  users,
} from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'imports:verify');

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

    // Keep track of created products for transfer creation
    const createdProducts: {
      productId: string;
      quantity: number;
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
          modelNumber: item.modelNumber,
          serialNumber: item.serialNumber,
          engineNumber: item.engineNumber,
          additionalSpecs: item.additionalSpecs,
          condition: item.condition,
          status: 'in_stock',
          price: (
            Number(item.priceRMB) * Number(importData[0].exchangeRateRMBtoIDR)
          ).toFixed(2),
          warehouseId: importData[0].warehouseId,
          supplierId: importData[0].supplierId,
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
          condition: item.condition,
          status: 'in_stock',
          price: (
            Number(item.priceRMB) * Number(importData[0].exchangeRateRMBtoIDR)
          ).toFixed(2),
          warehouseId: importData[0].warehouseId,
          supplierId: importData[0].supplierId,
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
            notes: `Import from ${importData[0].id} - ${item.partNumber}`,
          });
        }
      }
    }

    // Create transfer IN record for the imported products
    if (createdProducts.length > 0) {
      // Generate transfer number (TRF/YYYY/MM/XXX format)
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');

      // Get count of transfers this month to generate sequence number
      const monthTransfers = await db
        .select({ count: transfers.id })
        .from(transfers)
        .where(like(transfers.transferNumber, `TRF/${year}/${month}/%`));

      const sequence = (monthTransfers.length + 1).toString().padStart(3, '0');
      const transferNumber = `TRF/${year}/${month}/${sequence}`;

      // Create transfer record
      const newTransfer = {
        transferNumber,
        warehouseIdFrom: null, // Import from external source
        warehouseIdTo: importData[0].warehouseId,
        movementType: 'in' as const,
        status: 'completed',
        transferDate: new Date(),
        invoiceId: importData[0].invoiceNumber || null,
        notes: `Auto-generated transfer for import verification: ${importData[0].id}`,
        createdBy: session.user.id,
        approvedBy: session.user.id,
        approvedAt: new Date(),
        completedAt: new Date(),
      };

      await db.insert(transfers).values(newTransfer);

      // Get the created transfer to obtain the auto-generated ID
      const createdTransferRecord = await db
        .select({ id: transfers.id })
        .from(transfers)
        .where(eq(transfers.transferNumber, transferNumber))
        .orderBy(desc(transfers.createdAt))
        .limit(1);

      if (createdTransferRecord.length > 0) {
        const transferId = createdTransferRecord[0].id;

        // Create transfer items
        const transferItemsData = createdProducts.map((product) => ({
          transferId,
          productId: product.productId,
          quantity: product.quantity,
          quantityTransferred: product.quantity, // Mark as fully transferred since import is complete
          notes: product.notes,
        }));

        await db.insert(transferItems).values(transferItemsData);
      }
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
