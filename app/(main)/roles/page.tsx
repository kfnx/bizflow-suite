import { Suspense } from 'react';
import { Metadata } from 'next';

import RolesContent from './content';
import { PermissionGate } from '@/components/auth/permission-gate';
import { Loading } from '@/components/ui/loading';

export const metadata: Metadata = {
  title: 'Roles Management | MySTI',
  description: 'Manage user roles and assign permissions',
};

export default function RolesPage() {
  return (
    <PermissionGate permission='roles:read'>
      <div className='flex flex-1 flex-col gap-6 p-6'>
        <Suspense fallback={<Loading className="min-h-64" />}>
          <RolesContent />
        </Suspense>
      </div>
    </PermissionGate>
  );
}
