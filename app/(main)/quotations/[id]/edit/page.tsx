'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiArrowLeftLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiEditLine,
  RiGlobalLine,
  RiHashtag,
  RiMapPin2Line,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiUserLine,
} from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { UpdateQuotationRequest } from '@/lib/validations/quotation';
import { useBranches } from '@/hooks/use-branches';
import { useCustomers } from '@/hooks/use-customers';
import { useProducts } from '@/hooks/use-products';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface QuotationItem {
  id?: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

interface QuotationFormData {
  quotationNumber: string;
  quotationDate: string;
  validUntil: string;
  customerId: string;
  branchId: string;
  isIncludePPN: boolean;
  currency: string;
  notes?: string;
  termsAndConditions?: string;
  items: QuotationItem[];
}

export default function EditQuotationPage() {
  const params = useParams();
  const quotationId = params.id as string;
  const [formData, setFormData] = useState<QuotationFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const router = useRouter();
  const queryClient = useQueryClient();

  // Fetch data for form options
  const { data: branches } = useBranches();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();

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
          branchId: quotationData.branchId || '',
          isIncludePPN: quotationData.isIncludePPN,
          currency: quotationData.currency,
          notes: quotationData.notes || '',
          termsAndConditions: quotationData.termsAndConditions || '',
          items: quotationData.items.map((item: any) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            quantity: Number(item.quantity),
            unitPrice: Number(item.unitPrice),
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

  const handleInputChange = useCallback(
    (
      field: keyof Omit<QuotationFormData, 'items'>,
      value: string | boolean,
    ) => {
      setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
    },
    [],
  );

  const addItem = useCallback(() => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            items: [
              ...prev.items,
              {
                productId: '',
                name: '',
                quantity: 1,
                unitPrice: 0,
                notes: '',
              },
            ],
          }
        : null,
    );
  }, []);

  const updateItem = useCallback(
    (index: number, field: keyof QuotationItem, value: string | number) => {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.map((item, i) =>
                i === index ? { ...item, [field]: value } : item,
              ),
            }
          : null,
      );
    },
    [],
  );

  const removeItem = useCallback((index: number) => {
    setFormData((prev) =>
      prev
        ? {
            ...prev,
            items: prev.items.filter((_, i) => i !== index),
          }
        : null,
    );
  }, []);

  const calculateSubtotal = useCallback(() => {
    if (!formData) return 0;
    return formData.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );
  }, [formData]);

  const calculateTax = useCallback(() => {
    if (!formData) return 0;
    const subtotal = calculateSubtotal();
    return formData.isIncludePPN ? subtotal * 0.11 : 0;
  }, [calculateSubtotal, formData]);

  const calculateTotal = useCallback(() => {
    return calculateSubtotal() + calculateTax();
  }, [calculateSubtotal, calculateTax]);

  const handleSubmit = async (
    e: React.FormEvent,
    status: QUOTATION_STATUS.DRAFT | QUOTATION_STATUS.SUBMITTED,
  ) => {
    e.preventDefault();
    if (!formData) return;

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

      if (
        ![QUOTATION_STATUS.DRAFT, QUOTATION_STATUS.SUBMITTED].includes(status)
      ) {
        toast.error('Can only submit or save draft');
        return;
      }

      // Transform data for API
      const requestData: UpdateQuotationRequest = {
        quotationDate: formData.quotationDate,
        validUntil: formData.validUntil,
        status,
        customerId: formData.customerId,
        branchId: formData.branchId,
        isIncludePPN: formData.isIncludePPN,
        currency: formData.currency,
        notes: formData.notes,
        termsAndConditions: formData.termsAndConditions,
        items: formData.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes,
        })),
      };

      const response = await fetch(`/api/quotations/${quotationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Failed to update quotation');
        return;
      }

      // Success feedback and navigation
      const successMessage =
        status === 'draft'
          ? 'Quotation updated successfully!'
          : 'Quotation updated and submitted successfully!';
      toast.success(successMessage);
      queryClient.invalidateQueries({ queryKey: ['quotations'] });
      router.push('/quotations');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className='flex flex-1 items-center justify-center'>
        <div className='text-center'>
          <div className='border-primary-600 mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2'></div>
          <p className='text-text-sub-600'>Loading quotation...</p>
        </div>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

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
        <form
          onSubmit={(e) => handleSubmit(e, QUOTATION_STATUS.SUBMITTED)}
          className='space-y-6'
        >
          {/* Quotation Details */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <h3 className='text-lg mb-6 font-semibold text-text-strong-950'>
              Quotation Details
            </h3>
            <div className='mb-4 flex flex-col gap-1'>
              <Label.Root htmlFor='quotationNumber'>
                Quotation Number
              </Label.Root>
              <div className='text-sm p-2 text-text-sub-600'>
                {formData.quotationNumber}
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='quotationDate'>
                  Quotation Date <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiCalendarLine} />
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
                    <Input.Icon as={RiCalendarLine} />
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
                  onValueChange={(value) =>
                    handleInputChange('customerId', value)
                  }
                >
                  <Select.Trigger id='customer'>
                    <Select.TriggerIcon as={RiUserLine} />
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
                <Label.Root htmlFor='branchId'>
                  Branch <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.branchId}
                  onValueChange={(value) =>
                    handleInputChange('branchId', value)
                  }
                >
                  <Select.Trigger id='branchId'>
                    <Select.TriggerIcon as={RiMapPin2Line} />
                    <Select.Value placeholder='Select branch' />
                  </Select.Trigger>
                  <Select.Content>
                    {branches?.data?.map((branch) => (
                      <Select.Item key={branch.id} value={branch.id}>
                        {branch.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className='flex flex-col gap-1'>
                <Label.Root htmlFor='currency'>Currency</Label.Root>
                <Select.Root
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange('currency', value)
                  }
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

              <div className='flex flex-col gap-1 md:col-span-2'>
                <Label.Root htmlFor='notes'>Notes</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiHashtag} />
                    <Input.Input
                      id='notes'
                      value={formData.notes || ''}
                      onChange={(e) =>
                        handleInputChange('notes', e.target.value)
                      }
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
                <label
                  htmlFor='includePPN'
                  className='text-sm text-text-sub-600'
                >
                  Include PPN (11% tax)
                </label>
              </div>
            </div>
          </div>

          {/* Quotation Items */}
          <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-text-strong-950'>
                Items
              </h3>
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
                    className='grid grid-cols-12 items-end gap-2 pb-4'
                  >
                    <div className='col-span-12 flex flex-col gap-1 md:col-span-4'>
                      <Label.Root htmlFor={`product-${index}`}>
                        Product
                      </Label.Root>
                      <Select.Root
                        value={item.productId}
                        onValueChange={(value) => {
                          const product = products?.data?.find(
                            (p) => p.id === value,
                          );
                          updateItem(index, 'productId', value);
                          updateItem(index, 'name', product?.name || '');
                          updateItem(
                            index,
                            'unitPrice',
                            Number(product?.price) || 0,
                          );
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

                    <div className='col-span-6 flex flex-col gap-1 md:col-span-2'>
                      <Label.Root htmlFor={`quantity-${index}`}>
                        Quantity
                      </Label.Root>
                      <Input.Root>
                        <Input.Wrapper>
                          <Input.Icon as={RiHashtag} />
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

                    <div className='col-span-6 flex flex-col gap-1 md:col-span-3'>
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
                              updateItem(
                                index,
                                'unitPrice',
                                Number(e.target.value),
                              )
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
              onClick={(e) => handleSubmit(e, QUOTATION_STATUS.DRAFT)}
              type='button'
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Draft'}
            </Button.Root>
            <Button.Root
              variant='primary'
              mode='filled'
              type='submit'
              disabled={isLoading || formData.items.length === 0}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </Button.Root>
          </div>
        </form>
      </div>
    </PermissionGate>
  );
}
