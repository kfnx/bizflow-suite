import { NextRequest, NextResponse } from 'next/server';
import { and, asc, desc, eq, like, or } from 'drizzle-orm';

import { db } from '@/lib/db';
import {
  NewProduct,
  ProductQueryParams,
  products,
  suppliers,
} from '@/lib/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;

    // Parse query parameters
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const category = searchParams.get('category') || undefined;
    const brand = searchParams.get('brand') || undefined;
    const supplierId = searchParams.get('supplierId') || undefined;
    const sortBy =
      (searchParams.get('sortBy') as ProductQueryParams['sortBy']) || undefined;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];
    if (status && status !== 'all') {
      conditions.push(eq(products.status, status));
    }
    if (category && category !== 'all') {
      conditions.push(eq(products.category, category));
    }
    if (brand && brand !== 'all') {
      conditions.push(eq(products.brand, brand));
    }
    if (supplierId && supplierId !== 'all') {
      conditions.push(eq(products.supplierId, supplierId));
    }
    if (search) {
      conditions.push(
        or(
          like(products.code, `%${search}%`),
          like(products.name, `%${search}%`),
          like(products.description, `%${search}%`),
          like(products.model, `%${search}%`),
          like(suppliers.name, `%${search}%`),
        ),
      );
    }

    // Build order by clause
    let orderByClause = desc(products.createdAt);
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
        default:
          orderByClause = desc(products.createdAt);
      }
    }

    // Fetch products with related data
    const productsData = await db
      .select({
        id: products.id,
        code: products.code,
        name: products.name,
        description: products.description,
        category: products.category,
        brand: products.brand,
        model: products.model,
        year: products.year,
        condition: products.condition,
        status: products.status,
        warehouseId: products.warehouseId,
        unit: products.unit,
        price: products.price,
        currency: products.currency,
        engineModel: products.engineModel,
        enginePower: products.enginePower,
        operatingWeight: products.operatingWeight,
        supplierId: products.supplierId,
        supplierName: suppliers.name,
        supplierCode: suppliers.code,
        isActive: products.isActive,
        createdAt: products.createdAt,
        updatedAt: products.updatedAt,
      })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalCount = await db
      .select({ count: products.id })
      .from(products)
      .leftJoin(suppliers, eq(products.supplierId, suppliers.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    return NextResponse.json({
      data: productsData,
      pagination: {
        page,
        limit,
        total: totalCount.length,
        totalPages: Math.ceil(totalCount.length / limit),
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
  try {
    const body = await request.json();
    const validatedData = body as NewProduct;

    // Check if product code already exists
    const existingProduct = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.code, validatedData.code))
      .limit(1);

    if (existingProduct.length > 0) {
      return NextResponse.json(
        { error: 'Product code already exists' },
        { status: 409 },
      );
    }

    // Create new product
    const newProduct = await db.insert(products).values({
      ...validatedData,
      isActive: true,
    });

    return NextResponse.json(
      { message: 'Product created successfully' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 },
    );
  }
}
