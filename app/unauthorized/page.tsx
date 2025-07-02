import Link from 'next/link';
import { RiShieldKeyholeLine } from '@remixicon/react';

import { Root as Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className='bg-gray-50 flex min-h-screen items-center justify-center'>
      <div className='w-full max-w-md space-y-8 text-center'>
        <div>
          <RiShieldKeyholeLine className='text-gray-400 mx-auto h-12 w-12' />
          <h2 className='text-3xl text-gray-900 mt-6 font-bold'>
            Access Denied
          </h2>
          <p className='text-sm text-gray-600 mt-2'>
            You don&apos;t have permission to access this page.
          </p>
        </div>
        <div className='mt-8'>
          <Button asChild>
            <Link href='/'>Return to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
