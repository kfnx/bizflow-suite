'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiAddLine, RiArrowLeftLine, RiDeleteBinLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import {
  createQuotationRequestSchema,
  QuotationFormData,
  type CreateQuotationRequest,
  type QuotationItem,
} from '@/lib/validations/quotation';
import { useCustomers } from '@/hooks/use-customers';
import { useProducts } from '@/hooks/use-products';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import QuotationNumberDisplay from '@/components/quotation-number-display';

interface QuotationFormProps {
  initialFormData: QuotationFormData;
  quotationNumber: string;
}

export default function QuotationForm({
  initialFormData,
  quotationNumber,
}: QuotationFormProps) {
  const [formData, setFormData] = useState<QuotationFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch data for form options
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();

  const handleInputChange = useCallback(
    (
      field: keyof Omit<QuotationFormData, 'items'>,
      value: string | boolean,
    ) => {
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
          productName: '',
          quantity: 1,
          unitPrice: 0,
          notes: '',
        },
      ],
    }));
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof QuotationItem, value: string | number) => {
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
    return formData.isIncludePPN ? subtotal * 0.11 : 0;
  }, [calculateSubtotal, formData.isIncludePPN]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateTax();
  }, [calculateSubtotal, calculateTax]);

  const handleSubmit = async (
    e: React.FormEvent,
    status: QUOTATION_STATUS.DRAFT | QUOTATION_STATUS.SUBMITTED,
    quotationNumber: string,
  ) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields for submitted status
      if (status === 'submitted') {
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
      }

      // Transform data for API
      const requestData: QuotationFormData = {
        quotationNumber,
        quotationDate: formData.quotationDate,
        validUntil: formData.validUntil,
        customerId: formData.customerId,
        isIncludePPN: formData.isIncludePPN,
        currency: formData.currency,
        notes: formData.notes,
        termsAndConditions: formData.termsAndConditions,
        status,
        items: formData.items.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          total: item.quantity * item.unitPrice,
          notes: item.notes,
        })),
      };

      const endpoint =
        status === QUOTATION_STATUS.DRAFT
          ? '/api/quotations/save-draft'
          : '/api/quotations';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Failed to create quotation');
        return;
      }

      // Success feedback and navigation
      const successMessage =
        status === QUOTATION_STATUS.DRAFT
          ? 'Quotation saved as draft successfully!'
          : 'Quotation submitted successfully!';
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      router.push('/quotations');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) =>
        handleSubmit(e, QUOTATION_STATUS.SUBMITTED, quotationNumber)
      }
      className='mx-auto w-full max-w-4xl space-y-8'
    >
      {/* Quotation Details */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-6 font-semibold text-text-strong-950'>
          Quotation Details
        </h3>
        <QuotationNumberDisplay quotationNumber={quotationNumber} />
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='quotationDate'>
              Quotation Date <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  type='date'
                  value={formData.quotationDate}
                  onChange={(e) =>
                    handleInputChange('quotationDate', e.target.value)
                  }
                  required
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='validUntil'>
              Valid Until <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='validUntil'
                  type='date'
                  value={formData.validUntil}
                  onChange={(e) =>
                    handleInputChange('validUntil', e.target.value)
                  }
                  required
                  min={formData.quotationDate}
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='customer'>
              Customer <Label.Asterisk />
            </Label.Root>
            <Select.Root
              value={formData.customerId}
              onValueChange={(value) => handleInputChange('customerId', value)}
            >
              <Select.Trigger id='customer'>
                <Select.Value placeholder='Select a customer' />
              </Select.Trigger>
              <Select.Content>
                {customers?.data?.map((customer) => (
                  <Select.Item key={customer.id} value={customer.id}>
                    {customer.name} ({customer.code})
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='currency'>Currency</Label.Root>
            <Select.Root
              value={formData.currency}
              onValueChange={(value) => handleInputChange('currency', value)}
            >
              <Select.Trigger id='currency'>
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

          <div className='flex flex-col gap-1 md:col-span-2'>
            <Label.Root htmlFor='notes'>Notes</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='notes'
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder='Additional notes...'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1 md:col-span-2'>
            <Label.Root htmlFor='termsAndConditions'>
              Terms and Conditions
            </Label.Root>
            <Textarea.Root
              id='termsAndConditions'
              rows={3}
              value={formData.termsAndConditions || ''}
              onChange={(e) =>
                handleInputChange('termsAndConditions', e.target.value)
              }
              placeholder='Enter terms and conditions...'
            />
          </div>

          <div className='flex items-center space-x-2'>
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

      {/* Quotation Items */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-lg font-semibold text-text-strong-950'>Items</h3>
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

        {formData.items.length === 0 ? (
          <div className='py-8 text-center text-text-sub-600'>
            No items added yet. Click &quot;Add Item&quot; to get started.
          </div>
        ) : (
          <div className='space-y-4'>
            {formData.items.map((item, index) => (
              <div
                key={index}
                className='grid grid-cols-12 items-end gap-2 border-b border-stroke-soft-200 pb-4'
              >
                <div className='col-span-12 flex flex-col gap-1 md:col-span-4'>
                  <Label.Root htmlFor={`product-${index}`}>Product</Label.Root>
                  <Select.Root
                    value={item.productId}
                    onValueChange={(value) => {
                      const product = products?.data?.find(
                        (p) => p.id === value,
                      );
                      updateItem(index, 'productId', value);
                      updateItem(index, 'productName', product?.name || '');
                      updateItem(
                        index,
                        'unitPrice',
                        Number(product?.price) || 0,
                      );
                    }}
                  >
                    <Select.Trigger id={`product-${index}`}>
                      <Select.Value placeholder='Select product' />
                    </Select.Trigger>
                    <Select.Content>
                      {products?.data?.map((product) => (
                        <Select.Item key={product.id} value={product.id}>
                          {product.name} ({product.code})
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                </div>

                <div className='col-span-6 flex flex-col gap-1 md:col-span-2'>
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

                <div className='col-span-6 flex flex-col gap-1 md:col-span-3'>
                  <Label.Root htmlFor={`unitPrice-${index}`}>
                    Unit Price
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
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

                <div className='col-span-10 flex flex-col gap-1 md:col-span-2'>
                  <Label.Root>Total</Label.Root>
                  <div className='text-sm rounded-md border border-stroke-soft-200 bg-bg-weak-50 px-3 py-2'>
                    {(item.quantity * item.unitPrice).toLocaleString()}
                  </div>
                </div>

                <div className='col-span-2 md:col-span-1'>
                  <Button.Root
                    variant='error'
                    mode='stroke'
                    size='small'
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
      <div className='flex justify-end space-x-3 border-t border-stroke-soft-200 pt-6'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={() => router.push('/quotations')}
          type='button'
          disabled={isLoading}
        >
          Cancel
        </Button.Root>
        <Button.Root
          variant='neutral'
          mode='filled'
          onClick={(e) =>
            handleSubmit(e, QUOTATION_STATUS.DRAFT, quotationNumber)
          }
          type='button'
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save as Draft'}
        </Button.Root>
        <Button.Root
          variant='primary'
          mode='filled'
          type='submit'
          disabled={isLoading || formData.items.length === 0}
        >
          {isLoading ? 'Submitting...' : 'Submit Quotation'}
        </Button.Root>
      </div>
    </form>
  );
}
