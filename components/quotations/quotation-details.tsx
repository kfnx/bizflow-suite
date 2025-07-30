import { 
  RiBuildingLine, 
  RiCalendarLine, 
  RiFileTextLine, 
  RiMapPinLine, 
  RiUserLine,
  RiMoneyDollarCircleLine,
  RiPercentLine,
  RiTimeLine
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { QuotationDetail } from '@/hooks/use-quotations';

interface QuotationDetailsProps {
  quotation: QuotationDetail;
}

function DetailCard({ 
  icon: Icon, 
  title, 
  children, 
  className = '' 
}: { 
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6 ${className}`}>
      <div className='mb-4 flex items-center gap-3'>
        <div className='bg-primary-50 ring-primary-100 flex size-8 items-center justify-center rounded-full ring-1'>
          <Icon className='text-primary-600 size-4' />
        </div>
        <h3 className='text-lg font-semibold text-text-strong-950'>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

function DetailItem({ 
  label, 
  value, 
  icon: Icon 
}: { 
  label: string; 
  value: string | React.ReactElement; 
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className='flex items-start justify-between py-2'>
      <div className='flex items-center gap-2'>
        {Icon && <Icon className='size-4 text-text-sub-600' />}
        <span className='text-sm font-medium text-text-sub-600'>{label}</span>
      </div>
      <div className='text-sm text-right text-text-strong-950'>
        {value}
      </div>
    </div>
  );
}

export function QuotationDetails({ quotation }: QuotationDetailsProps) {
  // Calculate validity status
  const validUntilDate = new Date(quotation.validUntil);
  const today = new Date();
  const isExpired = validUntilDate < today;
  const daysRemaining = Math.ceil((validUntilDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
      {/* Customer Information */}
      <DetailCard icon={RiUserLine} title='Customer Information'>
        <div className='space-y-1'>
          <DetailItem 
            label='Name' 
            value={quotation.customerName} 
          />
          <DetailItem 
            label='Code' 
            value={quotation.customerCode} 
          />
          {quotation.customerType && (
            <DetailItem 
              label='Type' 
              value={
                <span className={`text-xs inline-flex items-center rounded-full px-2 py-1 font-medium ${
                  quotation.customerType === 'company'
                    ? 'bg-primary-50 text-primary-700 ring-primary-600/20 ring-1' 
                    : 'bg-success-50 text-success-700 ring-success-600/20 ring-1'
                }`}>
                  {quotation.customerType === 'company' ? 'Company' : 'Individual'}
                </span>
              }
            />
          )}
          {quotation.customerAddress && (
            <DetailItem 
              icon={RiMapPinLine}
              label='Address' 
              value={quotation.customerAddress} 
            />
          )}
          {quotation.customerContactPerson && (
            <DetailItem 
              label='Contact Person' 
              value={`${quotation.customerContactPersonPrefix ? quotation.customerContactPersonPrefix + ' ' : ''}${quotation.customerContactPerson}`} 
            />
          )}
          {quotation.customerContactPersonEmail && (
            <DetailItem 
              label='Email' 
              value={quotation.customerContactPersonEmail} 
            />
          )}
          {quotation.customerContactPersonPhone && (
            <DetailItem 
              label='Phone' 
              value={quotation.customerContactPersonPhone} 
            />
          )}
        </div>
      </DetailCard>

      {/* Quotation Information */}
      <DetailCard icon={RiFileTextLine} title='Quotation Information'>
        <div className='space-y-1'>
          <DetailItem 
            icon={RiCalendarLine}
            label='Date' 
            value={formatDate(quotation.quotationDate)} 
          />
          <DetailItem 
            icon={RiTimeLine}
            label='Valid Until' 
            value={
              <div className='flex flex-col items-end'>
                <span>{formatDate(quotation.validUntil)}</span>
                {!isExpired && daysRemaining >= 0 && (
                  <span className={`text-xs ${
                    daysRemaining <= 7 ? 'text-warning-600' : 
                    daysRemaining <= 3 ? 'text-error-600' : 'text-success-600'
                  }`}>
                    {daysRemaining === 0 ? 'Expires today' : 
                     daysRemaining === 1 ? '1 day remaining' : 
                     `${daysRemaining} days remaining`}
                  </span>
                )}
                {isExpired && (
                  <span className='text-xs text-error-600'>Expired</span>
                )}
              </div>
            } 
          />
          <DetailItem 
            icon={RiMoneyDollarCircleLine}
            label='Currency' 
            value='IDR' 
          />
          <DetailItem 
            icon={RiPercentLine}
            label='Include PPN' 
            value={
              <span className={`text-xs inline-flex items-center rounded-full px-2 py-1 font-medium ${
                quotation.isIncludePPN 
                  ? 'bg-success-50 text-success-700 ring-success-600/20 ring-1' 
                  : 'bg-bg-weak-50 text-text-sub-600 ring-1 ring-stroke-soft-200'
              }`}>
                {quotation.isIncludePPN ? 'Yes (11%)' : 'No'}
              </span>
            }
          />
        </div>
      </DetailCard>

      {/* Branch Information */}
      {quotation.branchName && (
        <DetailCard icon={RiBuildingLine} title='Branch Information'>
          <div className='space-y-1'>
            <DetailItem 
              icon={RiMapPinLine}
              label='Branch' 
              value={quotation.branchName} 
            />
          </div>
        </DetailCard>
      )}

      {/* Creation Information */}
      <DetailCard icon={RiUserLine} title='Creation Information'>
        <div className='space-y-1'>
          <DetailItem 
            label='Created By' 
            value={quotation.createdByUser || 'Unknown'} 
          />
          <DetailItem 
            icon={RiCalendarLine}
            label='Created At' 
            value={formatDate(quotation.createdAt)} 
          />
          {quotation.updatedAt && quotation.updatedAt !== quotation.createdAt && (
            <DetailItem 
              icon={RiCalendarLine}
              label='Last Updated' 
              value={formatDate(quotation.updatedAt)} 
            />
          )}
        </div>
      </DetailCard>

      {/* Notes */}
      {quotation.notes && (
        <div className='lg:col-span-2'>
          <DetailCard icon={RiFileTextLine} title='Notes' className=''>
            <div className='rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-4'>
              <p className='text-sm whitespace-pre-wrap leading-relaxed text-text-sub-600'>
                {quotation.notes}
              </p>
            </div>
          </DetailCard>
        </div>
      )}

      {/* Terms and Conditions */}
      {quotation.termsAndConditions && (
        <div className='lg:col-span-2'>
          <DetailCard icon={RiFileTextLine} title='Terms and Conditions' className=''>
            <div className='rounded-lg border border-stroke-soft-200 bg-bg-weak-50 p-4'>
              <p className='text-sm whitespace-pre-wrap leading-relaxed text-text-sub-600'>
                {quotation.termsAndConditions}
              </p>
            </div>
          </DetailCard>
        </div>
      )}
    </div>
  );
}
