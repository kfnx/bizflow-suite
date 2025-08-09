'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiEditLine } from '@remixicon/react';
import { toast } from 'sonner';

import { IMPORT_STATUS } from '@/lib/db/enum';
import { useImport } from '@/hooks/use-imports';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { ImportForm } from '@/components/imports/import-form';

interface EditImportPageProps {
  params: {
    id: string;
  };
}

export default function EditImportPage({ params }: EditImportPageProps) {
  const router = useRouter();
  const {
    data: importData,
    isLoading: isLoadingImport,
    error: importError,
  } = useImport(params.id);

  // Helper function to format date for HTML date input (YYYY-MM-DD)
  const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    // Handle various date formats and convert to YYYY-MM-DD
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  };

  // Transform import data for the form
  const transformImportData = () => {
    if (!importData) return null;

    return {
      supplierId: importData.supplierId,
      warehouseId: importData.warehouseId,
      importDate: formatDateForInput(importData.importDate),
      invoiceNumber: importData.invoiceNumber,
      invoiceDate: formatDateForInput(importData.invoiceDate),
      billOfLadingNumber: importData.billOfLadingNumber || '',
      billOfLadingDate: importData.billOfLadingDate
        ? formatDateForInput(importData.billOfLadingDate)
        : '',
      exchangeRateRMBtoIDR: importData.exchangeRateRMBtoIDR.toString(),
      notes: importData.notes || '',
      items:
        importData.items?.map((item) => ({
          id: item.id,
          productId: item.productId || undefined,
          name: item.name || '',
          description: item.description || '',
          category: item.category,
          priceRMB: item.priceRMB || '',
          quantity: item.quantity?.toString() || '1',
          brandId: item.brandId || '',
          condition: item.condition,
          machineTypeId: item.machineTypeId || '',
          unitOfMeasureId: item.unitOfMeasureId || '',
          partNumber: item.partNumber || '',
          engineNumber: item.engineNumber || '',
          serialNumber: item.serialNumber || '',
          batchOrLotNumber: item.batchOrLotNumber || '',
          modelNumber: item.modelNumber || '',
        })) || [],
    };
  };

  if (isLoadingImport) {
    return (
      <div className='flex h-full min-h-80 w-full items-center justify-center text-text-sub-600'>
        Loading import data...
      </div>
    );
  }

  if (importError) {
    return (
      <div className='flex h-full min-h-80 w-full items-center justify-center text-red-600'>
        Error loading import data
      </div>
    );
  }

  if (!importData) {
    return (
      <div className='flex h-full min-h-80 w-full items-center justify-center text-text-sub-600'>
        Import not found
      </div>
    );
  }

  // Check if import can be edited (only pending imports)
  if (importData.status !== IMPORT_STATUS.PENDING) {
    const statusMessage =
      importData.status === IMPORT_STATUS.VERIFIED
        ? 'This import cannot be edited because it has already been verified.'
        : 'This import cannot be edited due to its current status.';

    return (
      <div className='flex h-full w-full items-center justify-center'>
        <div className='text-center'>
          <p className='text-text-sub-600'>{statusMessage}</p>
          <button
            className='mt-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
            onClick={() => router.push('/imports')}
          >
            Back to Imports
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Edit Import'
        description='Update import record and items.'
      >
        <BackButton href='/imports' label='Back to Imports' />
      </Header>

      <ImportForm
        mode='edit'
        initialData={transformImportData() || undefined}
        importId={params.id}
        onSuccess={() => router.push('/imports')}
        onCancel={() => router.push('/imports')}
      />
    </>
  );
}
