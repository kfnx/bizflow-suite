'use client';

import { Suspense, useState } from 'react';
import { RiAddLine, RiSearchLine } from '@remixicon/react';

import { Root as Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PermissionGate } from '@/components/auth/permission-gate';
import { CreateUserModal } from '@/components/user-management/create-user-modal';
import { UsersTable } from './users-table';
import { UsersTableSkeleton } from './users-table-skeleton';
import { TransactionTablePagination, TransactionsTable, transactions } from '@/components/transactions-table';
import { Filters } from '../transactions/filters';

export default function UserManagementPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateSuccess = () => {
    // Trigger a refresh of the users table
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 font-semibold">User Management</h1>
          <p className="text-sm text-gray-600">
            Manage user accounts and permissions
          </p>
        </div>
        <PermissionGate permission="users:create">
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <RiAddLine className="size-4" />
            Add User
          </Button>
        </PermissionGate>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm">
          <RiSearchLine className="text-gray-400 absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            placeholder="Search users..."
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Filter by:</span>
          <select className="border-gray-300 text-sm rounded-md border px-3 py-2">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="staff">Staff</option>
            <option value="manager">Manager</option>
            <option value="director">Director</option>
          </select>
          <select className="border-gray-300 text-sm rounded-md border px-3 py-2">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <PermissionGate permission="users:read">
        <div className="border-gray-200 rounded-lg border bg-white">
          <Suspense fallback={<UsersTableSkeleton />}>
            <UsersTable refreshTrigger={refreshTrigger} />
          </Suspense>
        </div>
      </PermissionGate>

      <div className='flex flex-1 flex-col gap-4 px-4 py-6 lg:px-8'>
        <Filters />
        <TransactionsTable data={transactions} />
        <TransactionTablePagination />
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
} 