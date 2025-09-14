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

import { INVOICE_STATUS } from '@/lib/db/enum';
import {
  DeliveryNoteFormData,
  deliveryNoteFormSchema,
  DeliveryNoteItem,
} from '@/lib/validations/delivery-note';
import { useDeliveryNoteNumber } from '@/hooks/use-delivery-note-number';
import { useInvoiceDetail, useInvoices } from '@/hooks/use-invoices';
import { useProducts } from '@/hooks/use-products';
import { useQuotations } from '@/hooks/use-quotations';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Textarea from '@/components/ui/textarea';
import { CustomerSelectWithAdd } from '@/components/customers/customer-select-with-add';
import DeliveryNoteNumberDisplay from '@/components/delivery-notes/delivery-note-number-display';

import { InvoiceSelect } from '../invoices/invoice-select';
import { ProductSelect } from '../products/product-select';
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
  quotationId: '',
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
  const [invoiceChanged, setInvoiceChanged] = useState(false);

  const router = useRouter();
  const { data: products } = useProducts();
  const { data: invoices } = useInvoices();
  const { data: quotations } = useQuotations();
  const { data: deliveryNumber, isLoading: isLoadingDeliveryNumber } =
    useDeliveryNoteNumber();

  const { data: invoice, isFetching: isFetchingInvoice } = useInvoiceDetail(
    formData.invoiceId || '',
  );

  // Update form data when initialFormData changes (for edit mode)
  useEffect(() => {
    if (initialFormData && mode === 'edit') {
      setFormData(initialFormData);
    }
  }, [initialFormData, mode]);

  useEffect(() => {
    if (!invoiceChanged) return;

    if (!formData.invoiceId) {
      setFormData((prev) => ({ ...prev, items: [] }));
      return;
    }

    if (invoice?.data) {
      setFormData((prev) => ({
        ...prev,
        notes: invoice.data.notes || prev.notes,
        customerId: invoice.data.customerId || prev.customerId,
        items: invoice.data.items.map((item: any) => ({
          productId: item.productId,
          quantity: parseInt(item.quantity) || 1,
          name: item.name,
          category: item.category || '',
        })),
      }));
    }
  }, [invoiceChanged, formData.invoiceId, invoice]);

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

  const handleInvoiceChange = useCallback((value: string) => {
    setInvoiceChanged(true);
    setFormData((prev) => ({
      ...prev,
      invoiceId: value === 'none' ? '' : value,
      notes: '',
      customerId: '',
    }));
  }, []);

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
            <Label.Root htmlFor='invoice'>Select From Invoice</Label.Root>
            <InvoiceSelect
              value={formData.invoiceId || ''}
              onValueChange={handleInvoiceChange}
              placeholder='Select invoice'
              status={[INVOICE_STATUS.PAID, INVOICE_STATUS.SENT]}
            />
            {isFetchingInvoice && (
              <p className='text-xs mt-1 text-text-sub-600'>
                Loading invoice data...
              </p>
            )}
          </div>

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
            />
            {validationErrors.customerId && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.customerId}
              </p>
            )}
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
            No items added yet. Click &quot;Add Item&quot; to get started or
            select an invoice to import items.
          </div>
        ) : (
          <div className='space-y-4'>
            {formData.items.map((item, index) => (
              <div
                key={index}
                className='grid grid-cols-12 items-end gap-2 pb-4'
              >
                <div className='col-span-12 flex flex-col gap-1 lg:col-span-5'>
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
                              }
                            : currentItem,
                        ),
                      }));
                    }}
                    onValueChange={(value) => {
                      if (!value) {
                        updateItem(index, 'productId', '');
                      }
                    }}
                  />
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
    </form>
  );
}
