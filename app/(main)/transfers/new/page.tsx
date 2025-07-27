'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiArrowRightLine,
  RiBox1Line,
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
import * as TextArea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface TransferFormData {
  productId: string;
  warehouseIdFrom: string;
  warehouseIdTo: string;
  quantity: string;
  movementType: 'in' | 'out' | 'transfer' | 'adjustment';
  invoiceId: string;
  deliveryId: string;
  notes: string;
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

  const [formData, setFormData] = useState<TransferFormData>({
    productId: '',
    warehouseIdFrom: '',
    warehouseIdTo: '',
    quantity: '',
    movementType: 'transfer',
    invoiceId: '',
    deliveryId: '',
    notes: '',
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

    if (!formData.productId) {
      errors.productId = 'Product is required';
    }

    if (!formData.warehouseIdTo) {
      errors.warehouseIdTo = 'Destination warehouse is required';
    }

    if (formData.movementType === 'transfer' && !formData.warehouseIdFrom) {
      errors.warehouseIdFrom = 'Source warehouse is required for transfers';
    }

    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      errors.quantity = 'Quantity must be greater than 0';
    }

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

    const submitData = {
      productId: formData.productId,
      warehouseIdFrom: formData.warehouseIdFrom || undefined,
      warehouseIdTo: formData.warehouseIdTo,
      quantity: parseInt(formData.quantity),
      movementType: formData.movementType,
      invoiceId: formData.invoiceId.trim() || undefined,
      deliveryId: formData.deliveryId.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    };

    createTransferMutation.mutate(submitData, {
      onSuccess: () => {
        router.push('/transfers');
      },
      onError: (error) => {
        if (error.message.includes('validation')) {
          const serverErrors: Record<string, string> = {};
          serverErrors.general = 'Invalid transfer data';
          setValidationErrors(serverErrors);
        }
      },
    });
  };

  const handleInputChange = (field: keyof TransferFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const isLoading = createTransferMutation.isPending;

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
            <RiExchangeLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='New Transfer'
        description='Create a new stock movement or transfer.'
      >
        <BackButton href='/transfers' label='Back to Transfers' />
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
            {validationErrors.general && (
              <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                {validationErrors.general}
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

            {/* Product Selection */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Product Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='product'>
                    Product <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.productId}
                    onValueChange={(value) =>
                      handleInputChange('productId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiBox1Line} />
                      <Select.Value placeholder='Select a product' />
                    </Select.Trigger>
                    <Select.Content>
                      {isLoadingProducts && (
                        <Select.Item value='loading' disabled>
                          Loading products...
                        </Select.Item>
                      )}
                      {!isLoadingProducts && products.length === 0 && (
                        <Select.Item value='no-products' disabled>
                          No products available
                        </Select.Item>
                      )}
                      {products.map((product) => (
                        <Select.Item key={product.id} value={product.id}>
                          <div>
                            <div className='font-medium'>{product.name}</div>
                            <div className='text-xs text-text-sub-600'>
                              {product.code}
                            </div>
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.productId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.productId}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='quantity'>
                    Quantity <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiHashtag} />
                      <Input.Input
                        id='quantity'
                        type='number'
                        min='1'
                        value={formData.quantity}
                        onChange={(e) =>
                          handleInputChange('quantity', e.target.value)
                        }
                        placeholder='Enter quantity'
                        required
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.quantity && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.quantity}
                    </div>
                  )}
                </div>
              </div>
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
    </>
  );
}
