'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useDeliveryNotes } from '@/hooks/use-delivery-notes';
import {
  DeliveryNotesTable,
  DeliveryNotesTablePagination,
} from '@/components/delivery-notes-table';

import { Filters, type DeliveryNotesFilters } from './filters';

interface DeliveryNotesProps {
  initialFilters: DeliveryNotesFilters;
}

export function DeliveryNotes({ initialFilters }: DeliveryNotesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<DeliveryNotesFilters>(initialFilters);
  const { data } = useDeliveryNotes(filters);

  const handleFiltersChange = useCallback(
    (newFilters: DeliveryNotesFilters) => {
      setFilters(newFilters);

      const params = new URLSearchParams(searchParams);

      if (newFilters.search) {
        params.set('search', newFilters.search);
      } else {
        params.delete('search');
      }

      if (newFilters.status && newFilters.status !== 'all') {
        params.set('status', newFilters.status);
      } else {
        params.delete('status');
      }

      if (newFilters.sortBy && newFilters.sortBy !== 'newest-first') {
        params.set('sortBy', newFilters.sortBy);
      } else {
        params.delete('sortBy');
      }

      if (newFilters.page && newFilters.page !== 1) {
        params.set('page', newFilters.page.toString());
      } else {
        params.delete('page');
      }

      if (newFilters.limit && newFilters.limit !== 10) {
        params.set('limit', newFilters.limit.toString());
      } else {
        params.delete('limit');
      }

      router.replace(`/delivery-notes?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      handleFiltersChange({ ...filters, page });
    },
    [filters, handleFiltersChange],
  );

  const handleLimitChange = useCallback(
    (limit: number) => {
      handleFiltersChange({ ...filters, limit, page: 1 });
    },
    [filters, handleFiltersChange],
  );

  return (
    <>
      <Filters
        onFiltersChange={handleFiltersChange}
        initialFilters={initialFilters}
      />
      <DeliveryNotesTable
        filters={filters}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />
      {data?.pagination && (
        <DeliveryNotesTablePagination
          data={data.pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      )}
    </>
  );
}
