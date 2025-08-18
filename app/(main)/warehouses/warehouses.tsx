'use client';

import { useState } from 'react';

import { useWarehouses } from '@/hooks/use-warehouses';
import { WarehousePreviewDrawer } from '@/components/warehouses/warehouse-preview-drawer';
import { WarehousesFilters } from '@/components/warehouses/warehouses-filters';
import { WarehousesTable } from '@/components/warehouses/warehouses-table';

interface WarehousesProps {
  initialFilters: {
    search: string;
    isActive: 'all' | 'true' | 'false';
    sortBy: string;
    page: number;
    limit: number;
  };
}

export function Warehouses({ initialFilters }: WarehousesProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(
    null,
  );

  const { data, isLoading, error } = useWarehouses(filters);

  const handleFilterChange = (
    newFilters: Parameters<
      NonNullable<
        React.ComponentProps<typeof WarehousesFilters>['onFiltersChange']
      >
    >[0],
  ) => {
    setFilters({
      ...newFilters,
      page: newFilters.page ?? 1,
      limit: newFilters.limit ?? 10,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleWarehouseSelect = (warehouseId: string) => {
    setSelectedWarehouseId(warehouseId);
  };

  const handleClosePreview = () => {
    setSelectedWarehouseId(null);
  };

  return (
    <>
      <WarehousesFilters
        initialFilters={filters}
        onFiltersChange={handleFilterChange}
      />

      <WarehousesTable
        warehouses={data?.data || []}
        pagination={data?.pagination}
        isLoading={isLoading}
        error={error}
        onWarehouseSelect={handleWarehouseSelect}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
        filters={filters}
      />

      <WarehousePreviewDrawer
        warehouseId={selectedWarehouseId}
        open={!!selectedWarehouseId}
        onClose={handleClosePreview}
      />
    </>
  );
}
