'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { RiEditLine, RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { toast } from 'sonner';

import { QuotationFormData } from '@/lib/validations/quotation';
import { useCustomerDetail } from '@/hooks/use-customers';
import * as Button from '@/components/ui/button';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';
import { QuotationForm } from '@/components/quotations/quotation-form';
import { QuotationPDFPreview } from '@/components/quotations/quotation-pdf-preview';

export default function EditQuotationPage() {
  const params = useParams();
  const quotationId = params.id as string;
  const [formData, setFormData] = useState<QuotationFormData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showPDFPreview, setShowPDFPreview] = useState(false);
  const [customerData, setCustomerData] = useState<{
    name: string;
    address: string;
    contactPerson?: string;
    contactPersonPrefix?: string;
  } | null>(null);
  const [branchData, setBranchData] = useState<{
    name: string;
  } | null>(null);
  const [currentFormData, setCurrentFormData] =
    useState<QuotationFormData | null>(null);
  const [userDataForPDF, setUserDataForPDF] = useState<{
    createdByUserPrefix?: string;
    createdByUserFirstName?: string;
    createdByUserLastName?: string;
    createdByUserPhone?: string;
    approvedByUserPrefix?: string;
    approvedByUserFirstName?: string;
    approvedByUserLastName?: string;
    approvedByUserPhone?: string;
  } | null>(null);

  const router = useRouter();

  // Get customer details for PDF preview when customer ID changes
  const currentCustomerId = currentFormData?.customerId || formData?.customerId;
  const { data: dynamicCustomerData } = useCustomerDetail(
    currentCustomerId || '',
  );

  // Compute current customer data for PDF preview
  const currentCustomerData = dynamicCustomerData
    ? {
        name: dynamicCustomerData.name,
        address:
          dynamicCustomerData.address ||
          dynamicCustomerData.billingAddress ||
          '',
        contactPerson: dynamicCustomerData.contactPersons?.[0]?.name,
        contactPersonPrefix: dynamicCustomerData.contactPersons?.[0]?.prefix,
      }
    : customerData;

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

        // Check if quotation is in draft or revised status
        if (data.data.status !== 'draft' && data.data.status !== 'revised') {
          toast.error('Only draft and revised quotations can be edited');
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
            category: item.category || '',
            additionalSpecs: item.additionalSpecs || '',
            quantity: Number(item.quantity),
            unitPrice: item.unitPrice.toString(),
            notes: item.notes || '',
          })),
        });

        // Set customer and branch data for PDF preview
        if (quotationData.customerName) {
          setCustomerData({
            name: quotationData.customerName,
            address: quotationData.customerAddress || '',
            contactPerson: quotationData.customerContactPerson,
            contactPersonPrefix: quotationData.customerContactPersonPrefix,
          });
        }

        if (quotationData.branchName) {
          setBranchData({
            name: quotationData.branchName,
          });
        }

        // Set user data for PDF preview
        setUserDataForPDF({
          createdByUserPrefix: quotationData.createdByUserPrefix,
          createdByUserFirstName: quotationData.createdByUserFirstName,
          createdByUserLastName: quotationData.createdByUserLastName,
          createdByUserPhone: quotationData.createdByUserPhone,
          approvedByUserPrefix: quotationData.approvedByUserPrefix,
          approvedByUserFirstName: quotationData.approvedByUserFirstName,
          approvedByUserLastName: quotationData.approvedByUserLastName,
          approvedByUserPhone: quotationData.approvedByUserPhone,
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
          <BackButton href='/quotations' label='Back to Quotations' />
        </div>
      </Header>
      <div
        className={`${showPDFPreview ? 'lg:flex lg:h-[calc(100vh-100px)]' : ''}`}
      >
        <div
          className={`${showPDFPreview ? 'lg:w-1/2 lg:overflow-y-auto' : 'w-full'}`}
        >
          <QuotationForm
            mode='edit'
            initialFormData={formData}
            quotationId={quotationId}
            isLoadingData={isLoadingData}
            onFormDataChange={setCurrentFormData}
          />
        </div>
        {showPDFPreview && (
          <div className='w-full border-t border-stroke-soft-200 bg-bg-weak-50 px-4 py-6 lg:w-1/2 lg:border-t-0 lg:bg-transparent lg:px-8'>
            {/* Mobile title */}
            <div className='mb-4 lg:hidden'>
              <h3 className='text-lg font-semibold text-text-strong-950'>
                PDF Preview
              </h3>
              <p className='text-sm text-text-sub-600'>
                Live preview of how your quotation will look
              </p>
            </div>
            <div className='h-[60vh] lg:h-full'>
              {currentFormData || formData ? (
                <QuotationPDFPreview
                  formData={currentFormData || formData!}
                  customerData={currentCustomerData || undefined}
                  branchData={branchData || undefined}
                  userDataForPDF={userDataForPDF || undefined}
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
