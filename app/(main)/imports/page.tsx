'use client';

import { useCallback, useState } from 'react';
import { RiImportLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import { ImportPreviewDrawer } from '@/components/import-preview-drawer';
import { ImportsTable } from '@/components/imports-table';

import { Filters, type ImportsFilters } from './filters';

export default function PageImports() {
  const [filters, setFilters] = useState<ImportsFilters>({
    search: '',
    supplierId: 'all',
    warehouseId: 'all',
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });
  const [previewImportId, setPreviewImportId] = useState<string | null>(null);

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
        <ActionButton
          className='hidden lg:flex'
          label='New Import'
          href='/imports/new'
        />
      </Header>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters onFiltersChange={handleFiltersChange} />
        <ImportsTable
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onImportClick={handleImportClick}
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
