export function QuotationDetailSkeleton() {
  return (
    <div className='space-y-6'>
      {/* Header Skeleton */}
      <div className='border-b pb-6'>
        <div className='mb-4 flex items-center gap-2'>
          <div className='bg-gray-200 h-6 w-20 animate-pulse rounded' />
          <div className='bg-gray-200 h-6 w-1 animate-pulse rounded' />
          <div className='bg-gray-200 h-6 w-32 animate-pulse rounded' />
        </div>
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <div className='bg-gray-200 h-8 w-48 animate-pulse rounded' />
            <div className='bg-gray-100 mt-2 h-4 w-64 animate-pulse rounded' />
          </div>
          <div className='flex gap-2'>
            <div className='bg-gray-200 h-10 w-20 animate-pulse rounded' />
            <div className='bg-gray-200 h-10 w-24 animate-pulse rounded' />
            <div className='bg-gray-200 h-10 w-16 animate-pulse rounded' />
          </div>
        </div>
        <div className='flex gap-6'>
          <div className='bg-gray-200 h-6 w-16 animate-pulse rounded' />
          <div className='bg-gray-200 h-6 w-20 animate-pulse rounded' />
          <div className='bg-gray-200 h-6 w-24 animate-pulse rounded' />
        </div>
      </div>

      {/* Details Grid Skeleton */}
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
        <div className='space-y-4'>
          <div className='bg-gray-200 h-5 w-24 animate-pulse rounded' />
          <div className='space-y-2'>
            <div className='bg-gray-100 h-4 w-full animate-pulse rounded' />
            <div className='bg-gray-100 h-4 w-3/4 animate-pulse rounded' />
          </div>
        </div>
        <div className='space-y-4'>
          <div className='bg-gray-200 h-5 w-28 animate-pulse rounded' />
          <div className='space-y-2'>
            <div className='bg-gray-100 h-4 w-full animate-pulse rounded' />
            <div className='bg-gray-100 h-4 w-2/3 animate-pulse rounded' />
          </div>
        </div>
      </div>

      {/* Line Items Table Skeleton */}
      <div className='space-y-4'>
        <div className='bg-gray-200 h-6 w-32 animate-pulse rounded' />
        <div className='overflow-hidden rounded-lg border'>
          <div className='bg-gray-50 px-6 py-3'>
            <div className='grid grid-cols-6 gap-4'>
              <div className='bg-gray-200 h-4 w-16 animate-pulse rounded' />
              <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
              <div className='bg-gray-200 h-4 w-12 animate-pulse rounded' />
              <div className='bg-gray-200 h-4 w-16 animate-pulse rounded' />
              <div className='bg-gray-200 h-4 w-12 animate-pulse rounded' />
              <div className='bg-gray-200 h-4 w-12 animate-pulse rounded' />
            </div>
          </div>
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className='border-t px-6 py-4'>
              <div className='grid grid-cols-6 gap-4'>
                <div className='space-y-1'>
                  <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
                  <div className='bg-gray-100 h-3 w-32 animate-pulse rounded' />
                </div>
                <div className='bg-gray-200 h-4 w-16 animate-pulse rounded' />
                <div className='bg-gray-200 h-4 w-8 animate-pulse rounded' />
                <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
                <div className='bg-gray-200 h-4 w-16 animate-pulse rounded' />
                <div className='bg-gray-200 h-4 w-24 animate-pulse rounded' />
              </div>
            </div>
          ))}
        </div>

        {/* Totals Skeleton */}
        <div className='flex justify-end'>
          <div className='w-80 space-y-2'>
            <div className='flex justify-between'>
              <div className='bg-gray-200 h-4 w-16 animate-pulse rounded' />
              <div className='bg-gray-200 h-4 w-24 animate-pulse rounded' />
            </div>
            <div className='flex justify-between'>
              <div className='bg-gray-200 h-4 w-12 animate-pulse rounded' />
              <div className='bg-gray-200 h-4 w-20 animate-pulse rounded' />
            </div>
            <div className='border-t pt-2'>
              <div className='flex justify-between'>
                <div className='bg-gray-200 h-5 w-16 animate-pulse rounded' />
                <div className='bg-gray-200 h-5 w-28 animate-pulse rounded' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
