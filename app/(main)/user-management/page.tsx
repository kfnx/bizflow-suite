'use client';

import { useState, useCallback } from 'react';
import { RiAddLine } from '@remixicon/react';
import { useQueryClient } from '@tanstack/react-query';

import { Root as Button } from '@/components/ui/button';
import { PermissionGate } from '@/components/auth/permission-gate';
import { CreateUserModal } from '@/components/user-management/create-user-modal';
import { UsersTable } from './users-table';
import { Filters } from './filters';
import type { UsersFilters } from '@/hooks/use-users';

export default function UserManagementPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<UsersFilters>({});
  const queryClient = useQueryClient();

  const handleCreateSuccess = () => {
    // Invalidate and refetch users after successful creation
    queryClient.invalidateQueries({ queryKey: ['users'] });
  };

  const handleFiltersChange = useCallback((newFilters: {
    search: string;
    role: string;
    status: string;
    sortBy: string;
  }) => {
    const apiFilters: UsersFilters = {};

    if (newFilters.search) apiFilters.search = newFilters.search;
    if (newFilters.role && newFilters.role !== 'all') apiFilters.role = newFilters.role;
    if (newFilters.status && newFilters.status !== 'all') apiFilters.status = newFilters.status;
    if (newFilters.sortBy) apiFilters.sortBy = newFilters.sortBy;

    setFilters(apiFilters);
  }, []);

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

      {/* Users Table */}
      <PermissionGate permission="users:read">
        <Filters onFiltersChange={handleFiltersChange} />
        <UsersTable filters={filters} />
      </PermissionGate>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />
    </div>
  );
} 