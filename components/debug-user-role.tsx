'use client';

import { useSession } from 'next-auth/react';

export function DebugUserRole() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'guest';

  return (
    <div className='text-sm fixed bottom-4 right-4 rounded-lg border border-blue-300 bg-blue-100 p-3'>
      <div className='font-semibold'>Debug Info:</div>
      <div>Role: {userRole}</div>
      <div>Email: {session?.user?.email}</div>
      <div>
        Name: {session?.user?.firstName} {session?.user?.lastName}
      </div>
    </div>
  );
}
