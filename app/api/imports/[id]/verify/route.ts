import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { IMPORT_STATUS } from '@/lib/db/enum';
import {
  importItems,
  imports,
  InsertProduct,
  products,
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

        const insertData: InsertProduct = {
          name: item.name,
          code: item.serialNumber, // Use serial number as code for serialized products
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
        await db.insert(products).values(insertData);
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
    console.error('Error fetching pending import verification status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification status' },
      { status: 500 },
    );
  }
}
