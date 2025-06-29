'use client';

import * as React from 'react';
import {
  RiDeleteBinLine,
  RiEditLine,
  RiMoreLine,
  RiUserLine,
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiExpandUpDownFill,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import { cn } from '@/utils/cn';
import { formatDate } from '@/utils/date-formatter';
import { Root as Avatar, Image as AvatarImage } from '@/components/ui/avatar';
import { Root as Badge } from '@/components/ui/badge';
import { Root as Button } from '@/components/ui/button';
import { Root as Dropdown, Trigger as DropdownTrigger, Content as DropdownContent, Item as DropdownItem } from '@/components/ui/dropdown';
import { PermissionGate } from '@/components/auth/permission-gate';
import { usePermissions } from '@/hooks/use-permissions';
import { useUsers, useDeleteUser, type User } from '@/hooks/use-users';
import * as Table from '@/components/ui/table';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

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

function ActionCell({ row }: { row: any }) {
  const { can, role: currentUserRole } = usePermissions();
  const deleteUserMutation = useDeleteUser();

  const canDeleteUser = (userRole: string) => {
    // Check if current user has delete permission
    if (!can('users:delete')) return false;

    // Check role hierarchy - can only delete users with equal or lower roles
    const roleOrder = ['staff', 'manager', 'director'];
    const currentUserRoleIndex = roleOrder.indexOf(currentUserRole);
    const targetUserRoleIndex = roleOrder.indexOf(userRole);

    return currentUserRoleIndex >= targetUserRoleIndex;
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(userId);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
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
          {canDeleteUser(row.original.role) && (
            <DropdownItem
              onClick={() => handleDeleteUser(row.original.id)}
              className="text-red-600"
            >
              <RiDeleteBinLine className="size-4" />
              Delete User
            </DropdownItem>
          )}
        </DropdownContent>
      </Dropdown>
    </PermissionGate>
  );
}

const columns: ColumnDef<User>[] = [
  {
    id: 'user',
    accessorKey: 'firstName',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        User
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar size="32" className="size-8">
          {row.original.avatar ? (
            <AvatarImage src={row.original.avatar} alt={`${row.original.firstName} ${row.original.lastName}`} />
          ) : (
            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiUserLine className="size-4 text-text-sub-600" />
            </div>
          )}
        </Avatar>
        <div className="ml-4">
          <div className='text-paragraph-sm text-text-strong-950'>
            {row.original.firstName} {row.original.lastName}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Email
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>{row.original.email}</div>
    ),
  },
  {
    id: 'phone',
    accessorKey: 'phone',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Phone
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.phone || '—'}
      </div>
    ),
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Role
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <Badge variant="light" color={getRoleColor(row.original.role)}>
        {row.original.role}
      </Badge>
    ),
  },
  {
    id: 'status',
    accessorKey: 'isActive',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Status
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <Badge variant="light" color={row.original.isActive ? "green" : "red"}>
        {row.original.isActive ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Created at
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {formatDate(row.original.createdAt)}
      </div>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ActionCell,
    meta: {
      className: 'px-5 w-0',
    },
  },
];

interface UsersTableProps {
  filters?: {
    search?: string;
    role?: string;
    status?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  };
}

export function UsersTable({ filters }: UsersTableProps) {
  const { data, isLoading, error } = useUsers(filters);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const table = useReactTable({
    data: data?.users || [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    initialState: {
      sorting: [
        {
          id: 'createdAt',
          desc: true,
        },
      ],
    },
  });

  if (isLoading) {
    return <div className="text-gray-500 p-4 text-center">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!data?.users || data.users.length === 0) {
    return (
      <div className="p-8 text-center">
        <RiUserLine className="text-gray-400 mx-auto size-12" />
        <h3 className="text-sm text-gray-900 mt-2 font-medium">No users found</h3>
        <p className="text-sm text-gray-500 mt-1">
          {filters?.search || filters?.role || filters?.status
            ? "No users match your current filters. Try adjusting your search criteria."
            : "Get started by creating a new user account."
          }
        </p>
      </div>
    );
  }

  return (
    <Table.Root className='relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[860px]'>
      <Table.Header className='whitespace-nowrap'>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Row key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <Table.Head
                  key={header.id}
                  className={header.column.columnDef.meta?.className}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                </Table.Head>
              );
            })}
          </Table.Row>
        ))}
      </Table.Header>
      <Table.Body>
        {table.getRowModel().rows?.length > 0 &&
          table.getRowModel().rows.map((row, i, arr) => (
            <React.Fragment key={row.id}>
              <Table.Row data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    className={cn(
                      'h-12',
                      cell.column.columnDef.meta?.className,
                    )}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext(),
                    )}
                  </Table.Cell>
                ))}
              </Table.Row>
              {i < arr.length - 1 && <Table.RowDivider />}
            </React.Fragment>
          ))}
      </Table.Body>
    </Table.Root>
  );
} 