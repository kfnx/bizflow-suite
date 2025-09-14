'use client';

import { RiAddLine, RiFileTextLine } from '@remixicon/react';

import { useInvoices } from '@/hooks/use-invoices';
import * as Select from '@/components/ui/select';

export enum INVOICE_STATUS {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  VOID = 'void',
  OVERDUE = 'overdue',
}

interface InvoiceSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  status?: INVOICE_STATUS | INVOICE_STATUS[];
  showNoneOption?: boolean;
}

export function InvoiceSelect({
  value,
  onValueChange,
  placeholder = 'Select invoice',
  disabled = false,
  status,
  showNoneOption = true,
}: InvoiceSelectProps) {
  // Don't pass status to useInvoices hook, we'll filter locally
  const { data: invoices, isLoading } = useInvoices();

  const handleValueChange = (newValue: string) => {
    if (newValue === 'ADD_NEW_INVOICE') {
      window.open('/invoices/new', '_blank');
    } else {
      onValueChange(newValue);
    }
  };

  const filteredInvoices = status
    ? invoices?.data?.filter((invoice) => {
        if (Array.isArray(status)) {
          return status.includes(invoice.status as INVOICE_STATUS);
        }
        return invoice.status === status;
      })
    : invoices?.data;

  const getStatusColor = (status: string) => {
    switch (status) {
      case INVOICE_STATUS.PAID:
        return 'text-green-600';
      case INVOICE_STATUS.VOID:
      case INVOICE_STATUS.OVERDUE:
        return 'text-red-600';
      case INVOICE_STATUS.SENT:
        return 'text-blue-600';
      case INVOICE_STATUS.DRAFT:
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Select.Root
      value={value}
      onValueChange={handleValueChange}
      disabled={isLoading || disabled}
    >
      <Select.Trigger>
        <Select.TriggerIcon as={RiFileTextLine} />
        <Select.Value
          placeholder={isLoading ? 'Loading invoices...' : placeholder}
        />
      </Select.Trigger>
      <Select.Content>
        {showNoneOption && <Select.Item value='none'>-- None --</Select.Item>}
        {filteredInvoices?.map((invoice) => (
          <Select.Item key={invoice.id} value={invoice.id}>
            <div className='text-sm flex items-center gap-1'>
              <span className='font-medium'>{invoice.invoiceNumber}</span>
              <small>•</small>
              <small className='text-muted-foreground'>
                {invoice.customer?.name}
              </small>
              <small>•</small>
              <small className='text-muted-foreground'>
                Due: {new Date(invoice.dueDate).toLocaleDateString()}
              </small>
              <small>•</small>
              <small className='text-muted-foreground'>
                {invoice.currency} {parseFloat(invoice.total).toLocaleString()}
              </small>
              {invoice.status && (
                <>
                  <small>•</small>
                  <small
                    className={`capitalize ${getStatusColor(invoice.status)}`}
                  >
                    {invoice.status}
                  </small>
                </>
              )}
            </div>
          </Select.Item>
        ))}
        <Select.Separator />
        <Select.Item value='ADD_NEW_INVOICE'>
          <div className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            <span>Add New Invoice</span>
          </div>
        </Select.Item>
      </Select.Content>
    </Select.Root>
  );
}
