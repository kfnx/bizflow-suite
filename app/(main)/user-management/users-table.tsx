'use client';

import { useEffect, useState, useCallback } from 'react';
import { RiDeleteBinLine, RiEditLine, RiMoreLine, RiUserLine } from '@remixicon/react';

import { Root as Avatar, Image as AvatarImage } from '@/components/ui/avatar';
import { Root as Badge } from '@/components/ui/badge';
import { Root as Button } from '@/components/ui/button';
import { Root as Dropdown, Trigger as DropdownTrigger, Content as DropdownContent, Item as DropdownItem } from '@/components/ui/dropdown';
import { PermissionGate } from '@/components/auth/permission-gate';
import { usePermissions } from '@/hooks/use-permissions';

type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
};

type UsersResponse = {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

interface UsersTableProps {
  refreshTrigger?: number;
}

export function UsersTable({ refreshTrigger = 0 }: UsersTableProps) {
  const { can, role: currentUserRole } = usePermissions();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'director':
        return 'purple';
      case 'manager':
        return 'blue';
      case 'staff':
        return 'orange';
      default:
        return 'gray';
    }
  };

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data: UsersResponse = await response.json();
      setUsers(data.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete user');
      }

      // Refresh the users list
      await fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const canDeleteUser = (userRole: string) => {
    // Check if current user has delete permission
    if (!can('users:delete')) return false;

    // Check role hierarchy - can only delete users with equal or lower roles
    const roleOrder = ['staff', 'manager', 'director'];
    const currentUserRoleIndex = roleOrder.indexOf(currentUserRole);
    const targetUserRoleIndex = roleOrder.indexOf(userRole);

    return currentUserRoleIndex >= targetUserRoleIndex;
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, refreshTrigger]);

  if (loading) {
    return <div className="text-gray-500 p-4 text-center">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="p-8 text-center">
        <RiUserLine className="text-gray-400 mx-auto size-12" />
        <h3 className="text-sm text-gray-900 mt-2 font-medium">No users found</h3>
        <p className="text-sm text-gray-500 mt-1">
          Get started by creating a new user account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="divide-gray-200 min-w-full divide-y">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              User
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Email
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Phone
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Role
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Status
            </th>
            <th className="text-xs text-gray-500 px-6 py-3 text-left font-medium uppercase tracking-wider">
              Created
            </th>
            <th className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-gray-200 divide-y bg-white">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center">
                  <Avatar size="32" className="size-8">
                    {user.avatar ? (
                      <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    ) : (
                      <div className="bg-gray-100 flex size-8 items-center justify-center rounded-full">
                        <RiUserLine className="text-gray-600 size-4" />
                      </div>
                    )}
                  </Avatar>
                  <div className="ml-4">
                    <div className="text-sm text-gray-900 font-medium">
                      {user.firstName} {user.lastName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <div className="text-sm text-gray-900">
                  {user.phone || '—'}
                </div>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Badge variant="light" color={getRoleColor(user.role)}>
                  {user.role}
                </Badge>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <Badge variant="light" color={user.isActive ? "green" : "red"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </td>
              <td className="text-sm text-gray-500 whitespace-nowrap px-6 py-4">
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
              <td className="text-sm whitespace-nowrap px-6 py-4 text-right font-medium">
                <PermissionGate permission="users:update">
                  <Dropdown>
                    <DropdownTrigger asChild>
                      <Button
                        variant="neutral"
                        mode="ghost"
                        size="xsmall"
                        className="h-8 w-8 p-0"
                      >
                        <RiMoreLine className="size-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownContent>
                      <DropdownItem>
                        <RiEditLine className="size-4" />
                        Edit User
                      </DropdownItem>
                      {canDeleteUser(user.role) && (
                        <DropdownItem
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <RiDeleteBinLine className="size-4" />
                          Delete User
                        </DropdownItem>
                      )}
                    </DropdownContent>
                  </Dropdown>
                </PermissionGate>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 