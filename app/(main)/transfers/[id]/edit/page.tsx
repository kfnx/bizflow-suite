'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiBox1Line,
  RiCalendarLine,
  RiDeleteBinLine,
  RiEditLine,
  RiExchangeLine,
  RiFileTextLine,
  RiHashtag,
  RiStoreLine,
  RiTruckLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import { useProducts } from '@/hooks/use-products';
import {
  useTransfer,
  useUpdateTransfer,
  type UpdateTransferData,
} from '@/hooks/use-transfers';
import { useWarehouses } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface TransferItemData {
  id?: string;
  productId: string;
  quantity: number;
  quantityTransferred?: number;
  notes?: string;
}

interface EditTransferData {
  transferNumber: string;
  warehouseIdFrom: string;
  warehouseIdTo: string;
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  status: string;
  transferDate: string;
  invoiceId: string;
  deliveryId: string;
  notes: string;
  items: TransferItemData[];
}

interface EditTransferPageProps {
  params: {
    id: string;
  };
}

export default function EditTransferPage({ params }: EditTransferPageProps) {
  const router = useRouter();
  const {
    data: transferData,
    isLoading: transferLoading,
    error: transferError,
  } = useTransfer(params.id);
  const updateTransferMutation = useUpdateTransfer();

  const { data: productsData } = useProducts({
    limit: 1000,
    status: 'in_stock',
  });

  const { data: warehousesData, isLoading: isLoadingWarehouses } =
    useWarehouses({
      limit: 100,
      isActive: 'true',
    });

  const [formData, setFormData] = useState<EditTransferData>({
    transferNumber: '',
    warehouseIdFrom: '',
    warehouseIdTo: '',
    movementType: 'transfer',
    status: 'pending',
    transferDate: '',
    invoiceId: '',
    deliveryId: '',
    notes: '',
    items: [],
  });

  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const products = productsData?.data || [];
  const warehouses = warehousesData?.data || [];

  // Populate form data when transfer data is loaded
  useEffect(() => {
    if (transferData) {
      setFormData({
        transferNumber: transferData.transferNumber || '',
        warehouseIdFrom: transferData.warehouseIdFrom || '',
        warehouseIdTo: transferData.warehouseIdTo || '',
        movementType: transferData.movementType || 'transfer',
        status: transferData.status || 'pending',
        transferDate: transferData.transferDate
          ? transferData.transferDate.split('T')[0]
          : '',
        invoiceId: transferData.invoiceId || '',
        deliveryId: transferData.deliveryId || '',
        notes: transferData.notes || '',
        items:
          transferData.items?.map((item) => ({
            id: item.id,
            productId: item.productId,
            quantity: item.quantity,
            quantityTransferred: item.quantityTransferred,
            notes: item.notes,
          })) || [],
      });
    }
  }, [transferData]);

  if (transferLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading transfer details...
      </div>
    );
  }

  if (transferError) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Error loading transfer</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            {transferError.message || 'Failed to load transfer details'}
          </p>
          <Button.Root
            className='mt-4'
            onClick={() => router.push('/transfers')}
          >
            Back to Transfers
          </Button.Root>
        </div>
      </div>
    );
  }

  if (!transferData) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        <div className='text-center'>
          <h3 className='text-lg font-medium'>Transfer not found</h3>
          <p className='text-sm mt-2 text-text-sub-600'>
            The transfer you&apos;re looking for doesn&apos;t exist or has been
            deleted.
          </p>
          <Button.Root
            className='mt-4'
            onClick={() => router.push('/transfers')}
          >
            Back to Transfers
          </Button.Root>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
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
      if (!item.quantity || item.quantity <= 0) {
        errors[`items.${index}.quantity`] = 'Quantity must be greater than 0';
      }
    });

    if (
      formData.warehouseIdFrom &&
      formData.warehouseIdTo &&
      formData.warehouseIdFrom === formData.warehouseIdTo
    ) {
      errors.warehouseIdTo =
        'Source and destination warehouses must be different';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const submitData: UpdateTransferData = {
      transferNumber: formData.transferNumber,
      warehouseIdFrom: formData.warehouseIdFrom || undefined,
      warehouseIdTo: formData.warehouseIdTo,
      movementType: formData.movementType,
      status: formData.status,
      transferDate: formData.transferDate,
      invoiceId: formData.invoiceId.trim() || undefined,
      deliveryId: formData.deliveryId.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      items: formData.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        quantityTransferred: item.quantityTransferred || 0,
        notes: item.notes?.trim() || undefined,
      })),
    };

    try {
      await updateTransferMutation.mutateAsync({
        id: params.id,
        data: submitData,
      });

      toast.success('Transfer updated successfully');
      router.push(`/transfers/${params.id}`);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'An error occurred while updating the transfer';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const handleInputChange = (
    field: keyof Omit<EditTransferData, 'items'>,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      setError(null);
    }
  };

  const handleAddItem = () => {
    const newItem: TransferItemData = {
      productId: '',
      quantity: 1,
      quantityTransferred: 0,
      notes: '',
    };
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof TransferItemData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const isLoading = updateTransferMutation.isPending;

  const getMovementTypeDescription = (type: string) => {
    switch (type) {
      case 'in':
        return 'Stock incoming to warehouse (from external source)';
      case 'out':
        return 'Stock outgoing from warehouse (to external destination)';
      case 'transfer':
        return 'Stock transfer between warehouses';
      case 'adjustment':
        return 'Manual stock adjustment (correction)';
      default:
        return '';
    }
  };

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='Edit Transfer'
        description={`Update transfer ${transferData.transferNumber}.`}
      >
        <BackButton href={`/transfers/${params.id}`} label='Back to Transfer' />
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
            {error && (
              <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                {error}
              </div>
            )}

            {/* Movement Type */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Movement Type
              </h3>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='movementType'>
                  Type of Movement <Label.Asterisk />
                </Label.Root>
                <Select.Root
                  value={formData.movementType}
                  onValueChange={(value) =>
                    handleInputChange('movementType', value)
                  }
                >
                  <Select.Trigger>
                    <Select.TriggerIcon as={RiExchangeLine} />
                    <Select.Value placeholder='Select movement type' />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value='transfer'>
                      <div className='flex items-center gap-2'>
                        <RiExchangeLine className='size-4' />
                        <div>
                          <div className='font-medium'>Transfer</div>
                          <div className='text-xs text-text-sub-600'>
                            Between warehouses
                          </div>
                        </div>
                      </div>
                    </Select.Item>
                    <Select.Item value='in'>
                      <div className='flex items-center gap-2'>
                        <RiBox1Line className='size-4' />
                        <div>
                          <div className='font-medium'>Stock In</div>
                          <div className='text-xs text-text-sub-600'>
                            From external source
                          </div>
                        </div>
                      </div>
                    </Select.Item>
                    <Select.Item value='out'>
                      <div className='flex items-center gap-2'>
                        <RiTruckLine className='size-4' />
                        <div>
                          <div className='font-medium'>Stock Out</div>
                          <div className='text-xs text-text-sub-600'>
                            To external destination
                          </div>
                        </div>
                      </div>
                    </Select.Item>
                    <Select.Item value='adjustment'>
                      <div className='flex items-center gap-2'>
                        <RiFileTextLine className='size-4' />
                        <div>
                          <div className='font-medium'>Adjustment</div>
                          <div className='text-xs text-text-sub-600'>
                            Manual correction
                          </div>
                        </div>
                      </div>
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
                <p className='text-sm text-text-sub-600'>
                  {getMovementTypeDescription(formData.movementType)}
                </p>
              </div>
            </div>

            <Divider.Root />

            {/* Transfer Date */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Transfer Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
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
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.transferDate && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.transferDate}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='status'>Status</Label.Root>
                  <Select.Root
                    value={formData.status}
                    onValueChange={(value) =>
                      handleInputChange('status', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.Value placeholder='Select status' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='pending'>Pending</Select.Item>
                      <Select.Item value='in_transit'>In Transit</Select.Item>
                      <Select.Item value='completed'>Completed</Select.Item>
                      <Select.Item value='cancelled'>Cancelled</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* Transfer Items */}
            <div>
              <div className='mb-4 flex items-center justify-between'>
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
                <div className='text-sm mb-4 text-red-600'>
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
                      key={index}
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
                          onClick={() => handleRemoveItem(index)}
                        >
                          <RiDeleteBinLine className='size-4' />
                          Remove
                        </Button.Root>
                      </div>

                      <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
                        <div className='flex flex-col gap-2 sm:col-span-2'>
                          <Label.Root htmlFor={`product-${index}`}>
                            Product <Label.Asterisk />
                          </Label.Root>
                          <Select.Root
                            value={item.productId}
                            onValueChange={(value) =>
                              handleItemChange(index, 'productId', value)
                            }
                          >
                            <Select.Trigger>
                              <Select.TriggerIcon as={RiBox1Line} />
                              <Select.Value placeholder='Select product' />
                            </Select.Trigger>
                            <Select.Content>
                              {products.map((product) => (
                                <Select.Item
                                  key={product.id}
                                  value={product.id}
                                >
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
                          <Label.Root htmlFor={`quantity-${index}`}>
                            Quantity <Label.Asterisk />
                          </Label.Root>
                          <Input.Root>
                            <Input.Wrapper>
                              <Input.Icon as={RiHashtag} />
                              <Input.Input
                                id={`quantity-${index}`}
                                type='number'
                                min='1'
                                value={item.quantity}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'quantity',
                                    parseInt(e.target.value) || 0,
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
                          <Label.Root htmlFor={`transferred-${index}`}>
                            Transferred
                          </Label.Root>
                          <Input.Root>
                            <Input.Wrapper>
                              <Input.Icon as={RiHashtag} />
                              <Input.Input
                                id={`transferred-${index}`}
                                type='number'
                                min='0'
                                max={item.quantity}
                                value={item.quantityTransferred || 0}
                                onChange={(e) =>
                                  handleItemChange(
                                    index,
                                    'quantityTransferred',
                                    parseInt(e.target.value) || 0,
                                  )
                                }
                                placeholder='Transferred qty'
                              />
                            </Input.Wrapper>
                          </Input.Root>
                        </div>
                      </div>

                      <div className='mt-4 flex flex-col gap-2'>
                        <Label.Root htmlFor={`notes-${index}`}>
                          Item Notes
                        </Label.Root>
                        <Input.Root>
                          <Input.Wrapper>
                            <Input.Icon as={RiFileTextLine} />
                            <Input.Input
                              id={`notes-${index}`}
                              value={item.notes || ''}
                              onChange={(e) =>
                                handleItemChange(index, 'notes', e.target.value)
                              }
                              placeholder='Enter item notes (optional)'
                            />
                          </Input.Wrapper>
                        </Input.Root>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Divider.Root />

            {/* Warehouse Selection */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Warehouse Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                {/* From Warehouse */}
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='warehouseFrom'>
                    From Warehouse{' '}
                    {formData.movementType === 'transfer' && <Label.Asterisk />}
                  </Label.Root>
                  <Select.Root
                    value={formData.warehouseIdFrom}
                    onValueChange={(value) =>
                      handleInputChange('warehouseIdFrom', value)
                    }
                    disabled={formData.movementType === 'in'}
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiStoreLine} />
                      <Select.Value
                        placeholder={
                          formData.movementType === 'in'
                            ? 'External source'
                            : 'Select source warehouse'
                        }
                      />
                    </Select.Trigger>
                    <Select.Content>
                      {isLoadingWarehouses && (
                        <Select.Item value='loading-warehouses' disabled>
                          Loading warehouses...
                        </Select.Item>
                      )}
                      {!isLoadingWarehouses && warehouses.length === 0 && (
                        <Select.Item value='no-warehouses' disabled>
                          No warehouses available
                        </Select.Item>
                      )}
                      {warehouses
                        .filter((w) => w.id !== formData.warehouseIdTo)
                        .map((warehouse) => (
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
                  {formData.movementType === 'in' && (
                    <p className='text-xs text-text-sub-600'>
                      Stock incoming from external source
                    </p>
                  )}
                </div>

                {/* To Warehouse */}
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='warehouseTo'>
                    To Warehouse <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.warehouseIdTo}
                    onValueChange={(value) =>
                      handleInputChange('warehouseIdTo', value)
                    }
                    disabled={formData.movementType === 'out'}
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiStoreLine} />
                      <Select.Value
                        placeholder={
                          formData.movementType === 'out'
                            ? 'External destination'
                            : 'Select destination warehouse'
                        }
                      />
                    </Select.Trigger>
                    <Select.Content>
                      {isLoadingWarehouses && (
                        <Select.Item value='loading-warehouses' disabled>
                          Loading warehouses...
                        </Select.Item>
                      )}
                      {!isLoadingWarehouses && warehouses.length === 0 && (
                        <Select.Item value='no-warehouses' disabled>
                          No warehouses available
                        </Select.Item>
                      )}
                      {warehouses
                        .filter((w) => w.id !== formData.warehouseIdFrom)
                        .map((warehouse) => (
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
                  {formData.movementType === 'out' && (
                    <p className='text-xs text-text-sub-600'>
                      Stock outgoing to external destination
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Divider.Root />

            {/* References & Notes */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Additional Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='invoiceId'>Invoice Reference</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiFileTextLine} />
                      <Input.Input
                        id='invoiceId'
                        value={formData.invoiceId}
                        onChange={(e) =>
                          handleInputChange('invoiceId', e.target.value)
                        }
                        placeholder='Enter invoice number (optional)'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='deliveryId'>
                    Delivery Reference
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiTruckLine} />
                      <Input.Input
                        id='deliveryId'
                        value={formData.deliveryId}
                        onChange={(e) =>
                          handleInputChange('deliveryId', e.target.value)
                        }
                        placeholder='Enter delivery number (optional)'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>

                <div className='flex flex-col gap-2 sm:col-span-2'>
                  <Label.Root htmlFor='notes'>Notes</Label.Root>
                  <TextArea.Root
                    id='notes'
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    rows={3}
                    placeholder='Enter any additional notes (optional)'
                    simple
                  />
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={() => router.push(`/transfers/${params.id}`)}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Transfer'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
