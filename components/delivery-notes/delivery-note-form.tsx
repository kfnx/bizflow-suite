'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiAddLine,
  RiCalendarLine,
  RiDeleteBinLine,
  RiShoppingCartLine,
  RiTruckLine,
  RiUserLine,
} from '@remixicon/react';
import { toast } from 'sonner';

import {
  DeliveryNoteFormData,
  deliveryNoteFormSchema,
  DeliveryNoteItem,
} from '@/lib/validations/delivery-note';
import { useDeliveryNoteNumber } from '@/hooks/use-delivery-note-number';
import { useInvoices } from '@/hooks/use-invoices';
import { useProducts } from '@/hooks/use-products';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { CustomerSelectWithAdd } from '@/components/customers/customer-select-with-add';
import DeliveryNoteNumberDisplay from '@/components/delivery-notes/delivery-note-number-display';

import { SimplePageLoading } from '../simple-page-loading';

export type DeliveryNoteFormMode = 'create' | 'edit';

interface DeliveryNoteFormProps {
  mode: DeliveryNoteFormMode;
  initialFormData?: DeliveryNoteFormData | null;
  isLoadingData?: boolean;
  onCancel?: () => void;
  onSubmit?: (data: DeliveryNoteFormData) => Promise<void>;
}

interface ValidationErrors {
  customerId?: string;
  deliveryDate?: string;
  items?: string[];
  general?: string;
}

const emptyFormData: DeliveryNoteFormData = {
  deliveryNumber: '',
  invoiceId: '',
  customerId: '',
  deliveryDate: '',
  deliveryMethod: '',
  driverName: '',
  vehicleNumber: '',
  notes: '',
  items: [],
};

