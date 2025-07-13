import { QuotationDetail } from '@/hooks/use-quotations';
import * as Table from '@/components/ui/table';

interface LineItemsTableProps {
  quotation: QuotationDetail;
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

export function LineItemsTable({ quotation }: LineItemsTableProps) {
  const subtotal = parseFloat(quotation.subtotal);
  const tax = parseFloat(quotation.tax);
  const total = parseFloat(quotation.total);

  return (
    <div className='space-y-4'>
      <h3 className='text-lg text-gray-900 font-medium'>Line Items</h3>

      {quotation.items.length === 0 ? (
        <div className='text-gray-500 py-8 text-center'>
          No items in this quotation
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
                  <Table.Head className='w-1/4'>Notes</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {quotation.items.map((item, index) => (
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
                      {formatCurrency(item.unitPrice, quotation.currency)}
                    </Table.Cell>
                    <Table.Cell className='text-right'>
                      {formatCurrency(item.total, quotation.currency)}
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-sm text-gray-600'>
                        {item.notes || '-'}
                      </span>
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
                  {formatCurrency(quotation.subtotal, quotation.currency)}
                </span>
              </div>

              {quotation.isIncludePPN && (
                <div className='text-sm flex justify-between'>
                  <span className='text-gray-600'>PPN (11%):</span>
                  <span className='font-medium'>
                    {formatCurrency(quotation.tax, quotation.currency)}
                  </span>
                </div>
              )}

              <div className='border-gray-200 border-t pt-2'>
                <div className='flex justify-between'>
                  <span className='text-base text-gray-900 font-semibold'>
                    Total:
                  </span>
                  <span className='text-base text-gray-900 font-semibold'>
                    {formatCurrency(quotation.total, quotation.currency)}
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
