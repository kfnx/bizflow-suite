import { InvoiceDetail } from '@/hooks/use-invoices';

interface InvoiceDetailsProps {
  invoice: InvoiceDetail;
}

export function InvoiceDetails({ invoice }: InvoiceDetailsProps) {
  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {/* Customer Information */}
      <div className='space-y-4'>
        <h3 className='text-lg text-gray-900 font-medium'>
          Customer Information
        </h3>
        <div className='space-y-3'>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Customer Name
            </label>
            <p className='text-sm text-gray-900 mt-1'>{invoice.customerName}</p>
          </div>
        </div>
      </div>

      {/* Invoice Information */}
      <div className='space-y-4'>
        <h3 className='text-lg text-gray-900 font-medium'>
          Invoice Information
        </h3>
        <div className='space-y-3'>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Invoice Date
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {new Date(invoice.invoiceDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Due Date
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Currency
            </label>
            <p className='text-sm text-gray-900 mt-1'>{invoice.currency}</p>
          </div>
          {invoice.paymentTerms && (
            <div>
              <label className='text-sm text-gray-700 block font-medium'>
                Payment Method
              </label>
              <p className='text-sm text-gray-900 mt-1'>
                {invoice.paymentTerms}
              </p>
            </div>
          )}
          {invoice.quotationNumber && (
            <div>
              <label className='text-sm text-gray-700 block font-medium'>
                From Quotation
              </label>
              <p className='text-sm text-gray-900 mt-1'>
                {invoice.quotationNumber}
              </p>
            </div>
          )}
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Created By
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {invoice.createdByUser
                ? `${invoice.createdByUser.firstName} ${invoice.createdByUser.lastName}`
                : 'Unknown'}{' '}
              • {new Date(invoice.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className='space-y-4 lg:col-span-2'>
          <h3 className='text-lg text-gray-900 font-medium'>Notes</h3>
          <div className='bg-gray-50 rounded-lg p-4'>
            <p className='text-sm text-gray-700 whitespace-pre-wrap'>
              {invoice.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
