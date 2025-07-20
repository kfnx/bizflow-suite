import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { PRODUCT_CATEGORY } from '@/lib/db/enum';
import {
  brands,
  importItems,
  imports,
  InsertImportItem,
  machineTypes,
  products,
  suppliers,
  unitOfMeasures,
  users,
  warehouses,
} from '@/lib/db/schema';
import { updateImportRequestSchema } from '@/lib/validations/import';

export const dynamic = 'force-dynamic';

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

    // Fetch import with related data
    const importData = await db
      .select({
        id: imports.id,
        supplierId: imports.supplierId,
        supplierName: suppliers.name,
        supplierCode: suppliers.code,
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
        createdByUser: users.firstName,
        verifiedBy: imports.verifiedBy,
        verifiedAt: imports.verifiedAt,
        createdAt: imports.createdAt,
        updatedAt: imports.updatedAt,
      })
      .from(imports)
      .leftJoin(suppliers, eq(imports.supplierId, suppliers.id))
      .leftJoin(warehouses, eq(imports.warehouseId, warehouses.id))
      .leftJoin(users, eq(imports.createdBy, users.id))
      .where(eq(imports.id, id))
      .limit(1);

    if (importData.length === 0) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    // Fetch import items with product details
    const itemsData = await db
      .select({
        id: importItems.id,
        importId: importItems.importId,
        productId: importItems.productId,
        priceRMB: importItems.priceRMB,
        quantity: importItems.quantity,
        total: importItems.total,
        notes: importItems.notes,
        // Product fields from linked product
        name: importItems.name,
        model: importItems.model,
        category: importItems.category,
        description: importItems.description,
        brandId: importItems.brandId,
        condition: importItems.condition,
        year: importItems.year,
        machineTypeId: importItems.machineTypeId,
        unitOfMeasureId: importItems.unitOfMeasureId,
        modelOrPartNumber: importItems.modelOrPartNumber,
        machineNumber: importItems.machineNumber,
        engineNumber: importItems.engineNumber,
        serialNumber: importItems.serialNumber,
        engineModel: importItems.engineModel,
        enginePower: importItems.enginePower,
        operatingWeight: importItems.operatingWeight,
        batchOrLotNumber: importItems.batchOrLotNumber,
        modelNumber: importItems.modelNumber,
        createdAt: importItems.createdAt,
      })
      .from(importItems)
      .leftJoin(machineTypes, eq(importItems.machineTypeId, machineTypes.id))
      .leftJoin(
        unitOfMeasures,
        eq(importItems.unitOfMeasureId, unitOfMeasures.id),
      )
      .leftJoin(brands, eq(importItems.brandId, brands.id))
      .where(eq(importItems.importId, id));

    const result = {
      ...importData[0],
      items: itemsData,
    };

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Error fetching import:', error);
    return NextResponse.json(
      { error: 'Failed to fetch import' },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'imports:update');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;
    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = updateImportRequestSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const validatedData = validationResult.data;

    // Check if import exists
    const existingImport = await db
      .select({ id: imports.id })
      .from(imports)
      .where(eq(imports.id, id))
      .limit(1);

    if (existingImport.length === 0) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    // Update import and items in a transaction
    await db.transaction(async (tx) => {
      // Update import record if any import-level fields are provided
      const importUpdateData: any = {};
      if (validatedData.supplierId)
        importUpdateData.supplierId = validatedData.supplierId;
      if (validatedData.warehouseId)
        importUpdateData.warehouseId = validatedData.warehouseId;
      if (validatedData.importDate)
        importUpdateData.importDate = validatedData.importDate;
      if (validatedData.invoiceNumber)
        importUpdateData.invoiceNumber = validatedData.invoiceNumber;
      if (validatedData.invoiceDate)
        importUpdateData.invoiceDate = validatedData.invoiceDate;
      if (validatedData.exchangeRateRMBtoIDR)
        importUpdateData.exchangeRateRMBtoIDR =
          validatedData.exchangeRateRMBtoIDR;
      if (validatedData.status) importUpdateData.status = validatedData.status;
      if (validatedData.notes !== undefined)
        importUpdateData.notes = validatedData.notes;

      if (Object.keys(importUpdateData).length > 0) {
        await tx
          .update(imports)
          .set(importUpdateData)
          .where(eq(imports.id, id));
      }

      // Update items if provided
      if (validatedData.items) {
        // For simplicity, we'll replace all items
        // In a production system, you might want to handle individual item updates
        await tx.delete(importItems).where(eq(importItems.importId, id));

        // Calculate new totals
        let subtotal = 0;
        for (const item of validatedData.items) {
          const itemTotal = item.quantity * parseFloat(item.priceRMB);
          subtotal += itemTotal;
        }

        const exchangeRate = parseFloat(
          validatedData.exchangeRateRMBtoIDR || '0',
        );
        const totalIDR = subtotal * exchangeRate;

        // Update totals
        await tx
          .update(imports)
          .set({
            total: totalIDR.toFixed(2),
          })
          .where(eq(imports.id, id));

        // Insert new items
        for (const item of validatedData.items) {
          let productId = item.productId;

          // If no productId provided and this is a new item, create product
          if (!productId && !item.id) {
            // Create new product logic here
            // For now, we'll skip this complex logic
          }

          const itemTotal = item.quantity * parseFloat(item.priceRMB);
          const importItemData: InsertImportItem = {
            importId: id,
            productId,
            priceRMB: item.priceRMB,
            quantity: item.quantity,
            total: itemTotal.toFixed(2),
            name: item.name,
            description: item.description,
            category: item.category as PRODUCT_CATEGORY,
            machineTypeId: item.machineTypeId,
            unitOfMeasureId: item.unitOfMeasureId,
            brandId: item.brandId,
            modelOrPartNumber: item.modelOrPartNumber,
            machineNumber: item.machineNumber,
            engineNumber: item.engineNumber,
            batchOrLotNumber: item.batchOrLotNumber,
            serialNumber: item.serialNumber,
            model: item.model,
            year: item.year,
            condition: item.condition,
            engineModel: item.engineModel,
            enginePower: item.enginePower,
            operatingWeight: item.operatingWeight,
            notes: item.notes,
          };

          await tx.insert(importItems).values(importItemData);
        }
      }
    });

    // Fetch updated import
    const updatedImport = await db
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
        createdByUser: users.firstName,
        verifiedBy: imports.verifiedBy,
        verifiedAt: imports.verifiedAt,
        createdAt: imports.createdAt,
        updatedAt: imports.updatedAt,
      })
      .from(imports)
      .leftJoin(suppliers, eq(imports.supplierId, suppliers.id))
      .leftJoin(warehouses, eq(imports.warehouseId, warehouses.id))
      .leftJoin(users, eq(imports.createdBy, users.id))
      .where(eq(imports.id, id))
      .limit(1);

    return NextResponse.json({
      message: 'Import updated successfully',
      data: updatedImport[0],
    });
  } catch (error) {
    console.error('Error updating import:', error);
    return NextResponse.json(
      { error: 'Failed to update import' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const session = await requirePermission(request, 'imports:delete');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { id } = params;

    // Check if import exists
    const existingImport = await db
      .select({ id: imports.id })
      .from(imports)
      .where(eq(imports.id, id))
      .limit(1);

    if (existingImport.length === 0) {
      return NextResponse.json({ error: 'Import not found' }, { status: 404 });
    }

    // Delete import and related items in transaction
    await db.transaction(async (tx) => {
      // Delete import items first (foreign key constraint)
      await tx.delete(importItems).where(eq(importItems.importId, id));

      // Delete import
      await tx.delete(imports).where(eq(imports.id, id));
    });

    return NextResponse.json({
      message: 'Import deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting import:', error);
    return NextResponse.json(
      { error: 'Failed to delete import' },
      { status: 500 },
    );
  }
}