export function DeliveryNoteForm({
  mode,
  initialFormData,
  isLoadingData = false,
  onCancel,
  onSubmit,
}: DeliveryNoteFormProps) {
  const [formData, setFormData] = useState<DeliveryNoteFormData>(
    initialFormData || emptyFormData,
  );

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();
  const { data: products } = useProducts();
  const { data: invoices } = useInvoices();
  const { data: deliveryNumber, isLoading: isLoadingDeliveryNumber } =
    useDeliveryNoteNumber();

  // Update form data when initialFormData changes (for edit mode)
  useEffect(() => {
    if (initialFormData && mode === 'edit') {
      setFormData(initialFormData);
    }
  }, [initialFormData, mode]);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const handleInputChange = useCallback(
    (field: keyof Omit<DeliveryNoteFormData, 'items'>, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear validation error for this field when user starts typing
      if (validationErrors[field as keyof ValidationErrors]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [validationErrors],
  );

  const addItem = useCallback(() => {
    setFormData((prev) => {
      const newItems = [
        ...prev.items,
        {
          productId: '',
          quantity: 1,
        },
      ];
      return {
        ...prev,
        items: newItems,
      };
    });
    // Clear items validation error when adding new item
    if (validationErrors.items) {
      setValidationErrors((prev) => ({ ...prev, items: undefined }));
    }
  }, [validationErrors.items]);

  const updateItem = useCallback(
    (index: number, field: keyof DeliveryNoteItem, value: string | number) => {
      setFormData((prev) => {
        const newItems = prev.items.map((item, i) =>
          i === index ? { ...item, [field]: value } : item,
        );
        return {
          ...prev,
          items: newItems,
        };
      });
      // Clear items validation error when updating items
      if (validationErrors.items) {
        setValidationErrors((prev) => ({ ...prev, items: undefined }));
      }
    },
    [validationErrors.items],
  );

  const removeItem = useCallback(
    (index: number) => {
      setFormData((prev) => {
        const newItems = prev.items.filter((_, i) => i !== index);
        return {
          ...prev,
          items: newItems,
        };
      });
      // Clear items validation error when removing items
      if (validationErrors.items) {
        setValidationErrors((prev) => ({ ...prev, items: undefined }));
      }
    },
    [validationErrors.items],
  );

  const validateForm = useCallback(() => {
    const result = deliveryNoteFormSchema.safeParse(formData);

    if (!result.success) {
      const errors: ValidationErrors = {};

      result.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        if (field === 'customerId') {
          errors.customerId = error.message;
        } else if (field === 'deliveryDate') {
          errors.deliveryDate = error.message;
        } else if (field === 'items') {
          if (error.path.length === 1) {
            errors.general = error.message;
          } else {
            const itemIndex = error.path[1] as number;
            if (!errors.items) errors.items = [];
            errors.items[itemIndex] = error.message;
          }
        }
      });

      setValidationErrors(errors);
      return false;
    }

    setValidationErrors({});
    return true;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    clearValidationErrors();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    if (!onSubmit) {
      toast.error('No submit handler provided');
      return;
    }

    setIsSubmitting(true);

    try {
      // Include the delivery number for create mode
      const submitData = {
        ...formData,
        deliveryNumber:
          mode === 'create' ? deliveryNumber : formData.deliveryNumber,
      };

      await onSubmit(submitData);
      toast.success(
        mode === 'create'
          ? 'Delivery note created successfully!'
          : 'Delivery note updated successfully!',
      );
      router.push('/delivery-notes');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state for create mode while fetching delivery number
  if (mode === 'create' && (isLoadingDeliveryNumber || !deliveryNumber)) {
    return <SimplePageLoading>Loading delivery number...</SimplePageLoading>;
  }

  // Show loading state for edit mode
  if (isLoadingData) {
    return <SimplePageLoading>Loading delivery note...</SimplePageLoading>;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'
    >
      {/* Delivery Note Details */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-6 font-semibold text-text-strong-950'>
          Delivery Note Details
        </h3>

        {/* Delivery Note Number Display */}
        {mode === 'create' ? (
          <DeliveryNoteNumberDisplay deliveryNumber={deliveryNumber!} />
        ) : (
          <div className='mb-4 flex flex-col gap-1'>
            <Label.Root htmlFor='deliveryNumber'>Delivery Number</Label.Root>
            <div className='text-sm p-2 text-text-sub-600'>
              {formData.deliveryNumber}
            </div>
          </div>
        )}

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='deliveryDate'>
              Delivery Date <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiCalendarLine} />
                <Input.Input
                  type='date'
                  value={formData.deliveryDate}
                  onChange={(e) =>
                    handleInputChange('deliveryDate', e.target.value)
                  }
                  required
                  className={
                    validationErrors.deliveryDate ? 'border-error-500' : ''
                  }
                />
              </Input.Wrapper>
            </Input.Root>
            {validationErrors.deliveryDate && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.deliveryDate}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='customer'>
              Customer <Label.Asterisk />
            </Label.Root>
            <CustomerSelectWithAdd
              value={formData.customerId}
              onValueChange={(value: string) =>
                handleInputChange('customerId', value)
              }
              placeholder='Select a customer'
            />
            {validationErrors.customerId && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.customerId}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='invoice'>Invoice (Optional)</Label.Root>
            <Select.Root
              value={formData.invoiceId || ''}
              onValueChange={(value) => handleInputChange('invoiceId', value)}
            >
              <Select.Trigger>
                <Select.TriggerIcon as={RiShoppingCartLine} />
                <Select.Value placeholder='Select an invoice (optional)' />
              </Select.Trigger>
              <Select.Content>
                {invoices?.data?.map((invoice) => (
                  <Select.Item key={invoice.id} value={invoice.id}>
                    {invoice.invoiceNumber} - {invoice.customer?.name}
                    <small className='ml-2 text-text-soft-400'>
                      ${invoice.total}
                    </small>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='deliveryMethod'>Delivery Method</Label.Root>
            <Select.Root
              value={formData.deliveryMethod || ''}
              onValueChange={(value) =>
                handleInputChange('deliveryMethod', value)
              }
            >
              <Select.Trigger>
                <Select.TriggerIcon as={RiTruckLine} />
                <Select.Value placeholder='Select delivery method' />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value='pickup'>Customer Pickup</Select.Item>
                <Select.Item value='delivery'>Delivery</Select.Item>
                <Select.Item value='courier'>Courier Service</Select.Item>
                <Select.Item value='freight'>Freight</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='driverName'>Driver Name</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiUserLine} />
                <Input.Input
                  id='driverName'
                  value={formData.driverName || ''}
                  onChange={(e) =>
                    handleInputChange('driverName', e.target.value)
                  }
                  placeholder='Enter driver name'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1'>
            <Label.Root htmlFor='vehicleNumber'>Vehicle Number</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Icon as={RiTruckLine} />
                <Input.Input
                  id='vehicleNumber'
                  value={formData.vehicleNumber || ''}
                  onChange={(e) =>
                    handleInputChange('vehicleNumber', e.target.value)
                  }
                  placeholder='Enter vehicle number'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-1 md:col-span-2'>
            <Label.Root htmlFor='notes'>Notes</Label.Root>
            <Textarea.Root
              id='notes'
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder='Additional notes...'
            />
          </div>
        </div>
      </div>

      {/* Delivery Items */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
          Items
        </h3>

        {validationErrors.general && (
          <p className='text-sm mb-4 text-error-base'>
            {validationErrors.general}
          </p>
        )}

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
                <div className='col-span-12 flex flex-col gap-1 lg:col-span-5'>
                  <Label.Root htmlFor={`product-${index}`}>Product</Label.Root>
                  <Select.Root
                    value={item.productId}
                    onValueChange={(value) => {
                      updateItem(index, 'productId', value);
                    }}
                  >
                    <Select.Trigger
                      id={`product-${index}`}
                      className={
                        validationErrors.items?.[index]
                          ? 'border-error-500'
                          : ''
                      }
                    >
                      <Select.TriggerIcon as={RiShoppingCartLine} />
                      <Select.Value placeholder='Select product' />
                    </Select.Trigger>
                    <Select.Content>
                      {products?.data?.map((product) => (
                        <Select.Item key={product.id} value={product.id}>
                          {product.name}{' '}
                          <small className='text-text-soft-400'>
                            {product.code}
                          </small>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.items?.[index] && (
                    <p className='text-sm mt-1 text-error-base'>
                      {validationErrors.items[index]}
                    </p>
                  )}
                </div>

                <div className='col-span-10 flex flex-col gap-1 lg:col-span-6'>
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
                        className={
                          validationErrors.items?.[index]
                            ? 'border-error-500'
                            : ''
                        }
                      />
                    </Input.Wrapper>
                  </Input.Root>
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

      {/* Form Actions */}
      <div className='flex justify-end space-x-3'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={onCancel || (() => router.push('/delivery-notes'))}
          type='button'
          disabled={isSubmitting}
        >
          Cancel
        </Button.Root>
        <Button.Root
          variant='primary'
          mode='filled'
          type='submit'
          disabled={isSubmitting || formData.items.length === 0}
        >
          {isSubmitting
            ? mode === 'create'
              ? 'Creating...'
              : 'Updating...'
            : mode === 'create'
              ? 'Create Delivery Note'
              : 'Update Delivery Note'}
        </Button.Root>
      </div>

      {/* Debug Panel - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className='border-gray-200 bg-gray-50 mt-4 rounded-lg border p-4'>
          <h4 className='text-sm text-gray-700 mb-2 font-semibold'>
            Debug Info
          </h4>
          <div className='text-xs text-gray-600 space-y-1'>
            <div>Mode: {mode}</div>
            <div>Items Count: {formData.items.length}</div>
            <div>Customer ID: {formData.customerId}</div>
            <div>Delivery Date: {formData.deliveryDate}</div>
            <div>Validation Errors: {Object.keys(validationErrors).length}</div>
            <div>Is Submitting: {isSubmitting.toString()}</div>
            <details className='mt-2'>
              <summary className='text-xs cursor-pointer font-medium'>
                Form Data
              </summary>
              <pre className='text-xs mt-1 max-h-32 overflow-auto rounded border bg-white p-2'>
                {JSON.stringify(formData, null, 2)}
              </pre>
            </details>
            <details className='mt-2'>
              <summary className='text-xs cursor-pointer font-medium'>
                Validation Errors
              </summary>
              <pre className='text-xs mt-1 max-h-32 overflow-auto rounded border bg-white p-2'>
                {JSON.stringify(validationErrors, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </form>
  );
}
