'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useQuotations } from '@/hooks/use-quotations';
import { QuotationPreviewDrawer } from '@/components/quotation-preview-drawer';
import {
  QuotationsTable,
  QuotationTablePagination,
} from '@/components/quotations-table';

import { Filters, type QuotationsFilters } from './filters';

interface QuotationsProps {
  initialFilters: QuotationsFilters;
}

export function Quotations({ initialFilters }: QuotationsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<QuotationsFilters>(initialFilters);
  const [previewQuotationId, setPreviewQuotationId] = useState<string | null>(
    null,
  );
  const { data } = useQuotations(filters);

  const handleFiltersChange = useCallback(
    (newFilters: QuotationsFilters) => {
      setFilters(newFilters);

      // Update URL with new filters for better UX and shareable URLs
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

      router.replace(`/quotations?${params.toString()}`, { scroll: false });
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

  const handlePreview = useCallback((quotationId: string) => {
    setPreviewQuotationId(quotationId);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewQuotationId(null);
  }, []);

  return (
    <>
      <Filters
        onFiltersChange={handleFiltersChange}
        initialFilters={initialFilters}
      />
      <QuotationsTable filters={filters} onPreview={handlePreview} />
      <QuotationTablePagination
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <QuotationPreviewDrawer
        quotationId={previewQuotationId}
        open={!!previewQuotationId}
        onClose={handleClosePreview}
      />
    </>
  );
}
