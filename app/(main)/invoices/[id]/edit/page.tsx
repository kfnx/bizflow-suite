'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RiEditLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { toast } from 'sonner';

import { InvoiceFormData } from '@/lib/validations/invoice';
import { useCustomerDetail } from '@/hooks/use-customers';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { InvoiceForm } from '@/components/invoices/invoice-form';
import { InvoicePDFPreview } from '@/components/invoices/invoice-pdf-preview';
import * as Button from '@/components/ui/button';

export default function EditInvoicePage() {
  const params = useParams();
  const invoiceId = params.id as string;
  const [formData, setFormData] = useState<InvoiceFormData | null>(null);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [customerData, setCustomerData] = useState<{
    name: string;
    address: string;
    npwp?: string;
    contactPerson?: string;
    contactPersonPrefix?: string;
  } | null>(null);
  const [currentFormData, setCurrentFormData] = useState<InvoiceFormData | null>(null);

  const router = useRouter();

  // Get customer details for PDF preview when customer ID changes
  const currentCustomerId = currentFormData?.customerId || formData?.customerId;
  const { data: dynamicCustomerData } = useCustomerDetail(currentCustomerId || '');

  // Compute current customer data for PDF preview
  const currentCustomerData = dynamicCustomerData ? {
    name: dynamicCustomerData.name,
    address: dynamicCustomerData.address || dynamicCustomerData.billingAddress || '',
    npwp: dynamicCustomerData.npwp,
    contactPerson: dynamicCustomerData.contactPersons?.[0]?.name,
    contactPersonPrefix: dynamicCustomerData.contactPersons?.[0]?.prefix,
  } : customerData;

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

        // Set customer data for PDF preview
        if (invoiceData.customerName) {
          setCustomerData({
            name: invoiceData.customerName,
            address: invoiceData.customerAddress || '',
            npwp: invoiceData.customerNpwp,
            contactPerson: invoiceData.customerContactPerson,
            contactPersonPrefix: invoiceData.customerContactPersonPrefix,
          });
        }
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
        <div className='flex items-center gap-3'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='medium'
            onClick={() => setShowPDFPreview(!showPDFPreview)}
          >
            <Button.Icon as={showPDFPreview ? RiEyeOffLine : RiEyeLine} />
            {showPDFPreview ? 'Hide' : 'Show'} PDF Preview
          </Button.Root>
          <BackButton href='/invoices' label='Back to Invoices' />
        </div>
      </Header>
      <div className={`${showPDFPreview ? 'lg:flex lg:h-[calc(100vh-100px)]' : ''}`}>
        <div className={`${showPDFPreview ? 'lg:w-1/2 lg:overflow-y-auto' : 'w-full'}`}>
          {formData && (
            <InvoiceForm
              mode='edit'
              initialFormData={formData}
              invoiceId={invoiceId}
              onFormDataChange={setCurrentFormData}
            />
          )}
        </div>
        {showPDFPreview && (
          <div className='w-full border-t border-stroke-soft-200 bg-bg-weak-50 px-4 py-6 lg:border-l lg:border-t-0 lg:bg-transparent lg:w-1/2'>
            {/* Mobile title */}
            <div className='mb-4 lg:hidden'>
              <h3 className='text-lg font-semibold text-text-strong-950'>PDF Preview</h3>
              <p className='text-sm text-text-sub-600'>Live preview of how your invoice will look</p>
            </div>
            <div className='h-[60vh] lg:h-full'>
              {(currentFormData || formData) ? (
                <InvoicePDFPreview
                  formData={currentFormData || formData!}
                  customerData={currentCustomerData || undefined}
                />
              ) : (
                <div className='flex h-full items-center justify-center p-8 text-center'>
                  <div>
                    <p className='text-text-sub-600'>Loading PDF preview...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}
