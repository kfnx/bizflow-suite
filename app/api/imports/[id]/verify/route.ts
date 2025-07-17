import { NextRequest, NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { IMPORT_STATUS } from '@/lib/db/enum';
import {
  importItems,
  imports,
  InsertProduct,
  products,
  stockMovements,
  suppliers,
  users,
  warehouses,
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

    // Check if import exists and is in pending status
    const existingImport = await db
      .select({
        id: imports.id,
        status: imports.status,
        warehouseId: imports.warehouseId,
        invoiceNumber: imports.invoiceNumber,
        supplierId: imports.supplierId,
        exchangeRateRMBtoIDR: imports.exchangeRateRMBtoIDR,
      })
      .from(imports)
      .where(eq(imports.id, id))
      .limit(1);

    if (existingImport.length === 0) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    const importRecord = existingImport[0];

    if (importRecord.status !== IMPORT_STATUS.PENDING) {
      return NextResponse.json(
        { error: 'Import is not in pending status and cannot be verified' },
        { status: 400 },
      );
    }

    // Verify import and create stock movements in a transaction
    await db.transaction(async (tx) => {
      // Update import status to verified
      const verifiedBy = session.user.id;
      const verifiedAt = new Date();

      await tx
        .update(imports)
        .set({
          status: IMPORT_STATUS.VERIFIED,
          verifiedBy,
          verifiedAt,
        })
        .where(eq(imports.id, id));

      // Get all import items for this import with complete product data
      const items = await tx
        .select()
        .from(importItems)
        .where(eq(importItems.importId, id));

      // Process each item: create/update products and stock movements
      for (const item of items) {
        let productId = item.productId;

        if (!productId) {
          // Check for existing product by machineNumber (for serialized items)
          if (item.category === 'serialized' && item.machineNumber) {
            const existingProduct = await tx
              .select({ id: products.id })
              .from(products)
              .where(eq(products.machineNumber, item.machineNumber))
              .limit(1);

            if (existingProduct.length > 0) {
              productId = existingProduct[0].id;

              // Update existing product with new data
              await tx
                .update(products)
                .set({
                  name: item.name,
                  description: item.description,
                  category: item.category,
                  brandId: item.brandId,
                  condition: item.condition,
                  year: item.year,
                  machineTypeId: item.machineTypeId,
                  unitOfMeasureId: item.unitOfMeasureId,
                  modelOrPartNumber: item.modelOrPartNumber,
                  engineNumber: item.engineNumber,
                  serialNumber: item.serialNumber,
                  model: item.model,
                  engineModel: item.engineModel,
                  enginePower: item.enginePower,
                  operatingWeight: item.operatingWeight,
                  batchOrLotNumber: item.batchOrLotNumber,
                  supplierId: importRecord.supplierId,
                  warehouseId: importRecord.warehouseId,
                  price: (
                    parseFloat(item.priceRMB) *
                    parseFloat(String(importRecord.exchangeRateRMBtoIDR))
                  ).toFixed(2),
                  updatedAt: new Date(),
                })
                .where(eq(products.id, productId));
            }
          }

          // Create new product if no existing product found
          if (!productId) {
            // Generate product code
            const productCode =
              item.machineNumber ||
              item.modelOrPartNumber ||
              item.name ||
              `IMPORT-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
            const productData: InsertProduct = {
              code: productCode,
              name: item.name,
              description: item.description,
              category: item.category,
              brandId: item.brandId,
              condition: item.condition,
              year: item.year,
              machineTypeId: item.machineTypeId,
              unitOfMeasureId: item.unitOfMeasureId,
              modelOrPartNumber: item.modelOrPartNumber,
              machineNumber: item.machineNumber,
              engineNumber: item.engineNumber,
              serialNumber: item.serialNumber,
              model: item.model,
              engineModel: item.engineModel,
              enginePower: item.enginePower,
              operatingWeight: item.operatingWeight,
              batchOrLotNumber: item.batchOrLotNumber,
              supplierId: importRecord.supplierId,
              warehouseId: importRecord.warehouseId,
              price: (
                parseFloat(item.priceRMB) *
                parseFloat(String(importRecord.exchangeRateRMBtoIDR))
              ).toFixed(2),
              importNotes: item.notes,
              isActive: true,
            };

            await tx.insert(products).values(productData);

            const newProduct = await tx
              .select({ id: products.id })
              .from(products)
              .where(eq(products.code, productCode))
              .limit(1);

            productId = newProduct[0].id;

            // Update import item with created product ID
            await tx
              .update(importItems)
              .set({ productId })
              .where(eq(importItems.id, item.id));
          }
        }

        // Create stock movement for the import
        await tx.insert(stockMovements).values({
          warehouseIdFrom: null, // null because it's a new import
          warehouseIdTo: importRecord.warehouseId,
          productId: productId!,
          quantity: item.quantity,
          movementType: 'in',
          notes: `Import verified from ${importRecord.invoiceNumber}`,
        });
      }
    });

    // Fetch updated import with verification details
    const verifiedImport = await db
      .select({
        id: imports.id,
        supplierId: imports.supplierId,
        supplierName: suppliers.name,
        warehouseId: imports.warehouseId,
        warehouseName: warehouses.name,
        importDate: imports.importDate,
        invoiceNumber: imports.invoiceNumber,
        invoiceDate: imports.invoiceDate,
        exchangeRateRMBtoIDR: imports.exchangeRateRMBtoIDR,

        total: imports.total,
        status: imports.status,
        notes: imports.notes,
        createdBy: imports.createdBy,
        verifiedBy: imports.verifiedBy,
        verifiedAt: imports.verifiedAt,
        verifiedByUser: users.firstName,
        createdAt: imports.createdAt,
        updatedAt: imports.updatedAt,
      })
      .from(imports)
      .leftJoin(suppliers, eq(imports.supplierId, suppliers.id))
      .leftJoin(warehouses, eq(imports.warehouseId, warehouses.id))
      .leftJoin(users, eq(imports.verifiedBy, users.id))
      .where(eq(imports.id, id))
      .limit(1);

    return NextResponse.json({
      message:
        'Import verified successfully. Stock movements have been created.',
      data: verifiedImport[0],
    });
  } catch (error) {
    console.error('Error verifying import:', error);
    return NextResponse.json(
      { error: 'Failed to verify import' },
      { status: 500 },
    );
  }
}

// GET method to check verification status
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'imports:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;

    // Get import verification details
    const importVerification = await db
      .select({
        id: imports.id,
        status: imports.status,
        verifiedBy: imports.verifiedBy,
        verifiedAt: imports.verifiedAt,
        verifiedByUser: users.firstName,
        canVerify: imports.status, // Will be processed below
      })
      .from(imports)
      .leftJoin(users, eq(imports.verifiedBy, users.id))
      .where(eq(imports.id, id))
      .limit(1);

    if (importVerification.length === 0) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    const verification = importVerification[0];

    return NextResponse.json({
      data: {
        ...verification,
        canVerify: verification.status === 'pending',
        isVerified: verification.status === 'verified',
      },
    });
  } catch (error) {
    console.error('Error fetching import verification status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification status' },
      { status: 500 },
    );
  }
}
