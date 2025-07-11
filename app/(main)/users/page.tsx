'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiAddLine } from '@remixicon/react';

import type { UsersFilters } from '@/hooks/use-users';
import { Root as Button } from '@/components/ui/button';
import { PermissionGate } from '@/components/auth/permission-gate';
import { UserPreviewDrawer } from '@/components/user-preview-drawer';

import { Filters } from './filters';
import { UsersTable } from './users-table';

export default function UserManagementPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<UsersFilters>({});
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const handleFiltersChange = useCallback(
    (newFilters: {
      search: string;
      role: string;
      status: string;
      sortBy: string;
    }) => {
      const apiFilters: UsersFilters = {};

      if (newFilters.search) apiFilters.search = newFilters.search;
      if (newFilters.role && newFilters.role !== 'all')
        apiFilters.role = newFilters.role;
      if (newFilters.status && newFilters.status !== 'all')
        apiFilters.status = newFilters.status;
      if (newFilters.sortBy) apiFilters.sortBy = newFilters.sortBy;

      setFilters(apiFilters);
    },
    [],
  );

  const handleUserClick = useCallback((userId: string) => {
    setSelectedUserId(userId);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedUserId(null);
  }, []);

  return (
    <div className='flex flex-col gap-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl text-gray-900 font-semibold'>Users</h1>
          <p className='text-sm text-gray-600'>
            Manage user accounts and permissions
          </p>
        </div>
        <PermissionGate permission='users:create'>
          <Button
            className='flex items-center gap-2'
            onClick={() => router.push('/users/new')}
          >
            <RiAddLine className='size-4' />
            Add User
          </Button>
        </PermissionGate>
      </div>

      {/* Users Table */}
      <PermissionGate permission='users:read'>
        <Filters onFiltersChange={handleFiltersChange} />
        <UsersTable filters={filters} onUserClick={handleUserClick} />
      </PermissionGate>

      <UserPreviewDrawer
        userId={selectedUserId}
        open={!!selectedUserId}
        onClose={handleCloseDrawer}
      />
    </div>
  );
}
