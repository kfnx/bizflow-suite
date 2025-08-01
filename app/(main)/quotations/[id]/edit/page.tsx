'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RiEditLine } from '@remixicon/react';
import { toast } from 'sonner';

import { QuotationFormData } from '@/lib/validations/quotation';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { QuotationForm } from '@/components/quotations/quotation-form';

export default function EditQuotationPage() {
  const params = useParams();
  const quotationId = params.id as string;
  const [formData, setFormData] = useState<QuotationFormData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const router = useRouter();

  // Fetch quotation data
  useEffect(() => {
    const fetchQuotation = async () => {
      try {
        const response = await fetch(`/api/quotations/${quotationId}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || 'Failed to fetch quotation');
          router.push('/quotations');
          return;
        }

        // Check if quotation is in draft status
        if (data.data.status !== 'draft') {
          toast.error('Only draft quotations can be edited');
          router.push('/quotations');
          return;
        }

        // Transform data for form
        const quotationData = data.data;

        // Convert ISO date strings to YYYY-MM-DD format for date inputs
        const formatDateForInput = (dateString: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
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
        });
      } catch (error) {
        console.error('Error fetching quotation:', error);
        toast.error('Failed to load quotation');
        router.push('/quotations');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchQuotation();
  }, [quotationId, router]);

  return (
    <PermissionGate permission='quotations:update'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Edit Quotation'
        description='Edit your draft quotation.'
      >
        <BackButton href='/quotations' label='Back to Quotations' />
      </Header>
      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <QuotationForm
          mode='edit'
          initialFormData={formData}
          quotationId={quotationId}
          isLoadingData={isLoadingData}
        />
      </div>
    </PermissionGate>
  );
}
