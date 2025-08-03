'use client';

import { useParams, useRouter } from 'next/navigation';
import { RiEditLine } from '@remixicon/react';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { QuotationFormData } from '@/lib/validations/quotation';
import { useQuotationDetail } from '@/hooks/use-quotations';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { QuotationForm } from '@/components/quotations/quotation-form';
import { SimplePageLoading } from '@/components/simple-page-loading';

export default function ReviseQuotationPage() {
  const params = useParams();
  const quotationId = params.id as string;
  const router = useRouter();

  const { data, isLoading, error } = useQuotationDetail(quotationId);

  // Transform quotation data to form data format
  const transformQuotationToFormData = (
    quotationData: any,
  ): QuotationFormData => {
    // Convert ISO date strings to YYYY-MM-DD format for date inputs
    const formatDateForInput = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    return {
      quotationNumber: quotationData.quotationNumber,
      quotationDate: formatDateForInput(quotationData.quotationDate),
      validUntil: formatDateForInput(quotationData.validUntil),
      customerId: quotationData.customerId,
      branchId: quotationData.branchId || undefined,
      isIncludePPN: quotationData.isIncludePPN,
      notes: quotationData.notes || '',
      termsAndConditions: quotationData.termsAndConditions || '',
      status: quotationData.status,
      items: quotationData.items.map((item: any) => ({
        productId: item.productId,
        name: item.name,
        quantity: Number(item.quantity),
        unitPrice: item.unitPrice.toString(),
        notes: item.notes || '',
      })),
    };
  };

  // Handle loading state
  if (isLoading) {
    return (
      <PermissionGate permission='quotations:update'>
        <Header
          icon={
            <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiEditLine className='size-6 text-text-sub-600' />
            </div>
          }
          title='Revise Quotation'
          description='Revise rejected quotation.'
        >
          <BackButton href='/quotations' label='Back to Quotations' />
        </Header>
        <div className='flex min-h-[400px] flex-1 items-center justify-center'>
          <SimplePageLoading>Loading quotation details...</SimplePageLoading>
        </div>
      </PermissionGate>
    );
  }

  // Handle error state
  if (error) {
    toast.error(error.message || 'Failed to load quotation');
    router.push('/quotations');
    return null;
  }

  // Handle no data state
  if (!data?.data) {
    toast.error('Quotation not found');
    router.push('/quotations');
    return null;
  }

  const quotationData = data.data;

  // Check if quotation is in rejected status
  if (quotationData.status !== QUOTATION_STATUS.REJECTED) {
    toast.error('Only rejected quotations can be revised');
    router.push('/quotations');
    return null;
  }

  const formData = transformQuotationToFormData(quotationData);

  return (
    <PermissionGate permission='quotations:update'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Revise Quotation'
        description='Revise rejected quotation.'
      >
        <BackButton href='/quotations' label='Back to Quotations' />
      </Header>
      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <QuotationForm
          mode='revise'
          initialFormData={formData}
          quotationId={quotationId}
          isLoadingData={false}
        />
      </div>
    </PermissionGate>
  );
}
