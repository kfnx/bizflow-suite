'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiArrowLeftLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiHashtag,
  RiHistoryLine,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiUserLine,
} from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { InvoiceFormData, type InvoiceItem } from '@/lib/validations/invoice';
import {
  formatNumberWithDots,
  parseNumberFromDots,
} from '@/utils/number-formatter';
import { useInvoiceNumber } from '@/hooks/use-invoice-number';
import { useInvoiceDetail } from '@/hooks/use-invoices';
import { useProducts } from '@/hooks/use-products';
import {
  useQuotationDetail,
  useQuotations,
  useQuotationsReadyForInvoicing,
} from '@/hooks/use-quotations';
import { useUsers } from '@/hooks/use-users';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { CustomerSelectWithAdd } from '@/components/customers/customer-select-with-add';
import InvoiceNumberDisplay from '@/components/invoices/invoice-number-display';

import { ProductSelect } from '../products/product-select';
import { QuotationSelect } from '../quotations/quotation-select';

export type InvoiceFormMode = 'create' | 'edit';

interface InvoiceFormProps {
  mode: InvoiceFormMode;
  invoiceId?: string;
  initialFormData?: InvoiceFormData;
  onFormDataChange?: (formData: InvoiceFormData) => void;
}

const emptyFormData: InvoiceFormData = {
  invoiceDate: '',
  dueDate: '',
  customerId: '',
  contractNumber: '',
  customerPoNumber: '',
  salesmanUserId: '',
  currency: 'IDR',
  status: 'draft',
  paymentTerms: '',
  isIncludePPN: false,
  notes: '',
  items: [],
};

