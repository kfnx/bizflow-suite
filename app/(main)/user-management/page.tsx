import { Suspense } from 'react';
import { RiAddLine, RiSearchLine } from '@remixicon/react';

import { Root as Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UsersTable } from './users-table';
import { UsersTableSkeleton } from './users-table-skeleton';

export default function UserManagementPage() {
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
        <Button className="flex items-center gap-2">
          <RiAddLine className="size-4" />
          Add User
        </Button>
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
      <div className="border-gray-200 rounded-lg border bg-white">
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTable />
        </Suspense>
      </div>
    </div>
  );
} 