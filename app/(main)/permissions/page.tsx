import { Suspense } from 'react';
import { Metadata } from 'next';

import PermissionsContent from './content';

export const metadata: Metadata = {
  title: 'Permissions | MySTI',
  description: 'Manage system permissions',
};

export default function PermissionsPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <Suspense fallback={<div>Loading...</div>}>
        <PermissionsContent />
      </Suspense>
    </div>
  );
}