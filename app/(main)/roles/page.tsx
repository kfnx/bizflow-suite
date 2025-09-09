import { Suspense } from 'react';
import { Metadata } from 'next';

import RolesContent from './content';

export const metadata: Metadata = {
  title: 'Roles Management | MySTI',
  description: 'Manage user roles and assign permissions',
};

export default function RolesPage() {
  return (
    <div className='flex flex-1 flex-col gap-6 p-6'>
      <Suspense fallback={<div>Loading...</div>}>
        <RolesContent />
      </Suspense>
    </div>
  );
}