export function InvoiceForm({
  mode,
  invoiceId,
  initialFormData,
  onFormDataChange,
}: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(
    initialFormData || emptyFormData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const isInitialLoadRef = useRef(true);
  const [isInitialized, setIsInitialized] = useState(mode === 'create');
  const [quotationChanged, setQuotationChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: invoice, isLoading: isLoadingInvoice } = useInvoiceDetail(
    invoiceId || '',
  );
  const { data: invoiceNumber, isLoading: isLoadingInvoiceNumber } =
    useInvoiceNumber();
  const { data: users } = useUsers();

  // Initialize form data from invoice for edit mode
  useEffect(() => {
    if (mode === 'edit' && invoice?.data && !isInitialized) {
      const invoiceData = invoice.data;

      // Convert ISO date strings to YYYY-MM-DD format for date inputs
      const formatDateForInput = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().split('T')[0];
      };

      setFormData({
        invoiceDate: formatDateForInput(invoiceData.invoiceDate),
        dueDate: formatDateForInput(invoiceData.dueDate),
        customerId: invoiceData.customerId || '',
        contractNumber: invoiceData.contractNumber || '',
        customerPoNumber: invoiceData.customerPoNumber || '',
        salesmanUserId: invoiceData.salesmanUserId || '',
        currency: invoiceData.currency || 'IDR',
        status: invoiceData.status as 'draft' | 'sent' | 'paid' | 'void',
        paymentTerms: invoiceData.paymentTerms || '',
        notes: invoiceData.notes || '',
        isIncludePPN: invoiceData.isIncludePPN || false,
        items:
          invoiceData.items?.map((item: any) => ({
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            additionalSpecs: item.additionalSpecs,
            category: item.category,
          })) || [],
      });
      setIsInitialized(true);
      setQuotationChanged(false);
    }
  }, [invoice, isInitialized, mode]);

  // Initialize form data for create mode
  useEffect(() => {
    if (mode === 'create' && initialFormData && !isInitialized) {
      setFormData(initialFormData);
      setIsInitialized(true);
      setQuotationChanged(false);
    }
  }, [initialFormData, isInitialized, mode]);

  // Call callback when form data changes (for PDF preview)
  useEffect(() => {
    if (onFormDataChange && formData) {
      // Skip the initial load to prevent infinite loops in edit mode
      if (isInitialLoadRef.current && mode === 'edit') {
        isInitialLoadRef.current = false;
        return;
      }
      onFormDataChange(formData);
    }
  }, [onFormDataChange, formData, mode]);

  const { data: quotation, isFetching } = useQuotationDetail(
    formData.quotationId || '',
  );

  // Initialize form item when quotation changes
  useEffect(() => {
    if (!quotationChanged) return;

    if (!formData.quotationId) {
      setFormData((prev) => ({ ...prev, items: [] }));
      return;
    }

    if (quotation?.data) {
      setFormData((prev) => ({
        ...prev,
        customerId: quotation.data.customerId || '',
        notes: quotation.data.notes || '',
        items: quotation.data.items.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: formatNumberWithDots(item.unitPrice),
          additionalSpecs: item.additionalSpecs || '',
          category: item.category || '',
        })),
      }));
    }
  }, [quotationChanged, formData.quotationId, quotation]);

  const handleInputChange = useCallback(
    (field: keyof Omit<InvoiceFormData, 'items'>, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear validation error for this field when user starts typing
      if (validationErrors[field]) {
        setValidationErrors((prev) => ({ ...prev, [field]: '' }));
      }
    },
    [validationErrors],
  );

  const handleQuotationChange = useCallback((value: string) => {
    setQuotationChanged(true);

    setFormData((prev) => ({
      ...prev,
      quotationId: value === 'none' ? '' : value,
      customerId: '',
    }));
  }, []);

  const addItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: '',
          name: '',
          quantity: 1,
          unitPrice: '0',
        },
      ],
    }));
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof InvoiceItem, value: string | number) => {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        ),
      }));
    },
    [],
  );

  const removeItem = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  }, []);

  const calculateSubtotal = useCallback(() => {
    if (!formData) return 0;
    return formData.items.reduce((sum, item) => {
      const unitPrice = parseFloat(parseNumberFromDots(item.unitPrice)) || 0;
      return sum + item.quantity * unitPrice;
    }, 0);
  }, [formData]);

  const calculateTax = useCallback(() => {
    if (!formData) return 0;
    const subtotal = calculateSubtotal();
    return formData.isIncludePPN ? subtotal * 0.11 : 0;
  }, [calculateSubtotal, formData]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateTax();
  }, [calculateSubtotal, calculateTax]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});

    try {
      const url =
        mode === 'create' ? '/api/invoices' : `/api/invoices/${invoiceId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.error === 'Validation failed' && data.details) {
          // Handle validation errors from API
          const errors: Record<string, string> = {};
          data.details.forEach((error: any) => {
            const field = error.path?.join('.');
            if (field) {
              errors[field] = error.message;
            }
          });
          setValidationErrors(errors);

          // Show first validation error as toast
          const firstError =
            data.details[0]?.message || 'Please fix the validation errors';
          toast.error(firstError);
        } else {
          toast.error(
            data.error ||
              `Failed to ${mode === 'create' ? 'create' : 'update'} invoice`,
          );
        }
        return;
      }

      toast.success(
        `Invoice ${mode === 'create' ? 'created' : 'updated'} successfully!`,
      );
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      if (mode === 'edit' && invoiceId) {
        queryClient.invalidateQueries({ queryKey: ['invoice', invoiceId] });
        router.push(`/invoices/${invoiceId}`);
      } else {
        router.push('/invoices');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(formData.items);
  }, [formData.items]);

  // Show loading state for create mode while fetching invoice number
  if (mode === 'create' && (isLoadingInvoiceNumber || !invoiceNumber)) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Loading invoice number...</p>
      </div>
    );
  }

  if (mode === 'edit' && (isLoadingInvoice || !isInitialized)) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Loading invoice...</p>
      </div>
    );
  }

  if (mode === 'edit' && !invoice?.data) {
    return (
      <div className='w-full p-8 text-center'>
        <p className='text-text-sub-600'>Invoice not found</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'
    >
      {/* Header for edit mode */}
      {mode === 'edit' && invoice?.data && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <Button.Root
              variant='neutral'
              mode='ghost'
              size='small'
              onClick={() => router.push(`/invoices/${invoiceId}`)}
              type='button'
            >
              <RiArrowLeftLine className='size-4' />
            </Button.Root>
            <div>
              <h1 className='text-2xl font-bold text-text-strong-950'>
                Edit Invoice
              </h1>
              <p className='text-text-sub-600'>{invoice.data.invoiceNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Details */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-6 font-semibold text-text-strong-950'>
          Invoice Details
        </h3>

        {/* Invoice Number Display */}
        {mode === 'create' ? (
          <InvoiceNumberDisplay invoiceNumber={invoiceNumber!} />
        ) : (
          <div className='mb-4 flex flex-col gap-1'>
            <Label.Root htmlFor='invoiceNumber'>Invoice Number</Label.Root>
            <div className='text-sm p-2 text-text-sub-600'>
              {invoice?.data?.invoiceNumber}
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='quotationId'>Select From Quotation</Label.Root>
            <QuotationSelect
              value={formData.quotationId || ''}
              onValueChange={handleQuotationChange}
              placeholder='Select quotation'
              status={QUOTATION_STATUS.ACCEPTED}
            />
            {isFetching && (
              <p className='text-xs mt-1 text-text-sub-600'>
                Loading quotation data...
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='invoiceDate'>
              Invoice Date <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiCalendarLine} />
                <Input.Input
                  id='invoiceDate'
                  type='date'
                  value={formData.invoiceDate}
                  onChange={(e) =>
                    handleInputChange('invoiceDate', e.target.value)
                  }
                  required
                  className={
                    validationErrors.invoiceDate ? 'border-error-500' : ''
                  }
                />
              </Input.Wrapper>
            </Input.Root>
            {validationErrors.invoiceDate && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.invoiceDate}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='dueDate'>
              Due Date <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiCalendarLine} />
                <Input.Input
                  id='dueDate'
                  type='date'
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                  min={formData.invoiceDate}
                  className={validationErrors.dueDate ? 'border-error-500' : ''}
                />
              </Input.Wrapper>
            </Input.Root>
            {validationErrors.dueDate && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.dueDate}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='customer'>
              Customer <Label.Asterisk />
            </Label.Root>
            <CustomerSelectWithAdd
              value={formData.customerId}
              onValueChange={(value) => handleInputChange('customerId', value)}
            />
            {validationErrors.customerId && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.customerId}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='currency'>Currency</Label.Root>
            <Select.Root
              value={formData.currency}
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <Select.Trigger id='currency'>
                <Select.TriggerIcon as={RiGlobalLine} />
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='IDR'>IDR</Select.Item>
                <Select.Item value='RMB'>RMB</Select.Item>
                <Select.Item value='USD'>USD</Select.Item>
                <Select.Item value='EUR'>EUR</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          {mode === 'edit' && (
            <div className='flex flex-col gap-1'>
              <Label.Root htmlFor='status'>Status</Label.Root>
              <Select.Root
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <Select.Trigger id='status'>
                  <Select.TriggerIcon as={RiHashtag} />
                  <Select.Value />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value='draft'>Draft</Select.Item>
                  <Select.Item value='sent'>Sent</Select.Item>
                  <Select.Item value='paid'>Paid</Select.Item>
                  <Select.Item value='void'>Void</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
          )}

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='contractNumber'>Contract Number</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiHashtag} />
                <Input.Input
                  id='contractNumber'
                  value={formData.contractNumber || ''}
                  onChange={(e) =>
                    handleInputChange('contractNumber', e.target.value)
                  }
                  placeholder='Enter contract number'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='customerPoNumber'>
              Customer PO Number
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiHashtag} />
                <Input.Input
                  id='customerPoNumber'
                  value={formData.customerPoNumber || ''}
                  onChange={(e) =>
                    handleInputChange('customerPoNumber', e.target.value)
                  }
                  placeholder='Enter customer PO number'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='salesmanUserId'>Salesman</Label.Root>
            <Select.Root
              value={formData.salesmanUserId || ''}
              onValueChange={(value) =>
                handleInputChange('salesmanUserId', value)
              }
            >
              <Select.Trigger id='salesmanUserId'>
                <Select.TriggerIcon as={RiUserLine} />
                <Select.Value placeholder='Select salesman' />
              </Select.Trigger>
              <Select.Content>
                {users?.users?.map((user) => (
                  <Select.Item
                    key={user.id}
                    value={user.id}
                    disabled={!user.isActive}
                  >
                    {user.firstName} {user.lastName}
                    {user.branchName && (
                      <small className='ml-1 text-text-soft-400'>
                        {user.branchName}
                      </small>
                    )}
                    {!user.isActive && (
                      <small className='ml-1 text-text-soft-400'>
                        (Inactive)
                      </small>
                    )}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='paymentTerms'>Payment Terms</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiMoneyDollarCircleLine} />
                <Input.Input
                  id='paymentTerms'
                  value={formData.paymentTerms || ''}
                  onChange={(e) =>
                    handleInputChange('paymentTerms', e.target.value)
                  }
                  placeholder='Enter payment terms'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1 md:col-span-2'>
            <Label.Root htmlFor='notes'>Notes</Label.Root>
            <Textarea.Root
              id='notes'
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder='Additional notes...'
            />
          </div>

          <div className='flex items-center space-x-2 md:col-span-2'>
            <input
              type='checkbox'
              id='includePPN'
              checked={formData.isIncludePPN}
              onChange={(e) =>
                handleInputChange('isIncludePPN', e.target.checked)
              }
              className='rounded border-stroke-soft-200'
            />
            <label htmlFor='includePPN' className='text-sm text-text-sub-600'>
              Include PPN (11% tax)
            </label>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
          Items
        </h3>

        {formData.items.length === 0 ? (
          <div className='py-8 text-center text-text-sub-600'>
            No items added yet. Click &quot;Add Item&quot; to get started or
            select an quotation to import items.
            {validationErrors.items && (
              <p className='text-sm mt-2 text-error-base'>
                {validationErrors.items}
              </p>
            )}
          </div>
        ) : (
          <div className='space-y-4'>
            {formData.items.map((item, index) => (
              <div
                key={index}
                className='space-y-4 rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-4'
              >
                {/* First row - Product (always full width) */}
                <div className='flex flex-col gap-1'>
                  <Label.Root htmlFor={`product-${index}`}>
                    Product <Label.Asterisk />
                  </Label.Root>
                  <ProductSelect
                    value={item.productId}
                    onProductSelect={(product) => {
                      setFormData((prev) => ({
                        ...prev,
                        items: prev.items.map((currentItem, currentIndex) =>
                          currentIndex === index
                            ? {
                                ...currentItem,
                                productId: product.id,
                                name: product.name,
                                category: product.category || '',
                                unitPrice: formatNumberWithDots(
                                  product.price || 0,
                                ),
                                additionalSpecs:
                                  product.category === 'serialized' &&
                                  product.additionalSpecs
                                    ? product.additionalSpecs
                                    : currentItem.additionalSpecs || '',
                              }
                            : currentItem,
                        ),
                      }));
                    }}
                    onValueChange={(value) => {
                      // Fallback jika onProductSelect tidak dipanggil
                      if (!value) {
                        updateItem(index, 'productId', '');
                        updateItem(index, 'name', '');
                        updateItem(index, 'category', '');
                        updateItem(index, 'unitPrice', '0');
                        updateItem(index, 'additionalSpecs', '');
                      }
                    }}
                  />
                </div>

                {/* Second row - Quantity, Unit Price, Total, Delete in responsive grid */}
                <div className='grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                  <div className='flex flex-col gap-1'>
                    <Label.Root htmlFor={`quantity-${index}`}>
                      Quantity
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Input
                          id={`quantity-${index}`}
                          type='number'
                          min='1'
                          step='1'
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              index,
                              'quantity',
                              Number(e.target.value),
                            )
                          }
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Label.Root htmlFor={`unitPrice-${index}`}>
                      Unit Price
                    </Label.Root>
                    <Input.Root>
                      <Input.Wrapper>
                        <Input.Icon as={RiMoneyDollarCircleLine} />
                        <Input.Input
                          id={`unitPrice-${index}`}
                          type='text'
                          value={formatNumberWithDots(item.unitPrice)}
                          onChange={(e) => {
                            const rawValue = parseNumberFromDots(
                              e.target.value,
                            );
                            updateItem(index, 'unitPrice', rawValue);
                          }}
                          placeholder='0'
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Label.Root>Total</Label.Root>
                    <div className='text-sm rounded-md border border-stroke-soft-200 bg-bg-white-0 px-3 py-2 font-medium'>
                      {(
                        item.quantity *
                        (parseFloat(parseNumberFromDots(item.unitPrice)) || 0)
                      ).toLocaleString()}
                    </div>
                  </div>

                  <div className='flex flex-col gap-1'>
                    <Label.Root>Actions</Label.Root>
                    <Button.Root
                      variant='error'
                      mode='stroke'
                      onClick={() => removeItem(index)}
                      type='button'
                      size='medium'
                      className='w-full'
                    >
                      <RiDeleteBinLine className='size-4' />
                      <span className='sm:hidden'>Delete</span>
                    </Button.Root>
                  </div>
                </div>

                {/* Only show Additional Specs for serialized products */}
                {item.category === 'serialized' && (
                  <div className='flex flex-col gap-1'>
                    <Label.Root htmlFor={`additionalSpecs-${index}`}>
                      Additional Specs
                    </Label.Root>
                    <Textarea.Root
                      id={`additionalSpecs-${index}`}
                      value={item.additionalSpecs || ''}
                      onChange={(e) =>
                        updateItem(index, 'additionalSpecs', e.target.value)
                      }
                      placeholder='Enter specification...'
                      className='w-full'
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className='mt-4 flex justify-end'>
          <Button.Root
            variant='neutral'
            mode='stroke'
            size='small'
            onClick={addItem}
            type='button'
          >
            <RiAddLine className='size-4' />
            Add Item
          </Button.Root>
        </div>
      </div>

      {/* Summary */}
      {formData.items.length > 0 && (
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
            Summary
          </h3>
          <div className='text-sm space-y-2'>
            <div className='flex justify-between'>
              <span>Subtotal:</span>
              <span>
                {calculateSubtotal().toLocaleString()} {formData.currency}
              </span>
            </div>
            {formData.isIncludePPN && (
              <div className='flex justify-between'>
                <span>PPN (11%):</span>
                <span>
                  {calculateTax().toLocaleString()} {formData.currency}
                </span>
              </div>
            )}
            <div className='flex justify-between border-t border-stroke-soft-200 pt-2 font-semibold'>
              <span>Total:</span>
              <span>
                {calculateTotal().toLocaleString()} {formData.currency}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className='flex justify-end space-x-3'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={() => {
            if (mode === 'edit' && invoiceId) {
              router.push(`/invoices/${invoiceId}`);
            } else {
              router.push('/invoices');
            }
          }}
          type='button'
          disabled={isLoading}
        >
          Cancel
        </Button.Root>
        <Button.Root
          variant='primary'
          mode='filled'
          type='submit'
          disabled={isLoading || formData.items.length === 0}
        >
          {isLoading
            ? mode === 'create'
              ? 'Creating...'
              : 'Saving...'
            : mode === 'create'
              ? 'Create Invoice'
              : 'Save Changes'}
        </Button.Root>
      </div>
    </form>
  );
}
