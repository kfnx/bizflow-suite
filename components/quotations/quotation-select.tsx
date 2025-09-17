'use client';

import { RiAddLine, RiHistoryLine } from '@remixicon/react';

import { QUOTATION_STATUS } from '@/lib/db/enum';
import { useQuotations } from '@/hooks/use-quotations';
import * as Select from '@/components/ui/select';

interface QuotationSelectWithAddProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  status?: QUOTATION_STATUS;
  showNoneOption?: boolean;
}

export function QuotationSelect({
  value,
  onValueChange,
  placeholder = 'Select quotation',
  disabled = false,
  status,
  showNoneOption = true,
}: QuotationSelectWithAddProps) {
  const { data: quotations, isLoading } = useQuotations({ status });

  const handleValueChange = (newValue: string) => {
    if (newValue === 'ADD_NEW_QUOTATION') {
      window.open('/quotations/new', '_blank');
    } else {
      onValueChange(newValue);
    }
  };

  const filteredQuotations = status
    ? quotations?.data?.filter((q) => q.status === status)
    : quotations?.data;

  return (
    <Select.Root
      value={value}
      onValueChange={handleValueChange}
      disabled={isLoading || disabled}
    >
      <Select.Trigger>
        <Select.TriggerIcon as={RiHistoryLine} />
        <Select.Value
          placeholder={isLoading ? 'Loading quotations...' : placeholder}
        />
      </Select.Trigger>
      <Select.Content>
        {showNoneOption && <Select.Item value='none'>-- None --</Select.Item>}
        {filteredQuotations?.map((quotation) => (
          <Select.Item key={quotation.id} value={quotation.id}>
            <div className='text-sm flex items-center gap-1'>
              <span className='font-medium'>{quotation.quotationNumber}</span>
              <small>•</small>
              <small className='text-muted-foreground'>
                {quotation.customerName}
              </small>
              {quotation.status && (
                <>
                  <small>•</small>
                  <small
                    className={`capitalize ${
                      quotation.status === QUOTATION_STATUS.APPROVED
                        ? 'text-green-600'
                        : quotation.status === QUOTATION_STATUS.REJECTED
                          ? 'text-red-600'
                          : 'text-blue-600'
                    }`}
                  >
                    {quotation.status}
                  </small>
                </>
              )}
            </div>
          </Select.Item>
        ))}
        <Select.Separator />
        <Select.Item value='ADD_NEW_QUOTATION'>
          <div className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            <span>Add New Quotation</span>
          </div>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
