'use client';

import { useCallback, useState } from 'react';
import { RiImportLine } from '@remixicon/react';

import { useImports } from '@/hooks/use-imports';
import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import { ImportPreviewDrawer } from '@/components/imports/import-preview-drawer';
import {
  ImportsTable,
  ImportsTablePagination,
} from '@/components/imports/imports-table';

import { Filters, type ImportsFilters } from './filters';

export default function PageImports() {
  const [filters, setFilters] = useState<ImportsFilters>({
    search: '',
    status: 'all',
    sortBy: 'date-desc',
    page: 1,
    limit: 10,
  });
  const [previewImportId, setPreviewImportId] = useState<string | null>(null);
  const { data } = useImports(filters);

  const defaultPagination = { page: 1, limit: 10, total: 0, totalPages: 1 };

  const handleFiltersChange = useCallback((newFilters: ImportsFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  const handleImportClick = useCallback((importId: string) => {
    setPreviewImportId(importId);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewImportId(null);
  }, []);

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiImportLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Imports'
        description='Manage product imports from suppliers to warehouses.'
      >
        <div className='flex gap-2'>
          <ActionButton label='New Import' href='/imports/new' />
        </div>
      </Header>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters onFiltersChange={handleFiltersChange} />
        <ImportsTable filters={filters} onImportClick={handleImportClick} />
        <ImportsTablePagination
          pagination={data?.pagination ?? defaultPagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </div>

      <ImportPreviewDrawer
        importId={previewImportId}
        open={!!previewImportId}
        onClose={handleClosePreview}
      />
    </>
  );
}
