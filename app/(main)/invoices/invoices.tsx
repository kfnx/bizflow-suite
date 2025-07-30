'use client';

import { useCallback, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { useInvoices } from '@/hooks/use-invoices';
import { InvoicePreviewDrawer } from '@/components/invoices/invoice-preview-drawer';
import {
  InvoicesTable,
  InvoicesTablePagination,
} from '@/components/invoices/invoices-table';

import { Filters, type InvoicesFilters } from './filters';

interface InvoicesProps {
  initialFilters: InvoicesFilters;
}

export function Invoices({ initialFilters }: InvoicesProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<InvoicesFilters>(initialFilters);
  const [previewInvoiceId, setPreviewInvoiceId] = useState<string | null>(null);
  const { data } = useInvoices(filters);

  const handleFiltersChange = useCallback(
    (newFilters: InvoicesFilters) => {
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

      router.replace(`/invoices?${params.toString()}`, { scroll: false });
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

  const handlePreview = useCallback((invoiceId: string) => {
    setPreviewInvoiceId(invoiceId);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewInvoiceId(null);
  }, []);

  return (
    <>
      <Filters
        onFiltersChange={handleFiltersChange}
        initialFilters={initialFilters}
      />
      <InvoicesTable filters={filters} onPreview={handlePreview} />
      <InvoicesTablePagination
        pagination={data?.pagination}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

      <InvoicePreviewDrawer
        invoiceId={previewInvoiceId}
        open={!!previewInvoiceId}
        onClose={handleClosePreview}
      />
    </>
  );
}
