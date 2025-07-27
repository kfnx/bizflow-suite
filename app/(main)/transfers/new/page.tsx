'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiArrowRightLine,
  RiBox1Line,
  RiCalendarLine,
  RiDeleteBinLine,
  RiExchangeLine,
  RiFileTextLine,
  RiHashtag,
  RiStoreLine,
  RiTruckLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useProducts } from '@/hooks/use-products';
import { useCreateTransfer } from '@/hooks/use-transfers';
import { useWarehouses } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';
import { Root as TextareaRoot } from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface TransferItem {
  id: string;
  productId: string;
  quantity: string;
  notes: string;
}

interface TransferFormData {
  warehouseIdFrom: string;
  warehouseIdTo: string;
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  transferDate: string;
  invoiceId: string;
  deliveryId: string;
  notes: string;
  items: TransferItem[];
}

interface CreateTransferData {
  warehouseIdFrom?: string;
  warehouseIdTo: string;
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  transferDate: string;
  invoiceId?: string;
  deliveryId?: string;
  notes?: string;
  items: {
    productId: string;
    quantity: number;
    notes?: string;
  }[];
}

export default function NewTransferPage() {
  const router = useRouter();
  const createTransferMutation = useCreateTransfer();

  const { data: productsData, isLoading: isLoadingProducts } = useProducts({
    limit: 1000,
    status: 'in_stock',
  });

  const { data: warehousesData, isLoading: isLoadingWarehouses } =
    useWarehouses({
      limit: 100,
      isActive: 'true',
    });

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TransferFormData>({
    warehouseIdFrom: '',
    warehouseIdTo: '',
    movementType: 'transfer',
    transferDate: new Date().toISOString().split('T')[0],
    invoiceId: '',
    deliveryId: '',
    notes: '',
    items: [],
  });

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const products = productsData?.data || [];
  const warehouses = warehousesData?.data || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.warehouseIdTo) {
      errors.warehouseIdTo = 'Destination warehouse is required';
    }

    if (formData.movementType === 'transfer' && !formData.warehouseIdFrom) {
      errors.warehouseIdFrom = 'Source warehouse is required for transfers';
    }

    if (!formData.transferDate) {
      errors.transferDate = 'Transfer date is required';
    }

    if (formData.items.length === 0) {
      errors.items = 'At least one product item is required';
    }

    // Validate each item
    formData.items.forEach((item, index) => {
      if (!item.productId) {
        errors[`items.${index}.productId`] = 'Product is required';
      }
      if (!item.quantity || parseInt(item.quantity) <= 0) {
        errors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsLoading(true);

    try {
      const submitData: CreateTransferData = {
        warehouseIdFrom: formData.warehouseIdFrom || undefined,
        warehouseIdTo: formData.warehouseIdTo,
        movementType: formData.movementType,
        transferDate: formData.transferDate,
        invoiceId: formData.invoiceId || undefined,
        deliveryId: formData.deliveryId || undefined,
        notes: formData.notes || undefined,
        items: formData.items.map((item) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity),
          notes: item.notes || undefined,
        })),
      };

      await createTransferMutation.mutateAsync(submitData as any);
      toast.success('Transfer created successfully!');
      router.push('/transfers');
    } catch (error) {
      console.error('Error creating transfer:', error);
      toast.error('Failed to create transfer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof Omit<TransferFormData, 'items'>,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddItem = () => {
    const newItem: TransferItem = {
      id: `item-${Date.now()}`,
      productId: '',
      quantity: '',
      notes: '',
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== itemId),
    }));
  };

  const handleItemChange = (
    itemId: string,
    field: keyof TransferItem,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const getMovementTypeDescription = (type: string) => {
    switch (type) {
      case 'in':
        return 'Stock In - Receiving products from external source';
      case 'out':
        return 'Stock Out - Sending products to external destination';
      case 'transfer':
        return 'Transfer - Moving products between warehouses';
      case 'adjustment':
        return 'Adjustment - Correcting stock quantities';
      default:
        return '';
    }
  };

  const getSelectedProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? `${product.code} - ${product.name}` : '';
  };

  if (isLoadingProducts || isLoadingWarehouses) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  return (
    <div className='flex h-full flex-col'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiTruckLine className='size-6' />
          </div>
        }
        title='New Transfer'
        description='Create a new stock transfer or movement.'
      >
        <BackButton href='/transfers' label='Back to Transfers' />
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form
          onSubmit={handleSubmit}
          className='mx-auto w-full max-w-4xl space-y-8'
        >
          {/* Transfer Information */}
          <div className='space-y-4 rounded-lg border border-stroke-soft-200 p-6'>
            <h3 className='text-lg text-gray-900 font-medium'>
              Transfer Information
            </h3>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='movementType'>
                  Movement Type <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.movementType}
                  onValueChange={(value) =>
                    handleInputChange('movementType', value as any)
                  }
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='in'>Stock In</Select.Item>
                    <Select.Item value='out'>Stock Out</Select.Item>
                    <Select.Item value='transfer'>Transfer</Select.Item>
                    <Select.Item value='adjustment'>Adjustment</Select.Item>
                  </Select.Content>
                </Select.Root>
                <p className='text-xs text-gray-500'>
                  {getMovementTypeDescription(formData.movementType)}
                </p>
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='transferDate'>
                  Transfer Date <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiCalendarLine} />
                    <Input.Input
                      id='transferDate'
                      type='date'
                      value={formData.transferDate}
                      onChange={(e) =>
                        handleInputChange('transferDate', e.target.value)
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
                {validationErrors.transferDate && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.transferDate}
                  </div>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='warehouseIdFrom'>
                  Source Warehouse
                  {formData.movementType === 'transfer' && <Label.Asterisk />}
                </Label.Root>
                <Select.Root
                  value={formData.warehouseIdFrom}
                  onValueChange={(value) =>
                    handleInputChange('warehouseIdFrom', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Select source warehouse' />
                  </Select.Trigger>
                  <Select.Content>
                    {warehouses.map((warehouse) => (
                      <Select.Item key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {validationErrors.warehouseIdFrom && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.warehouseIdFrom}
                  </div>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='warehouseIdTo'>
                  Destination Warehouse <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.warehouseIdTo}
                  onValueChange={(value) =>
                    handleInputChange('warehouseIdTo', value)
                  }
                >
                  <Select.Trigger>
                    <Select.Value placeholder='Select destination warehouse' />
                  </Select.Trigger>
                  <Select.Content>
                    {warehouses.map((warehouse) => (
                      <Select.Item key={warehouse.id} value={warehouse.id}>
                        {warehouse.name}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                {validationErrors.warehouseIdTo && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.warehouseIdTo}
                  </div>
                )}
              </div>
            </div>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='invoiceId'>Invoice ID</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiFileTextLine} />
                    <Input.Input
                      id='invoiceId'
                      value={formData.invoiceId}
                      onChange={(e) =>
                        handleInputChange('invoiceId', e.target.value)
                      }
                      placeholder='Enter invoice ID (optional)'
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='deliveryId'>Delivery ID</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiTruckLine} />
                    <Input.Input
                      id='deliveryId'
                      value={formData.deliveryId}
                      onChange={(e) =>
                        handleInputChange('deliveryId', e.target.value)
                      }
                      placeholder='Enter delivery ID (optional)'
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='notes'>Notes</Label.Root>
              <TextareaRoot
                id='notes'
                value={formData.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('notes', e.target.value)
                }
                placeholder='Enter transfer notes (optional)'
                rows={3}
              />
            </div>
          </div>

          {/* Transfer Items */}
          <div className='space-y-4 rounded-lg border border-stroke-soft-200 p-6'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg text-gray-900 font-medium'>
                Transfer Items
              </h3>
              <Button.Root
                type='button'
                variant='primary'
                size='small'
                onClick={handleAddItem}
              >
                <RiAddLine className='size-4' />
                Add Item
              </Button.Root>
            </div>

            {validationErrors.items && (
              <div className='text-sm text-red-600'>
                {validationErrors.items}
              </div>
            )}

            {formData.items.length === 0 ? (
              <div className='text-gray-500 py-8 text-center'>
                No items added yet. Click &quot;Add Item&quot; to start.
              </div>
            ) : (
              <div className='space-y-4'>
                {formData.items.map((item, index) => (
                  <div
                    key={item.id}
                    className='rounded-lg border border-stroke-soft-200 p-4'
                  >
                    <div className='mb-4 flex items-center justify-between'>
                      <h4 className='text-gray-900 font-medium'>
                        Item {index + 1}
                      </h4>
                      <Button.Root
                        type='button'
                        variant='neutral'
                        mode='ghost'
                        size='small'
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <RiDeleteBinLine className='size-4' />
                        Remove
                      </Button.Root>
                    </div>

                    <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor={`product-${item.id}`}>
                          Product <Label.Asterisk />
                        </Label.Root>
                        <Select.Root
                          value={item.productId}
                          onValueChange={(value) =>
                            handleItemChange(item.id, 'productId', value)
                          }
                        >
                          <Select.Trigger>
                            <Select.Value placeholder='Select product' />
                          </Select.Trigger>
                          <Select.Content>
                            {products.map((product) => (
                              <Select.Item key={product.id} value={product.id}>
                                {product.code} - {product.name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select.Root>
                        {validationErrors[`items.${index}.productId`] && (
                          <div className='text-xs text-red-600'>
                            {validationErrors[`items.${index}.productId`]}
                          </div>
                        )}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor={`quantity-${item.id}`}>
                          Quantity <Label.Asterisk />
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiHashtag} />
                            <Input.Input
                              id={`quantity-${item.id}`}
                              type='number'
                              min='1'
                              value={item.quantity}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  'quantity',
                                  e.target.value,
                                )
                              }
                              placeholder='Enter quantity'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                        {validationErrors[`items.${index}.quantity`] && (
                          <div className='text-xs text-red-600'>
                            {validationErrors[`items.${index}.quantity`]}
                          </div>
                        )}
                      </div>

                      <div className='flex flex-col gap-2'>
                        <Label.Root htmlFor={`notes-${item.id}`}>
                          Item Notes
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiFileTextLine} />
                            <Input.Input
                              id={`notes-${item.id}`}
                              value={item.notes}
                              onChange={(e) =>
                                handleItemChange(
                                  item.id,
                                  'notes',
                                  e.target.value,
                                )
                              }
                              placeholder='Enter item notes (optional)'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={() => router.push('/transfers')}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Transfer'}
            </Button.Root>
          </div>
        </form>
      </div>
    </div>
  );
}
