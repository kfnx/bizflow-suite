'use client';

import { useCallback, useState } from 'react';
import { RiBuildingLine } from '@remixicon/react';

import { ActionButton } from '@/components/action-button';
import Header from '@/components/header';
import { SupplierPreviewDrawer } from '@/components/supplier-preview-drawer';
import { SuppliersTable } from '@/components/suppliers-table';

import { Filters, type SuppliersFilters } from './filters';

export default function PageSuppliers() {
  const [filters, setFilters] = useState<SuppliersFilters>({
    search: '',
    country: 'all',
    sortBy: 'newest-first',
    page: 1,
    limit: 10,
  });
  const [previewSupplierId, setPreviewSupplierId] = useState<string | null>(
    null,
  );

  const handleFiltersChange = useCallback((newFilters: SuppliersFilters) => {
    setFilters(newFilters);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const handleLimitChange = useCallback((limit: number) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
  }, []);

  const handleSupplierClick = useCallback((supplierId: string) => {
    setPreviewSupplierId(supplierId);
  }, []);

  const handleClosePreview = useCallback(() => {
    setPreviewSupplierId(null);
  }, []);

  const HeaderComponent = () => {
    return (
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiBuildingLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Suppliers'
        description='Manage your supplier database and contact information.'
      >
        <ActionButton
          className='hidden lg:flex'
          label='New Supplier'
          href='/suppliers/new'
        />
      </Header>
    );
  };

  return (
    <>
      <HeaderComponent />

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters onFiltersChange={handleFiltersChange} />
        <SuppliersTable
          filters={filters}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          onSupplierClick={handleSupplierClick}
        />
      </div>

      <SupplierPreviewDrawer
        supplierId={previewSupplierId}
        open={!!previewSupplierId}
        onClose={handleClosePreview}
      />
    </>
  );
}
