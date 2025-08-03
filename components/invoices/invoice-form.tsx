'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiArrowLeftLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiHashtag,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
} from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { InvoiceFormData, type InvoiceItem } from '@/lib/validations/invoice';
import { useCustomers } from '@/hooks/use-customers';
import { useInvoiceDetail } from '@/hooks/use-invoices';
import { useInvoiceNumber } from '@/hooks/use-invoice-number';
import { useProducts } from '@/hooks/use-products';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { CustomerSelectWithAdd } from '@/components/customers/customer-select-with-add';
import InvoiceNumberDisplay from '@/components/invoices/invoice-number-display';

export type InvoiceFormMode = 'create' | 'edit';

interface InvoiceFormProps {
  mode: InvoiceFormMode;
  invoiceId?: string;
  initialFormData?: InvoiceFormData;
}

const emptyFormData: InvoiceFormData = {
  invoiceDate: '',
  dueDate: '',
  customerId: '',
  currency: 'IDR',
  status: 'draft',
  paymentMethod: '',
  notes: '',
  items: [],
};

export function InvoiceForm({ mode, invoiceId, initialFormData }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(
    initialFormData || emptyFormData,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(mode === 'create');

  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch data
  const { data: invoice, isLoading: isLoadingInvoice } = useInvoiceDetail(
    invoiceId || '',
    { enabled: mode === 'edit' && !!invoiceId }
  );
  const { data: invoiceNumber, isLoading: isLoadingInvoiceNumber } = useInvoiceNumber();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();

  // Initialize form data from invoice for edit mode
  useEffect(() => {
    if (mode === 'edit' && invoice?.data && !isInitialized) {
      const invoiceData = invoice.data;
      setFormData({
        invoiceDate: invoiceData.invoiceDate || '',
        dueDate: invoiceData.dueDate || '',
        customerId: invoiceData.customerId || '',
        currency: invoiceData.currency || 'IDR',
        status: invoiceData.status as 'draft' | 'sent' | 'paid' | 'void',
        paymentMethod: invoiceData.paymentMethod || '',
        notes: invoiceData.notes || '',
        items:
          invoiceData.items?.map((item: any) => ({
            productId: item.productId,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
            paymentTerms: item.paymentTerms || '',
            termsAndConditions: item.termsAndConditions || '',
            notes: item.notes || '',
          })) || [],
      });
      setIsInitialized(true);
    }
  }, [invoice, isInitialized, mode]);

  // Initialize form data for create mode
  useEffect(() => {
    if (mode === 'create' && initialFormData && !isInitialized) {
      setFormData(initialFormData);
      setIsInitialized(true);
    }
  }, [initialFormData, isInitialized, mode]);

  const handleInputChange = useCallback(
    (field: keyof Omit<InvoiceFormData, 'items'>, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const addItem = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          productId: '',
          quantity: 1,
          unitPrice: 0,
          paymentTerms: '',
          termsAndConditions: '',
          notes: '',
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
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  }, [formData.items]);

  const calculateTax = useCallback(() => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.11; // 11% tax
  }, [calculateSubtotal]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateTax();
  }, [calculateSubtotal, calculateTax]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.customerId) {
        toast.error('Please select a customer');
        return;
      }
      if (formData.items.length === 0) {
        toast.error('Please add at least one item');
        return;
      }
      if (
        formData.items.some(
          (item) =>
            !item.productId || item.quantity <= 0 || item.unitPrice <= 0,
        )
      ) {
        toast.error('Please complete all item details');
        return;
      }

      const url = mode === 'create' ? '/api/invoices' : `/api/invoices/${invoiceId}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || `Failed to ${mode === 'create' ? 'create' : 'update'} invoice`);
        return;
      }

      toast.success(`Invoice ${mode === 'create' ? 'created' : 'updated'} successfully!`);
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
    <form onSubmit={handleSubmit} className='space-y-6'>
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
                />
              </Input.Wrapper>
            </Input.Root>
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
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='customer'>
              Customer <Label.Asterisk />
            </Label.Root>
            <CustomerSelectWithAdd
              value={formData.customerId}
              onValueChange={(value) => handleInputChange('customerId', value)}
              placeholder='Select a customer'
              required
            />
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
            <Label.Root htmlFor='paymentMethod'>Payment Method</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiMoneyDollarCircleLine} />
                <Input.Input
                  id='paymentMethod'
                  value={formData.paymentMethod || ''}
                  onChange={(e) =>
                    handleInputChange('paymentMethod', e.target.value)
                  }
                  placeholder='Enter payment method'
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
        </div>
      </div>

      {/* Invoice Items */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
          Items
        </h3>

        {formData.items.length === 0 ? (
          <div className='py-8 text-center text-text-sub-600'>
            No items added yet. Click &quot;Add Item&quot; to get started.
          </div>
        ) : (
          <div className='space-y-4'>
            {formData.items.map((item, index) => (
              <div
                key={index}
                className='grid grid-cols-12 items-end gap-2 pb-4'
              >
                <div className='col-span-12 flex flex-col gap-1 lg:col-span-4'>
                  <Label.Root htmlFor={`product-${index}`}>Product</Label.Root>
                  <Select.Root
                    value={item.productId}
                    onValueChange={(value) => {
                      const product = products?.data?.find(
                        (p) => p.id === value,
                      );
                      updateItem(index, 'productId', value);
                      if (product) {
                        updateItem(
                          index,
                          'unitPrice',
                          Number(product.price) || 0,
                        );
                      }
                    }}
                  >
                    <Select.Trigger id={`product-${index}`}>
                      <Select.TriggerIcon as={RiShoppingCartLine} />
                      <Select.Value placeholder='Select product' />
                    </Select.Trigger>
                    <Select.Content>
                      {products?.data?.map((product) => (
                        <Select.Item key={product.id} value={product.id}>
                          {product.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                <div className='col-span-3 flex flex-col gap-1 lg:col-span-1'>
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
                          updateItem(index, 'quantity', Number(e.target.value))
                        }
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className='col-span-9 flex flex-col gap-1 lg:col-span-3'>
                  <Label.Root htmlFor={`unitPrice-${index}`}>
                    Unit Price
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiMoneyDollarCircleLine} />
                      <Input.Input
                        id={`unitPrice-${index}`}
                        type='number'
                        min='0'
                        step='1'
                        value={item.unitPrice}
                        onChange={(e) =>
                          updateItem(index, 'unitPrice', Number(e.target.value))
                        }
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className='col-span-10 flex flex-col gap-1 lg:col-span-3'>
                  <Label.Root>Total</Label.Root>
                  <div className='text-sm rounded-md border border-stroke-soft-200 bg-bg-weak-50 px-3 py-2'>
                    {(item.quantity * item.unitPrice).toLocaleString()}
                  </div>
                </div>

                <div className='col-span-2 lg:col-span-1'>
                  <Button.Root
                    variant='error'
                    mode='stroke'
                    onClick={() => removeItem(index)}
                    type='button'
                    className='w-full'
                  >
                    <RiDeleteBinLine className='size-4' />
                  </Button.Root>
                </div>

                <div className='col-span-12 flex flex-col gap-1'>
                  <Label.Root htmlFor={`notes-${index}`}>Notes</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiHashtag} />
                      <Input.Input
                        id={`notes-${index}`}
                        value={item.notes || ''}
                        onChange={(e) =>
                          updateItem(index, 'notes', e.target.value)
                        }
                        placeholder='Item notes...'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
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
            <div className='flex justify-between'>
              <span>Tax (11%):</span>
              <span>
                {calculateTax().toLocaleString()} {formData.currency}
              </span>
            </div>
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
      <div className='flex justify-end space-x-3 border-t border-stroke-soft-200 pt-6'>
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
            ? (mode === 'create' ? 'Creating...' : 'Saving...')
            : (mode === 'create' ? 'Create Invoice' : 'Save Changes')
          }
        </Button.Root>
      </div>
    </form>
  );
}