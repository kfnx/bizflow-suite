'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiEditLine,
  RiExpandUpDownFill,
  RiLockPasswordLine,
  RiMoreLine,
  RiUserLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

import { cn } from '@/utils/cn';
import { usePermissions } from '@/hooks/use-permissions';
import { useResetUserPassword, useUsers, type User } from '@/hooks/use-users';
import { Root as Avatar, Image as AvatarImage } from '@/components/ui/avatar';
import { Root as Badge } from '@/components/ui/badge';
import { Root as Button } from '@/components/ui/button';
import {
  Root as Dropdown,
  Content as DropdownContent,
  Item as DropdownItem,
  Trigger as DropdownTrigger,
} from '@/components/ui/dropdown';
import * as Table from '@/components/ui/table';
import { PermissionGate } from '@/components/auth/permission-gate';
import { Loading } from '@/components/ui/loading';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

const getRoleColor = () => {
  return 'blue' as const; // Use consistent color for all roles since they're dynamic
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'full-time':
      return 'green';
    case 'contract':
      return 'blue';
    case 'resigned':
      return 'red';
    default:
      return 'gray';
  }
};

function ActionCell({ row }: { row: any }) {
  const { data: session } = useSession();
  const resetPasswordMutation = useResetUserPassword();

  const handleResetPassword = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click

    if (
      !confirm(
        `Are you sure you want to reset ${row.original.firstName} ${row.original.lastName}'s password? This will set their password to the default password.`,
      )
    ) {
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync(row.original.id);
      toast.warning('Password reset successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <PermissionGate permission='users:update'>
      <Dropdown>
        <DropdownTrigger asChild>
          <Button
            variant='neutral'
            mode='ghost'
            size='xsmall'
            className='h-8 w-8 p-0'
            onClick={(e) => e.stopPropagation()}
          >
            <RiMoreLine className='size-4' />
          </Button>
        </DropdownTrigger>
        <DropdownContent>
          <DropdownItem
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/users/${row.original.id}/edit`;
            }}
          >
            <RiEditLine className='size-4' />
            Edit User
          </DropdownItem>
          {session?.user?.isAdmin && (
            <DropdownItem
              onClick={handleResetPassword}
              disabled={resetPasswordMutation.isPending}
            >
              <RiLockPasswordLine className='size-4' />
              {resetPasswordMutation.isPending
                ? 'Resetting...'
                : 'Reset Password'}
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
      <div className='flex items-center'>
        <Avatar size='32' className='size-8'>
          {row.original.avatar ? (
            <AvatarImage
              src={row.original.avatar}
              alt={`${row.original.firstName} ${row.original.lastName}`}
            />
          ) : (
            <div className='flex size-8 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
              <RiUserLine className='size-4 text-text-sub-600' />
            </div>
          )}
        </Avatar>
        <div className='ml-4'>
          <div className='text-paragraph-sm text-text-strong-950'>
            {row.original.firstName} {row.original.lastName}
          </div>
          {row.original.jobTitle && (
            <div className='text-paragraph-xs text-text-sub-600'>
              {row.original.jobTitle}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Contact
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div>
        <div className='text-paragraph-sm text-text-sub-600'>
          {row.original.email}
        </div>
        <div className='text-paragraph-sm text-text-soft-400'>
          {row.original.phone || '—'}
        </div>
      </div>
    ),
  },
  {
    id: 'branch',
    accessorKey: 'branchName',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Branch
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <p className='text-paragraph-sm text-text-sub-600'>
        {row.original.branchName || '—'}
      </p>
    ),
  },
  {
    id: 'role',
    accessorKey: 'roleName',
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
      <div>
        {row.original.roleName ? (
          <Badge variant='lighter' color={getRoleColor()}>
            {row.original.roleName}
          </Badge>
        ) : (
          <span className='text-paragraph-sm text-text-sub-600'>No role</span>
        )}
      </div>
    ),
  },
  {
    id: 'isAdmin',
    accessorKey: 'isAdmin',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Admin
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <Badge variant='lighter' color={row.original.isAdmin ? 'purple' : 'gray'}>
        {row.original.isAdmin ? 'Admin' : 'User'}
      </Badge>
    ),
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Type
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <Badge
        variant='lighter'
        color={getTypeColor(row.original.type || 'full-time')}
      >
        {row.original.type || 'full-time'}
      </Badge>
    ),
  },
  {
    id: 'joinDate',
    accessorKey: 'joinDate',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Join Date
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
        {row.original.joinDate
          ? new Date(row.original.joinDate).toLocaleDateString()
          : '—'}
      </div>
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
      <Badge variant='lighter' color={row.original.isActive ? 'green' : 'red'}>
        {row.original.isActive ? 'Active' : 'Inactive'}
      </Badge>
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
    branch?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  };
  onUserClick?: (userId: string) => void;
}

export function UsersTable({ filters, onUserClick }: UsersTableProps) {
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
    return <Loading className="min-h-64" />;
  }

  if (error) {
    return (
      <div className='p-4 text-center text-red-500'>Error: {error.message}</div>
    );
  }

  if (!data?.users || data.users.length === 0) {
    return (
      <div className='p-8 text-center'>
        <RiUserLine className='text-gray-400 mx-auto size-12' />
        <h3 className='text-sm text-gray-900 mt-2 font-medium'>
          No users found
        </h3>
        <p className='text-sm text-gray-500 mt-1'>
          {filters?.search ||
          filters?.role ||
          filters?.status ||
          filters?.branch
            ? 'No users match your current filters. Try adjusting your search criteria.'
            : 'Get started by creating a new user account.'}
        </p>
      </div>
    );
  }

  return (
    <Table.Root className='relative left-1/2 w-screen -translate-x-1/2 px-4 lg:mx-0 lg:w-full lg:px-0 [&>table]:min-w-[1000px]'>
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
              <Table.Row
                data-state={row.getIsSelected() && 'selected'}
                className='cursor-pointer hover:bg-bg-soft-200'
                onClick={() => onUserClick?.(row.original.id)}
              >
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell
                    key={cell.id}
                    className={cn(
                      'h-12',
                      cell.column.columnDef.meta?.className,
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
