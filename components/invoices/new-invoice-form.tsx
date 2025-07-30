'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiGlobalLine,
  RiHashtag,
  RiMapPin2Line,
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
} from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { InvoiceFormData, type InvoiceItem } from '@/lib/validations/invoice';
import { useBranches } from '@/hooks/use-branches';
import { useCustomers } from '@/hooks/use-customers';
import { useProducts } from '@/hooks/use-products';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { CustomerSelectWithAdd } from '@/components/customers/customer-select-with-add';

interface InvoiceFormProps {
  initialFormData: InvoiceFormData;
}

export function NewInvoiceForm({ initialFormData }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceFormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: branches } = useBranches();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();

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
      if (!formData.branchId) {
        toast.error('Please select a branch');
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

      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Failed to create invoice');
        return;
      }

      toast.success('Invoice created successfully!');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      router.push('/invoices');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* Invoice Details */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-6 font-semibold text-text-strong-950'>
          Invoice Details
        </h3>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='invoiceDate'>
              Invoice Date <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiCalendarLine} />
                <Input.Input
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
            <Label.Root htmlFor='branchId'>
              Branch <Label.Asterisk />
            </Label.Root>
            <Select.Root
              value={formData.branchId}
              onValueChange={(value) => handleInputChange('branchId', value)}
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

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='paymentMethod'>Payment Method</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiMoneyDollarCircleLine} />
                <Input.Input
                  id='paymentMethod'
                  value={formData.paymentMethod}
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
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiHashtag} />
                <Input.Input
                  id='notes'
                  value={formData.notes || ''}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  placeholder='Additional notes...'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>
        </div>
      </div>

      {/* Invoice Items */}
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
                className='grid grid-cols-12 items-end gap-2 pb-4'
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
          onClick={() => router.push('/invoices')}
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
          {isLoading ? 'Creating...' : 'Create Invoice'}
        </Button.Root>
      </div>
    </form>
  );
}
