'use client';

import { useState } from 'react';

import { useTransfers } from '@/hooks/use-transfers';
import { TransferPreviewDrawer } from '@/components/transfers/transfer-preview-drawer';
import { TransfersFilters } from '@/components/transfers/transfers-filters';
import { TransfersTable } from '@/components/transfers/transfers-table';

interface TransfersProps {
  initialFilters: {
    search: string;
    movementType: 'all' | 'in' | 'out' | 'transfer' | 'adjustment';
    warehouseFrom: string;
    warehouseTo: string;
    productId: string;
    sortBy: string;
    page: number;
    limit: number;
  };
}

export function Transfers({ initialFilters }: TransfersProps) {
  const [filters, setFilters] = useState(initialFilters);
  const [selectedTransferId, setSelectedTransferId] = useState<string | null>(
    null,
  );

  const { data, isLoading, error } = useTransfers(filters);

  const handleFilterChange = (
    newFilters: Parameters<
      NonNullable<
        React.ComponentProps<typeof TransfersFilters>['onFiltersChange']
      >
    >[0],
  ) => {
    setFilters({
      ...newFilters,
      page: newFilters.page ?? 1,
      limit: newFilters.limit ?? 10,
    });
  };

  const handleTransferSelect = (transferId: string) => {
    setSelectedTransferId(transferId);
  };

  const handleClosePreview = () => {
    setSelectedTransferId(null);
  };

  return (
    <>
      <TransfersFilters
        initialFilters={filters}
        onFiltersChange={handleFilterChange}
      />

      <TransfersTable
        transfers={data?.data || []}
        pagination={data?.pagination}
        isLoading={isLoading}
        error={error}
        onTransferSelect={handleTransferSelect}
        filters={filters}
        onFiltersChange={handleFilterChange}
      />

      <TransferPreviewDrawer
        transferId={selectedTransferId}
        open={!!selectedTransferId}
        onClose={handleClosePreview}
      />
    </>
  );
}
