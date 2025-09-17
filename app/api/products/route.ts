import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or, sum } from 'drizzle-orm';

import { db } from '@/lib/db';
import { PRODUCT_CATEGORY } from '@/lib/db/enum';
import {
  brands,
  machineTypes,
  ProductQueryParams,
  products,
  unitOfMeasures,
  warehouseStocks,
  warehouses,
} from '@/lib/db/schema';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse query parameters
    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const warehouseId = searchParams.get('warehouseId') || undefined;
    const condition = searchParams.get('condition') || undefined;
    const sortBy =
      (searchParams.get('sortBy') as ProductQueryParams['sortBy']) || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Handle special case for getting all products (no pagination)
    const getAllProducts = limit === -1;

    // Build query conditions
    const conditions = [];
    if (category && category !== 'all') {
      conditions.push(eq(products.category, category as PRODUCT_CATEGORY));
    }
    if (brand && brand !== 'all') {
      conditions.push(eq(products.brandId, brand));
    }
    if (warehouseId && warehouseId !== 'all') {
      conditions.push(eq(warehouseStocks.warehouseId, warehouseId));
    }
    if (condition && condition !== 'all') {
      conditions.push(eq(warehouseStocks.condition, condition));
    }
    if (search) {
      conditions.push(
        or(
          like(products.name, `%${search}%`),
          like(products.code, `%${search}%`),
          like(products.description, `%${search}%`),
          like(products.machineModel, `%${search}%`),
          like(products.partNumber, `%${search}%`),
          like(products.serialNumber, `%${search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = desc(products.createdAt); // Default newest first
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc':
          orderByClause = asc(products.name);
          break;
        case 'name-desc':
          orderByClause = desc(products.name);
          break;
        case 'code-asc':
          orderByClause = asc(products.code);
          break;
        case 'code-desc':
          orderByClause = desc(products.code);
          break;
        case 'price-asc':
          orderByClause = asc(products.price);
          break;
        case 'price-desc':
          orderByClause = desc(products.price);
          break;
        case 'category-asc':
          orderByClause = asc(products.category);
          break;
        case 'category-desc':
          orderByClause = desc(products.category);
          break;
        case 'created-asc':
          orderByClause = asc(products.createdAt);
          break;
        case 'created-desc':
          orderByClause = desc(products.createdAt);
          break;
        default:
          orderByClause = desc(products.createdAt);
      }
    }

    // Fetch products with warehouse inventory data
    const query = db
      .select({
        id: products.id,
        name: products.name,
        code: products.code,
        description: products.description,
        category: products.category,
        brandId: products.brandId,
        brandName: brands.name,
        machineTypeId: products.machineTypeId,
        machineTypeName: machineTypes.name,
        unitOfMeasureId: products.unitOfMeasureId,
        unitOfMeasureName: unitOfMeasures.name,
        unitOfMeasureAbbreviation: unitOfMeasures.abbreviation,
        partNumber: products.partNumber,
        machineModel: products.machineModel,
        engineNumber: products.engineNumber,
        batchOrLotNumber: products.batchOrLotNumber,
        serialNumber: products.serialNumber,
        additionalSpecs: products.additionalSpecs,
        price: products.price,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
        // Warehouse inventory data
        warehouseStockId: warehouseStocks.id,
        warehouseId: warehouseStocks.warehouseId,
        warehouseName: warehouses.name,
        quantity: warehouseStocks.quantity,
        condition: warehouseStocks.condition,
        stockCreatedAt: warehouseStocks.createdAt,
        stockUpdatedAt: warehouseStocks.updatedAt,
      })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(machineTypes, eq(products.machineTypeId, machineTypes.id))
      .leftJoin(unitOfMeasures, eq(products.unitOfMeasureId, unitOfMeasures.id))
      .leftJoin(warehouseStocks, eq(products.id, warehouseStocks.productId))
      .leftJoin(warehouses, eq(warehouseStocks.warehouseId, warehouses.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause);

    // Apply pagination only if not getting all products
    if (!getAllProducts) {
      query.limit(limit).offset(offset);
    }

    const rawData = await query;

    // Transform data to flatten product-warehouse combinations
    const productsData = rawData.map((row) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description,
      category: row.category,
      brandId: row.brandId,
      brandName: row.brandName,
      machineTypeId: row.machineTypeId,
      machineTypeName: row.machineTypeName,
      unitOfMeasureId: row.unitOfMeasureId,
      unitOfMeasureName: row.unitOfMeasureName,
      unitOfMeasureAbbreviation: row.unitOfMeasureAbbreviation,
      partNumber: row.partNumber,
      machineModel: row.machineModel,
      engineNumber: row.engineNumber,
      batchOrLotNumber: row.batchOrLotNumber,
      serialNumber: row.serialNumber,
      additionalSpecs: row.additionalSpecs,
      price: row.price,
      isActive: row.isActive,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      // Warehouse stock data for this specific product-warehouse combination
      warehouseStockId: row.warehouseStockId,
      warehouseId: row.warehouseId,
      warehouseName: row.warehouseName || 'No Warehouse',
      quantity: row.quantity || 0,
      condition: row.condition || 'unknown',
      stockCreatedAt: row.stockCreatedAt,
      stockUpdatedAt: row.stockUpdatedAt,
    }));

    // Get total count for pagination (count all product-warehouse combinations)
    const totalCountQuery = db
      .select({ count: products.id })
      .from(products)
      .leftJoin(brands, eq(products.brandId, brands.id))
      .leftJoin(machineTypes, eq(products.machineTypeId, machineTypes.id))
      .leftJoin(unitOfMeasures, eq(products.unitOfMeasureId, unitOfMeasures.id))
      .leftJoin(warehouseStocks, eq(products.id, warehouseStocks.productId))
      .leftJoin(warehouses, eq(warehouseStocks.warehouseId, warehouses.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    const totalCountResult = await totalCountQuery;
    const totalCount = totalCountResult.length;

    return NextResponse.json({
      data: productsData,
      pagination: getAllProducts
        ? {
            page: 1,
            limit: -1,
            total: productsData.length,
            totalPages: 1,
          }
        : {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
          },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // Products can only be created through imports workflow
  return NextResponse.json(
    {
      error:
        'Product creation not allowed. Products must be created through the imports workflow.',
      redirectTo: '/imports/new',
    },
    { status: 403 },
  );
}
