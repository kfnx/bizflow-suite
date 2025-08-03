'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RiEditLine } from '@remixicon/react';
import { toast } from 'sonner';

import { InvoiceFormData } from '@/lib/validations/invoice';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { InvoiceForm } from '@/components/invoices/invoice-form';

export default function EditInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const [formData, setFormData] = useState<InvoiceFormData | null>(null);

  const router = useRouter();

  // Fetch invoice data
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${invoiceId}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.error || 'Failed to fetch invoice');
          router.push('/invoices');
          return;
        }

        // Check if invoice is in draft status
        if (data.data.status !== 'draft') {
          toast.error('Only draft invoices can be edited');
          router.push('/invoices');
          return;
        }

        // Transform data for form
        const invoiceData = data.data;

        // Convert ISO date strings to YYYY-MM-DD format for date inputs
        const formatDateForInput = (dateString: string) => {
          if (!dateString) return '';
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        };

        setFormData({
          invoiceDate: formatDateForInput(invoiceData.invoiceDate),
          dueDate: formatDateForInput(invoiceData.dueDate),
          customerId: invoiceData.customerId,
          contractNumber: invoiceData.contractNumber || '',
          customerPoNumber: invoiceData.customerPoNumber || '',
          salesmanUserId: invoiceData.salesmanUserId || '',
          currency: invoiceData.currency || 'IDR',
          status: invoiceData.status,
          paymentTerms: invoiceData.paymentTerms || '',
          notes: invoiceData.notes || '',
          isIncludePPN: invoiceData.isIncludePPN,
          items: invoiceData.items.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: Number(item.quantity),
            unitPrice: item.unitPrice.toString(),
            additionalSpecs: item.additionalSpecs || '',
            category: item.category || '',
          })),
        });
      } catch (error) {
        console.error('Error fetching invoice:', error);
        toast.error('Failed to load invoice');
        router.push('/invoices');
      } finally {
        // Loading is handled in the form component
      }
    };

    fetchInvoice();
  }, [invoiceId, router]);

  return (
    <PermissionGate permission='invoices:update'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Edit Invoice'
        description='Edit your draft invoice.'
      >
        <BackButton href='/invoices' label='Back to Invoices' />
      </Header>
      {formData && (
        <InvoiceForm
          mode='edit'
          initialFormData={formData}
          invoiceId={invoiceId}
        />
      )}
    </PermissionGate>
  );
}
