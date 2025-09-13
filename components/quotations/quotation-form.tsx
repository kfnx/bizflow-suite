'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiAddLine, RiCalendarLine, RiDeleteBinLine } from '@remixicon/react';
import { toast } from 'sonner';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import {
  QuotationFormData,
  type QuotationItem,
} from '@/lib/validations/quotation';
import {
  formatNumberWithDots,
  parseNumberFromDots,
} from '@/utils/number-formatter';
import { useQuotationNumber } from '@/hooks/use-quotation-number';
import {
  useCreateQuotation,
  useCreateQuotationDraft,
  useEditQuotation,
  useReviseQuotation,
} from '@/hooks/use-quotations';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Textarea from '@/components/ui/textarea';
import { CustomerSelectWithAdd } from '@/components/customers/customer-select-with-add';
import { ProductSelect } from '@/components/products/product-select';
import { QuotationNumberDisplay } from '@/components/quotations/quotation-number-display';

import { SimplePageLoading } from '../simple-page-loading';

export type QuotationFormMode = 'create' | 'edit' | 'revise';

interface QuotationFormProps {
  mode: QuotationFormMode;
  initialFormData?: QuotationFormData | null;
  quotationId?: string;
  isLoadingData?: boolean;
  onCancel?: () => void;
  onFormDataChange?: (formData: QuotationFormData) => void;
}

interface ValidationErrors {
  customerId?: string;
  items?: string[];
  quotationDate?: string;
  validUntil?: string;
  notes?: string;
  termsAndConditions?: string;
  general?: string;
}

const emptyFormData: QuotationFormData = {
  quotationNumber: '',
  quotationDate: '',
  validUntil: '',
  customerId: '',
  branchId: '',
  isIncludePPN: false,
  notes: '',
  termsAndConditions: '',
  status: QUOTATION_STATUS.DRAFT,
  items: [],
};

