import { InvoiceDetail } from '@/hooks/use-invoices';
import * as Table from '@/components/ui/table';

interface InvoiceLineItemsTableProps {
  invoice: InvoiceDetail;
}

const formatCurrency = (amount: string, currency: string) => {
  const numAmount = parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'USD',
    maximumFractionDigits: 2,
  }).format(numAmount);
};

const formatNumber = (value: string) => {
  const num = parseFloat(value);
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(num);
};

export function InvoiceLineItemsTable({ invoice }: InvoiceLineItemsTableProps) {
  const subtotal = parseFloat(invoice.subtotal);
  const tax = parseFloat(invoice.tax);
  const total = parseFloat(invoice.total);

  return (
    <div className='space-y-4'>
      <h3 className='text-lg text-gray-900 font-medium'>Line Items</h3>

      {invoice.items.length === 0 ? (
        <div className='text-gray-500 py-8 text-center'>
          No items in this invoice
        </div>
      ) : (
        <>
          <div className='border-gray-200 overflow-hidden rounded-lg border'>
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.Head className='w-1/3'>Product</Table.Head>
                  <Table.Head className='text-center'>Qty</Table.Head>
                  <Table.Head className='text-right'>Unit Price</Table.Head>
                  <Table.Head className='text-right'>Total</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {invoice.items.map((item, index) => (
                  <Table.Row key={item.id}>
                    <Table.Cell>
                      <div>
                        <div className='text-gray-900 font-medium'>
                          {item.name}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {item.productCode}
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className='text-center'>
                      {formatNumber(item.quantity)}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {formatCurrency(item.unitPrice, invoice.currency)}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {formatCurrency(item.total, invoice.currency)}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>

          {/* Totals */}
          <div className='flex justify-end'>
            <div className='w-80 space-y-2'>
              <div className='text-sm flex justify-between'>
                <span className='text-gray-600'>Subtotal:</span>
                <span className='font-medium'>
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>

              <div className='text-sm flex justify-between'>
                <span className='text-gray-600'>Tax:</span>
                <span className='font-medium'>
                  {formatCurrency(invoice.tax, invoice.currency)}
                </span>
              </div>

              <div className='border-gray-200 border-t pt-2'>
                <div className='flex justify-between'>
                  <span className='text-base text-gray-900 font-semibold'>
                    Total:
                  </span>
                  <span className='text-base text-gray-900 font-semibold'>
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
