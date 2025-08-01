import { RiFileTextLine, RiShoppingCartLine } from '@remixicon/react';

import { QuotationDetail } from '@/hooks/use-quotations';
import * as Table from '@/components/ui/table';

interface LineItemsTableProps {
  quotation: QuotationDetail;
}

const formatCurrency = (amount: string | number) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numAmount);
};

const formatNumber = (value: string | number) => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 2,
  }).format(num);
};

export function LineItemsTable({ quotation }: LineItemsTableProps) {
  const subtotal = parseFloat(quotation.subtotal);
  const tax = parseFloat(quotation.tax);
  const total = parseFloat(quotation.total);

  return (
    <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
      {/* Header */}
      <div className='mb-6 flex items-center gap-3'>
        <div className='bg-primary-50 ring-primary-100 flex size-8 items-center justify-center rounded-full ring-1'>
          <RiShoppingCartLine className='text-primary-600 size-4' />
        </div>
        <h3 className='text-lg font-semibold text-text-strong-950'>
          Line Items
        </h3>
        <div className='ml-auto'>
          <span className='text-xs inline-flex items-center rounded-full bg-bg-weak-50 px-2.5 py-0.5 font-medium text-text-sub-600 ring-1 ring-stroke-soft-200'>
            {quotation.items.length}{' '}
            {quotation.items.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      {quotation.items.length === 0 ? (
        <div className='flex flex-col items-center justify-center py-12'>
          <div className='mb-4 flex size-12 items-center justify-center rounded-full bg-bg-weak-50 ring-1 ring-stroke-soft-200'>
            <RiFileTextLine className='size-6 text-text-sub-600' />
          </div>
          <h4 className='text-sm mb-1 font-medium text-text-strong-950'>
            No items
          </h4>
          <p className='text-sm text-text-sub-600'>
            This quotation doesn&apos;t have any line items yet.
          </p>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className='mb-6 overflow-hidden rounded-lg border border-stroke-soft-200'>
            <Table.Root>
              <Table.Header>
                <Table.Row className='bg-bg-weak-50'>
                  <Table.Head className='w-1/3 font-semibold text-text-strong-950'>
                    Product
                  </Table.Head>
                  <Table.Head className='text-center font-semibold text-text-strong-950'>
                    Qty
                  </Table.Head>
                  <Table.Head className='text-right font-semibold text-text-strong-950'>
                    Unit Price
                  </Table.Head>
                  <Table.Head className='text-right font-semibold text-text-strong-950'>
                    Total
                  </Table.Head>
                  <Table.Head className='w-1/4 font-semibold text-text-strong-950'>
                    Notes
                  </Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {quotation.items.map((item, index) => (
                  <Table.Row key={item.id} className='hover:bg-bg-weak-50/50'>
                    <Table.Cell>
                      <div>
                        <div className='font-medium text-text-strong-950'>
                          {item.name}
                        </div>
                        {item.productCode && (
                          <div className='text-sm text-text-sub-600'>
                            Code: {item.productCode}
                          </div>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className='text-center'>
                      <span className='bg-primary-50 text-xs text-primary-700 ring-primary-600/20 inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ring-1'>
                        {formatNumber(item.quantity)}
                      </span>
                    </Table.Cell>
                    <Table.Cell className='text-right font-medium text-text-strong-950'>
                      {formatCurrency(item.unitPrice)}
                    </Table.Cell>
                    <Table.Cell className='text-right font-semibold text-text-strong-950'>
                      {formatCurrency(item.total)}
                    </Table.Cell>
                    <Table.Cell>
                      <span className='text-sm text-text-sub-600'>
                        {item.notes || '-'}
                      </span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </div>

          {/* Totals Summary */}
          <div className='flex justify-end'>
            <div className='w-96 rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-4'>
              <div className='space-y-3'>
                <div className='text-sm flex justify-between'>
                  <span className='font-medium text-text-sub-600'>
                    Subtotal:
                  </span>
                  <span className='font-semibold text-text-strong-950'>
                    {formatCurrency(quotation.subtotal)}
                  </span>
                </div>

                {quotation.isIncludePPN && (
                  <div className='text-sm flex justify-between'>
                    <span className='font-medium text-text-sub-600'>
                      PPN (11%):
                    </span>
                    <span className='font-semibold text-text-strong-950'>
                      {formatCurrency(quotation.tax)}
                    </span>
                  </div>
                )}

                <div className='border-t border-stroke-soft-200 pt-3'>
                  <div className='flex justify-between'>
                    <span className='text-base font-semibold text-text-strong-950'>
                      Total:
                    </span>
                    <span className='text-lg text-primary-600 font-bold'>
                      {formatCurrency(quotation.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