export function QuotationForm({
  mode,
  initialFormData,
  quotationId,
  isLoadingData = false,
  onCancel,
  onFormDataChange,
}: QuotationFormProps) {
  const [formData, setFormData] = useState<QuotationFormData>(
    initialFormData || emptyFormData,
  );

  // Update form data when initialFormData changes (for edit/revise modes)
  useEffect(() => {
    if (initialFormData && (mode === 'edit' || mode === 'revise')) {
      setFormData(initialFormData);
    }
  }, [initialFormData, mode]);

  // Ensure customer ID is preserved even if customer list hasn't loaded yet
  useEffect(() => {
    if (
      (mode === 'edit' || mode === 'revise') &&
      initialFormData?.customerId &&
      !formData.customerId
    ) {
      setFormData((prev) => ({
        ...prev,
        customerId: initialFormData.customerId,
      }));
    }
  }, [mode, initialFormData?.customerId, formData.customerId]);

  // Call callback when form data changes (for PDF preview)
  useEffect(() => {
    if (onFormDataChange && formData) {
      onFormDataChange(formData);
    }
  }, [onFormDataChange, formData]);

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>(
    {},
  );

  const router = useRouter();

  const { data: quotationNumber, isLoading: isLoadingQuotationNumber } =
    useQuotationNumber();

  const createQuotationMutation = useCreateQuotation();
  const createQuotationDraftMutation = useCreateQuotationDraft();
  const editQuotationMutation = useEditQuotation();
  const reviseQuotationMutation = useReviseQuotation();

  // Combined loading state from mutations
  const isLoading =
    createQuotationMutation.isPending ||
    createQuotationDraftMutation.isPending ||
    editQuotationMutation.isPending ||
    reviseQuotationMutation.isPending;

  const clearValidationErrors = useCallback(() => {
    setValidationErrors({});
  }, []);

  const handleInputChange = useCallback(
    (
      field: keyof Omit<QuotationFormData, 'items'>,
      value: string | boolean,
    ) => {
      setFormData((prev) =>
        prev ? { ...prev, [field]: value } : emptyFormData,
      );
      // Clear validation error for this field when user starts typing
      if (validationErrors[field as keyof ValidationErrors]) {
        setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [validationErrors],
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
                unitPrice: '0',
                additionalSpecs: '',
              },
            ],
          }
        : emptyFormData,
    );
    // Clear items validation error when adding new item
    if (validationErrors.items) {
      setValidationErrors((prev) => ({ ...prev, items: undefined }));
    }
  }, [validationErrors.items]);

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
          : emptyFormData,
      );
      // Clear items validation error when updating items
      if (validationErrors.items) {
        setValidationErrors((prev) => ({ ...prev, items: undefined }));
      }
    },
    [validationErrors.items],
  );

  const removeItem = useCallback(
    (index: number) => {
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              items: prev.items.filter((_, i) => i !== index),
            }
          : emptyFormData,
      );
      // Clear items validation error when removing items
      if (validationErrors.items) {
        setValidationErrors((prev) => ({ ...prev, items: undefined }));
      }
    },
    [validationErrors.items],
  );

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

  const validateForm = useCallback(
    (status: QUOTATION_STATUS) => {
      if (!formData) return false;

      const errors: ValidationErrors = {};

      if (status === QUOTATION_STATUS.SUBMITTED) {
        if (!formData.customerId) {
          errors.customerId = 'Please select a customer';
        }

        if (formData.items.length === 0) {
          errors.items = ['Please add at least one item'];
        } else {
          const itemErrors: string[] = [];
          formData.items.forEach((item, index) => {
            const unitPrice =
              parseFloat(parseNumberFromDots(item.unitPrice)) || 0;
            if (!item.productId) {
              itemErrors[index] = 'Please select a product';
            } else if (item.quantity <= 0) {
              itemErrors[index] = 'Quantity must be greater than 0';
            } else if (unitPrice <= 0) {
              itemErrors[index] = 'Unit price must be greater than 0';
            }
          });
          if (itemErrors.some((error: string | undefined) => error)) {
            errors.items = itemErrors;
          }
        }
      }

      setValidationErrors(errors);
      return Object.keys(errors).length === 0;
    },
    [formData],
  );

  const handleSubmit = async (e: React.FormEvent, status: QUOTATION_STATUS) => {
    e.preventDefault();
    if (!formData) return;

    clearValidationErrors();

    if (!validateForm(status)) {
      // Show first error as toast for better UX
      const firstError = Object.values(validationErrors).find(
        (error: string | string[] | undefined) =>
          typeof error === 'string' ||
          (Array.isArray(error) && error.some((e: string | undefined) => e)),
      );
      if (firstError) {
        const errorMessage =
          typeof firstError === 'string'
            ? firstError
            : firstError.find((e: string | undefined) => e) ||
              'Please fix the validation errors';
        toast.error(errorMessage);
      }
      return;
    }

    try {
      const quotationNumberData =
        mode === 'create' ? quotationNumber : formData!.quotationNumber;
      const requestData: QuotationFormData = {
        quotationNumber: quotationNumberData || '',
        quotationDate: formData!.quotationDate,
        validUntil: formData!.validUntil,
        customerId: formData!.customerId,
        isIncludePPN: formData!.isIncludePPN,
        notes: formData!.notes,
        termsAndConditions: formData!.termsAndConditions,
        status,
        items: formData!.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      };

      if (mode === 'create') {
        if (status === QUOTATION_STATUS.DRAFT) {
          await createQuotationDraftMutation.mutateAsync(requestData);
        } else {
          await createQuotationMutation.mutateAsync(requestData);
        }
      } else if (mode === 'edit') {
        if (!quotationId) {
          toast.error('Quotation ID is required');
          return;
        }
        await editQuotationMutation.mutateAsync({
          quotationId,
          data: requestData,
        });
      } else if (mode === 'revise') {
        if (!quotationId) {
          toast.error('Quotation ID is required');
          return;
        }
        await reviseQuotationMutation.mutateAsync({
          quotationId,
          data: requestData,
        });
      }
      router.push('/quotations');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  // Show loading state for create mode while fetching quotation number
  if (mode === 'create' && (isLoadingQuotationNumber || !quotationNumber)) {
    return <SimplePageLoading>Loading quotation number...</SimplePageLoading>;
  }

  // Show loading state for edit/revise mode
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

  return (
    <form
      onSubmit={(e) => handleSubmit(e, QUOTATION_STATUS.SUBMITTED)}
      className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'
    >
      {/* Quotation Details */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-6 font-semibold text-text-strong-950'>
          Quotation Details
        </h3>

        {/* Quotation Number Display */}
        {mode === 'create' ? (
          <QuotationNumberDisplay quotationNumber={quotationNumber!} />
        ) : (
          <div className='mb-4 flex flex-col gap-1'>
            <Label.Root htmlFor='quotationNumber'>Quotation Number</Label.Root>
            <div className='text-sm p-2 text-text-sub-600'>
              {formData.quotationNumber}
            </div>
          </div>
        )}

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
                  className={
                    validationErrors.quotationDate ? 'border-error-500' : ''
                  }
                />
              </Input.Wrapper>
            </Input.Root>
            {validationErrors.quotationDate && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.quotationDate}
              </p>
            )}
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
                  className={
                    validationErrors.validUntil ? 'border-error-500' : ''
                  }
                />
              </Input.Wrapper>
            </Input.Root>
            {validationErrors.validUntil && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.validUntil}
              </p>
            )}
          </div>

          <div className='col-span-2 flex flex-col gap-1'>
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

          <div className='flex flex-col gap-1 md:col-span-2'>
            <Label.Root htmlFor='notes'>Notes</Label.Root>
            <Textarea.Root
              id='notes'
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder='Additional notes...'
              className={validationErrors.notes ? 'border-error-500' : ''}
            />
            {validationErrors.notes && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.notes}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1 md:col-span-2'>
            <Label.Root htmlFor='termsAndConditions'>
              Terms and Conditions
            </Label.Root>
            <Textarea.Root
              id='termsAndConditions'
              value={formData.termsAndConditions || ''}
              onChange={(e) =>
                handleInputChange('termsAndConditions', e.target.value)
              }
              placeholder='Enter terms and conditions...'
              className={
                validationErrors.termsAndConditions ? 'border-error-500' : ''
              }
            />
            {validationErrors.termsAndConditions && (
              <p className='text-sm mt-1 text-error-base'>
                {validationErrors.termsAndConditions}
              </p>
            )}
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
        <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
          Items
        </h3>

        {formData.items.length === 0 ? (
          <div className='py-8 text-center text-text-sub-600'>
            No items added yet. Click &quot;Add Item&quot; to get started.
          </div>
        ) : (
          <div className='space-y-4'>
            {validationErrors.items &&
              validationErrors.items[0] &&
              formData.items.length === 0 && (
                <p className='text-sm mb-2 text-error-base'>
                  {validationErrors.items[0]}
                </p>
              )}
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
                      if (!value) {
                        updateItem(index, 'productId', '');
                        updateItem(index, 'name', '');
                        updateItem(index, 'category', '');
                        updateItem(index, 'unitPrice', '0');
                        updateItem(index, 'additionalSpecs', '');
                      }
                    }}
                    error={!!validationErrors.items?.[index]}
                  />
                  {validationErrors.items?.[index] && (
                    <p className='text-sm mt-1 text-error-base'>
                      {validationErrors.items[index]}
                    </p>
                  )}
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
                          className={
                            validationErrors.items?.[index]
                              ? 'border-error-500'
                              : ''
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
                          className={
                            validationErrors.items?.[index]
                              ? 'border-error-500'
                              : ''
                          }
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
              <span>{calculateSubtotal().toLocaleString()} IDR</span>
            </div>
            {formData.isIncludePPN && (
              <div className='flex justify-between'>
                <span>PPN (11%):</span>
                <span>{calculateTax().toLocaleString()} IDR</span>
              </div>
            )}
            <div className='flex justify-between border-t border-stroke-soft-200 pt-2 font-semibold'>
              <span>Total:</span>
              <span>{calculateTotal().toLocaleString()} IDR</span>
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className='flex justify-end space-x-3'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          onClick={onCancel || (() => router.push('/quotations'))}
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
  );
}
