'use client';

import { useEffect, useState } from 'react';
import { RiEditLine, RiMoreLine, RiUserLine } from '@remixicon/react';

import { Root as Avatar, Image as AvatarImage } from '@/components/ui/avatar';
import { Root as Badge } from '@/components/ui/badge';
import { Root as Button } from '@/components/ui/button';
import { Root as Dropdown, Trigger as DropdownTrigger, Content as DropdownContent, Item as DropdownItem } from '@/components/ui/dropdown';

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

export function UsersTable() {
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

  useEffect(() => {
    async function fetchUsers() {
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
    }

    fetchUsers();
  }, []);

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
                  </DropdownContent>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 