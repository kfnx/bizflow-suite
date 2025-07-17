import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';

import { requirePermission } from '@/lib/auth/authorization';
import { db } from '@/lib/db';
import { IMPORT_STATUS, PRODUCT_CATEGORY } from '@/lib/db/enum';
import {
  importItems,
  imports,
  InsertImportItem,
  products,
  suppliers,
  users,
  warehouses,
} from '@/lib/db/schema';
import {
  createImportRequestSchema,
  importQueryParamsSchema,
} from '@/lib/validations/import';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const session = await requirePermission(request, 'imports:read');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const { searchParams } = request.nextUrl;

    // Parse and validate query parameters
    const queryParams = {
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      supplierId: searchParams.get('supplierId') || undefined,
      warehouseId: searchParams.get('warehouseId') || undefined,
      productId: searchParams.get('productId') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '10',
    };

    const validationResult = importQueryParamsSchema.safeParse(queryParams);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validationResult.error.errors,
        },
        { status: 400 },
      );
    }

    const validatedParams = validationResult.data;
    const page = validatedParams.page;
    const limit = validatedParams.limit;
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];

    if (validatedParams.status && validatedParams.status !== 'all') {
      conditions.push(
        eq(imports.status, validatedParams.status as IMPORT_STATUS),
      );
    }

    if (validatedParams.supplierId) {
      conditions.push(eq(imports.supplierId, validatedParams.supplierId));
    }

    if (validatedParams.warehouseId) {
      conditions.push(eq(imports.warehouseId, validatedParams.warehouseId));
    }

    if (validatedParams.dateFrom) {
      conditions.push(
        sql`${imports.importDate} >= ${validatedParams.dateFrom}`,
      );
    }

    if (validatedParams.dateTo) {
      conditions.push(sql`${imports.importDate} <= ${validatedParams.dateTo}`);
    }

    if (validatedParams.search) {
      conditions.push(
        or(
          like(imports.invoiceNumber, `%${validatedParams.search}%`),
          like(suppliers.name, `%${validatedParams.search}%`),
          like(warehouses.name, `%${validatedParams.search}%`),
          like(imports.notes, `%${validatedParams.search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = desc(imports.createdAt);
    if (validatedParams.sortBy) {
      switch (validatedParams.sortBy) {
        case 'date-asc':
          orderByClause = asc(imports.importDate);
          break;
        case 'date-desc':
          orderByClause = desc(imports.importDate);
          break;
        case 'status-asc':
          orderByClause = asc(imports.status);
          break;
        case 'status-desc':
          orderByClause = desc(imports.status);
          break;
        case 'supplier-asc':
          orderByClause = asc(suppliers.name);
          break;
        case 'supplier-desc':
          orderByClause = desc(suppliers.name);
          break;
        case 'total-asc':
          orderByClause = asc(imports.total);
          break;
        case 'total-desc':
          orderByClause = desc(imports.total);
          break;
        default:
          orderByClause = desc(imports.createdAt);
      }
    }

    // Fetch imports with related data
    const importsData = await db
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
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCountResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(imports)
      .leftJoin(suppliers, eq(imports.supplierId, suppliers.id))
      .leftJoin(warehouses, eq(imports.warehouseId, warehouses.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCount = totalCountResult[0]?.count || 0;

    return NextResponse.json({
      data: importsData,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching imports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch imports' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await requirePermission(request, 'imports:create');

  if (session instanceof NextResponse) {
    return session;
  }

  try {
    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = createImportRequestSchema.safeParse(body);

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

    // Calculate totals from items
    let subtotal = 0;
    validatedData.items.forEach((item) => {
      const itemTotal = item.quantity * parseFloat(item.priceRMB);
      subtotal += itemTotal;
    });

    const exchangeRate = parseFloat(validatedData.exchangeRateRMBtoIDR);
    const totalIDR = subtotal * exchangeRate;

    // Create import and items in a transaction
    const result = await db.transaction(async (tx) => {
      const createdBy = session.user.id;

      // Create import record
      const importData = {
        supplierId: validatedData.supplierId,
        warehouseId: validatedData.warehouseId,
        importDate: validatedData.importDate,
        invoiceNumber: validatedData.invoiceNumber,
        invoiceDate: validatedData.invoiceDate,
        exchangeRateRMBtoIDR: validatedData.exchangeRateRMBtoIDR,
        subtotal: subtotal.toFixed(2),
        total: totalIDR.toFixed(2),
        status: IMPORT_STATUS.PENDING,
        notes: validatedData.notes,
        createdBy,
      };

      const insertedImport = await tx.insert(imports).values(importData);

      // Get the generated import ID
      const createdImportResult = await tx
        .select({ id: imports.id })
        .from(imports)
        .where(eq(imports.createdBy, createdBy))
        .orderBy(desc(imports.createdAt))
        .limit(1);

      const importId = createdImportResult[0].id;

      // Create import items with complete product data (no products created yet)
      // new imports -> import_item (pending) -> verify -> insert import_item into products
      for (const item of validatedData.items) {
        const importItemData: InsertImportItem = {
          importId,
          productId: item.productId || null, // Only set if linking to existing product
          priceRMB: item.priceRMB,
          quantity: item.quantity,
          notes: item.notes,

          // Product creation data - store complete product info for verification
          category: item.category as PRODUCT_CATEGORY,
          name: item.name,
          description: item.description,
          brandId: item.brandId,
          condition: item.condition,
          year: item.year,

          // Category-specific fields
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
          modelNumber: item.modelOrPartNumber,
        };

        await tx.insert(importItems).values(importItemData);

        // Note: Stock movements will be created only when import is verified
        // This allows import-manager to review and verify before affecting inventory
      }

      return { importId };
    });

    // Fetch the created import with related data
    const createdImport = await db
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
        createdAt: imports.createdAt,
        updatedAt: imports.updatedAt,
      })
      .from(imports)
      .leftJoin(suppliers, eq(imports.supplierId, suppliers.id))
      .leftJoin(warehouses, eq(imports.warehouseId, warehouses.id))
      .leftJoin(users, eq(imports.createdBy, users.id))
      .where(eq(imports.id, result.importId))
      .limit(1);

    return NextResponse.json(
      {
        message: 'Import created successfully',
        data: createdImport[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating import:', error);

    return NextResponse.json(
      { error: 'Failed to create import' },
      { status: 500 },
    );
  }
}
