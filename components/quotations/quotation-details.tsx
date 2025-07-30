import { formatDate } from '@/utils/date-formatter';
import { QuotationDetail } from '@/hooks/use-quotations';

interface QuotationDetailsProps {
  quotation: QuotationDetail;
}

export function QuotationDetails({ quotation }: QuotationDetailsProps) {
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
            <p className='text-sm text-gray-900 mt-1'>
              {quotation.customerName}
            </p>
          </div>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Customer Code
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {quotation.customerCode}
            </p>
          </div>
        </div>
      </div>

      {/* Quotation Information */}
      <div className='space-y-4'>
        <h3 className='text-lg text-gray-900 font-medium'>
          Quotation Information
        </h3>
        <div className='space-y-3'>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Quotation Date
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {formatDate(quotation.quotationDate)}
            </p>
          </div>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Valid Until
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {formatDate(quotation.validUntil)}
            </p>
          </div>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Currency
            </label>
            <p className='text-sm text-gray-900 mt-1'>IDR</p>
          </div>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Include PPN
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {quotation.isIncludePPN ? 'Yes' : 'No'}
            </p>
          </div>
          <div>
            <label className='text-sm text-gray-700 block font-medium'>
              Created By
            </label>
            <p className='text-sm text-gray-900 mt-1'>
              {quotation.createdByUser} • {formatDate(quotation.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {quotation.notes && (
        <div className='space-y-4 lg:col-span-2'>
          <h3 className='text-lg text-gray-900 font-medium'>Notes</h3>
          <div className='bg-gray-50 rounded-lg p-4'>
            <p className='text-sm text-gray-700 whitespace-pre-wrap'>
              {quotation.notes}
            </p>
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      {quotation.termsAndConditions && (
        <div className='space-y-4 lg:col-span-2'>
          <h3 className='text-lg text-gray-900 font-medium'>
            Terms and Conditions
          </h3>
          <div className='bg-gray-50 rounded-lg p-4'>
            <p className='text-sm text-gray-700 whitespace-pre-wrap'>
              {quotation.termsAndConditions}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
