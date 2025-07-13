import { and, eq, sql } from 'drizzle-orm';

import { db } from '@/lib/db';
import { products, stockMovements, warehouses } from '@/lib/db/schema';

export interface StockQuantity {
  productId: string;
  warehouseId: string;
  quantity: number;
  productCode?: string;
  name?: string;
  warehouseName?: string;
}

export interface WarehouseStockSummary {
  warehouseId: string;
  warehouseName: string;
  totalProducts: number;
  totalQuantity: number;
  products: StockQuantity[];
}

export interface ProductStockSummary {
  productId: string;
  name: string;
  totalQuantity: number;
  warehouseStocks: StockQuantity[];
}

/**
 * Calculate current stock quantity for a specific product in a specific warehouse
 */
export async function calculateProductWarehouseStock(
  productId: string,
  warehouseId: string,
): Promise<number> {
  const result = await db
    .select({
      totalIn: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'in' THEN quantity ELSE 0 END), 0)`,
      totalOut: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'out' THEN quantity ELSE 0 END), 0)`,
    })
    .from(stockMovements)
    .where(
      and(
        eq(stockMovements.productId, productId),
        eq(stockMovements.warehouseIdTo, warehouseId),
      ),
    );

  const { totalIn, totalOut } = result[0] || { totalIn: 0, totalOut: 0 };
  return totalIn - totalOut;
}

/**
 * Calculate current stock quantities for all products in a specific warehouse
 */
export async function calculateWarehouseStock(
  warehouseId: string,
): Promise<StockQuantity[]> {
  const result = await db
    .select({
      productId: stockMovements.productId,
      name: products.name,
      totalIn: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'in' THEN quantity ELSE 0 END), 0)`,
      totalOut: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'out' THEN quantity ELSE 0 END), 0)`,
    })
    .from(stockMovements)
    .leftJoin(products, eq(stockMovements.productId, products.id))
    .where(eq(stockMovements.warehouseIdTo, warehouseId))
    .groupBy(stockMovements.productId, products.name);

  return result
    .map((row) => ({
      productId: row.productId,
      warehouseId,
      quantity: row.totalIn - row.totalOut,
      name: row.name || undefined,
    }))
    .filter((stock) => stock.quantity > 0); // Only return products with positive stock
}

/**
 * Calculate current stock quantities for a specific product across all warehouses
 */
export async function calculateProductStock(
  productId: string,
): Promise<StockQuantity[]> {
  const result = await db
    .select({
      warehouseId: stockMovements.warehouseIdTo,
      warehouseName: warehouses.name,
      totalIn: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'in' THEN quantity ELSE 0 END), 0)`,
      totalOut: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'out' THEN quantity ELSE 0 END), 0)`,
    })
    .from(stockMovements)
    .leftJoin(warehouses, eq(stockMovements.warehouseIdTo, warehouses.id))
    .where(eq(stockMovements.productId, productId))
    .groupBy(stockMovements.warehouseIdTo, warehouses.name);

  return result
    .map((row) => ({
      productId,
      warehouseId: row.warehouseId,
      quantity: row.totalIn - row.totalOut,
      warehouseName: row.warehouseName || undefined,
    }))
    .filter((stock) => stock.quantity > 0);
}

/**
 * Get comprehensive warehouse stock summary with product details
 */
export async function getWarehouseStockSummary(
  warehouseId: string,
): Promise<WarehouseStockSummary> {
  const warehouseInfo = await db
    .select({ name: warehouses.name })
    .from(warehouses)
    .where(eq(warehouses.id, warehouseId))
    .limit(1);

  const warehouseName = warehouseInfo[0]?.name || 'Unknown Warehouse';
  const products = await calculateWarehouseStock(warehouseId);

  return {
    warehouseId,
    warehouseName,
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, product) => sum + product.quantity, 0),
    products,
  };
}

/**
 * Get comprehensive product stock summary across all warehouses
 */
export async function getProductStockSummary(
  productId: string,
): Promise<ProductStockSummary | null> {
  const productInfo = await db
    .select({
      name: products.name,
    })
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!productInfo.length) {
    return null;
  }

  const { name } = productInfo[0];
  const warehouseStocks = await calculateProductStock(productId);

  return {
    productId,
    name: name,
    totalQuantity: warehouseStocks.reduce(
      (sum, stock) => sum + stock.quantity,
      0,
    ),
    warehouseStocks,
  };
}

/**
 * Get low stock alerts (products below minimum threshold)
 */
export async function getLowStockAlerts(
  minimumThreshold: number = 5,
): Promise<StockQuantity[]> {
  const allStocks = await db
    .select({
      productId: stockMovements.productId,
      warehouseId: stockMovements.warehouseIdTo,
      name: products.name,
      warehouseName: warehouses.name,
      totalIn: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'in' THEN quantity ELSE 0 END), 0)`,
      totalOut: sql<number>`COALESCE(SUM(CASE WHEN movement_type = 'out' THEN quantity ELSE 0 END), 0)`,
    })
    .from(stockMovements)
    .leftJoin(products, eq(stockMovements.productId, products.id))
    .leftJoin(warehouses, eq(stockMovements.warehouseIdTo, warehouses.id))
    .groupBy(
      stockMovements.productId,
      stockMovements.warehouseIdTo,
      products.name,
      warehouses.name,
    );

  return allStocks
    .map((row) => ({
      productId: row.productId,
      warehouseId: row.warehouseId,
      quantity: row.totalIn - row.totalOut,
      name: row.name || undefined,
      warehouseName: row.warehouseName || undefined,
    }))
    .filter(
      (stock) => stock.quantity > 0 && stock.quantity <= minimumThreshold,
    );
}

/**
 * Validate if there's sufficient stock for a transaction
 */
export async function validateStockAvailability(
  productId: string,
  warehouseId: string,
  requiredQuantity: number,
): Promise<{
  isAvailable: boolean;
  currentStock: number;
  deficit: number;
}> {
  const currentStock = await calculateProductWarehouseStock(
    productId,
    warehouseId,
  );
  const isAvailable = currentStock >= requiredQuantity;
  const deficit = isAvailable ? 0 : requiredQuantity - currentStock;

  return {
    isAvailable,
    currentStock,
    deficit,
  };
}
