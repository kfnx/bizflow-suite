import { Suspense } from 'react';
import { Metadata } from 'next';

import RolesContent from './content';

export const metadata: Metadata = {
  title: 'Roles | MySTI',
  description: 'Manage user roles',
};

export default function RolesPage() {
  return (
    <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      <Suspense fallback={<div>Loading...</div>}>
        <RolesContent />
      </Suspense>
    </div>
  );
}