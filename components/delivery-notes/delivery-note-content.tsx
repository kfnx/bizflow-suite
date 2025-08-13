'use client';

/* eslint-disable tailwindcss/classnames-order */
import { DeliveryNoteDetail } from '@/hooks/use-delivery-notes';

interface DeliveryNoteContentProps {
  deliveryNote: DeliveryNoteDetail;
}

export function DeliveryNoteContent({
  deliveryNote,
}: DeliveryNoteContentProps) {
  return (
    <div className='space-y-6'>
      {/* Delivery Information */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
          Delivery Information
        </h3>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <div>
            <label className='text-sm text-gray-500 font-medium'>
              Delivery Number
            </label>
            <p className='mt-1 text-text-strong-950'>
              {deliveryNote.deliveryNumber}
            </p>
          </div>

          <div>
            <label className='text-sm text-gray-500 font-medium'>
              Customer
            </label>
            <p className='mt-1 text-text-strong-950'>
              {deliveryNote.customer?.name || 'Unknown Customer'}
              {deliveryNote.customer?.code && (
                <span className='text-sm ml-2 text-text-sub-600'>
                  ({deliveryNote.customer.code})
                </span>
              )}
            </p>
          </div>

          {deliveryNote.invoice && (
            <div>
              <label className='text-sm text-gray-500 font-medium'>
                Related Invoice
              </label>
              <p className='mt-1 text-text-strong-950'>
                {deliveryNote.invoice.invoiceNumber}
              </p>
            </div>
          )}

          <div>
            <label className='text-sm text-gray-500 font-medium'>
              Delivery Date
            </label>
            <p className='mt-1 text-text-strong-950'>
              {new Date(deliveryNote.deliveryDate).toLocaleDateString()}
            </p>
          </div>

          {deliveryNote.deliveryMethod && (
            <div>
              <label className='text-sm text-gray-500 font-medium'>
                Delivery Method
              </label>
              <p className='mt-1 capitalize text-text-strong-950'>
                {deliveryNote.deliveryMethod}
              </p>
            </div>
          )}

          {deliveryNote.driverName && (
            <div>
              <label className='text-sm text-gray-500 font-medium'>
                Driver Name
              </label>
              <p className='mt-1 text-text-strong-950'>
                {deliveryNote.driverName}
              </p>
            </div>
          )}

          {deliveryNote.vehicleNumber && (
            <div>
              <label className='text-sm text-gray-500 font-medium'>
                Vehicle Number
              </label>
              <p className='mt-1 text-text-strong-950'>
                {deliveryNote.vehicleNumber}
              </p>
            </div>
          )}

          <div>
            <label className='text-sm text-gray-500 font-medium'>
              Created By
            </label>
            <p className='mt-1 text-text-strong-950'>
              {deliveryNote.createdByUser
                ? `${deliveryNote.createdByUser.firstName} ${deliveryNote.createdByUser.lastName || ''}`.trim()
                : 'Unknown'}
            </p>
          </div>

          <div>
            <label className='text-sm text-gray-500 font-medium'>
              Created At
            </label>
            <p className='mt-1 text-text-strong-950'>
              {new Date(deliveryNote.createdAt).toLocaleDateString()}
            </p>
          </div>

          {deliveryNote.branchName && (
            <div>
              <label className='text-sm text-gray-500 font-medium'>
                Branch
              </label>
              <p className='mt-1 text-text-strong-950'>
                {deliveryNote.branchName}
              </p>
            </div>
          )}
        </div>

        {deliveryNote.notes && (
          <div className='mt-4'>
            <label className='text-sm text-gray-500 font-medium'>Notes</label>
            <p className='mt-1 whitespace-pre-wrap text-text-strong-950'>
              {deliveryNote.notes}
            </p>
          </div>
        )}
      </div>

      {/* Delivery Items */}
      <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
        <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
          Items to Deliver
        </h3>

        {deliveryNote.items.length === 0 ? (
          <p className='py-8 text-center text-text-sub-600'>No items found</p>
        ) : (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='border-b border-stroke-soft-200'>
                  <th className='px-4 py-3 text-left font-medium text-text-sub-600'>
                    Product
                  </th>
                  <th className='px-4 py-3 text-left font-medium text-text-sub-600'>
                    Product Code
                  </th>
                  <th className='px-4 py-3 text-right font-medium text-text-sub-600'>
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliveryNote.items.map((item, index) => (
                  <tr
                    key={item.id}
                    className={
                      index !== deliveryNote.items.length - 1
                        ? 'border-b border-stroke-soft-200'
                        : ''
                    }
                  >
                    <td className='px-4 py-3'>
                      <div className='font-medium text-text-strong-950'>
                        {item.product?.name || 'Unknown Product'}
                      </div>
                    </td>
                    <td className='px-4 py-3 text-text-sub-600'>
                      {item.product?.code || 'N/A'}
                    </td>
                    <td className='px-4 py-3 text-right font-medium text-text-strong-950'>
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delivery Status Information */}
      {(deliveryNote.deliveredByUser || deliveryNote.receivedByUser) && (
        <div className='rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-6'>
          <h3 className='text-lg mb-4 font-semibold text-text-strong-950'>
            Delivery Status
          </h3>

          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            {deliveryNote.deliveredByUser && (
              <div>
                <label className='text-sm text-gray-500 font-medium'>
                  Delivered By
                </label>
                <p className='mt-1 text-text-strong-950'>
                  {`${deliveryNote.deliveredByUser.firstName} ${deliveryNote.deliveredByUser.lastName || ''}`.trim()}
                </p>
              </div>
            )}

            {deliveryNote.receivedByUser && (
              <div>
                <label className='text-sm text-gray-500 font-medium'>
                  Received By
                </label>
                <p className='mt-1 text-text-strong-950'>
                  {`${deliveryNote.receivedByUser.firstName} ${deliveryNote.receivedByUser.lastName || ''}`.trim()}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
