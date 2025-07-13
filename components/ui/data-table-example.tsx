'use client';

import * as React from 'react';
import { RiFileTextLine, RiStoreLine, RiUserLine } from '@remixicon/react';
import { type ColumnDef } from '@tanstack/react-table';

import {
  DataTable,
  getSortingIcon,
  type PaginationInfo,
} from '@/components/ui/data-table';

// Example 1: Simple User Table
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const userColumns: ColumnDef<User>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Name
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
        {row.original.name}
      </div>
    ),
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.email}
      </div>
    ),
  },
  {
    id: 'role',
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.role}
      </div>
    ),
  },
];

export function UserTableExample() {
  const [users, setUsers] = React.useState<User[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      createdAt: '2024-01-01',
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      createdAt: '2024-01-02',
    },
  ]);

  const pagination: PaginationInfo = {
    page: 1,
    limit: 10,
    total: 2,
    totalPages: 1,
  };

  const handleRowClick = (user: User) => {
    console.log('User clicked:', user);
  };

  const emptyState = {
    icon: RiUserLine,
    title: 'No users found',
    description: 'Get started by creating a new user.',
    action: {
      label: 'Add User',
      onClick: () => console.log('Add user clicked'),
    },
  };

  return (
    <DataTable
      data={users}
      columns={userColumns}
      pagination={pagination}
      onRowClick={handleRowClick}
      emptyState={emptyState}
    />
  );
}

// Example 2: Document Table with Custom Styling
interface Document {
  id: string;
  title: string;
  type: string;
  size: string;
  lastModified: string;
}

const documentColumns: ColumnDef<Document>[] = [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Document
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className='bg-gray-100 flex size-8 shrink-0 items-center justify-center rounded'>
          <RiFileTextLine className='text-gray-600 size-4' />
        </div>
        <div className='text-paragraph-sm text-text-sub-600'>
          {row.original.title}
        </div>
      </div>
    ),
  },
  {
    id: 'type',
    accessorKey: 'type',
    header: 'Type',
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.type}
      </div>
    ),
  },
  {
    id: 'size',
    accessorKey: 'size',
    header: 'Size',
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.size}
      </div>
    ),
  },
];

export function DocumentTableExample() {
  const [documents, setDocuments] = React.useState<Document[]>([
    {
      id: '1',
      title: 'Report.pdf',
      type: 'PDF',
      size: '2.5 MB',
      lastModified: '2024-01-01',
    },
    {
      id: '2',
      title: 'Presentation.pptx',
      type: 'PowerPoint',
      size: '5.1 MB',
      lastModified: '2024-01-02',
    },
  ]);

  const emptyState = {
    icon: RiFileTextLine,
    title: 'No documents found',
    description: 'Upload your first document to get started.',
    action: {
      label: 'Upload Document',
      onClick: () => console.log('Upload clicked'),
    },
  };

  return (
    <DataTable
      data={documents}
      columns={documentColumns}
      onRowClick={(doc) => console.log('Document clicked:', doc)}
      emptyState={emptyState}
      showRowDividers={true}
      className='max-w-4xl'
    />
  );
}

// Example 3: Warehouse Table with Custom Table Styling
interface SimpleWarehouse {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive';
}

const warehouseColumns: ColumnDef<SimpleWarehouse>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => (
      <div className='flex items-center gap-0.5'>
        Warehouse
        <button
          type='button'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {getSortingIcon(column.getIsSorted())}
        </button>
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center gap-3'>
        <div className='flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 ring-1 ring-inset ring-blue-200'>
          <RiStoreLine className='size-5 text-blue-600' />
        </div>
        <div className='text-paragraph-sm text-text-strong-950'>
          {row.original.name}
        </div>
      </div>
    ),
  },
  {
    id: 'location',
    accessorKey: 'location',
    header: 'Location',
    cell: ({ row }) => (
      <div className='text-paragraph-sm text-text-sub-600'>
        {row.original.location}
      </div>
    ),
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div
        className={`text-xs inline-flex rounded-full px-2 py-1 font-medium ${
          row.original.status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800'
        }`}
      >
        {row.original.status}
      </div>
    ),
  },
];

export function WarehouseTableExample() {
  const [warehouses, setWarehouses] = React.useState<SimpleWarehouse[]>([
    { id: '1', name: 'Main Warehouse', location: 'New York', status: 'active' },
    {
      id: '2',
      name: 'Secondary Warehouse',
      location: 'Los Angeles',
      status: 'inactive',
    },
  ]);

  const pagination: PaginationInfo = {
    page: 1,
    limit: 25,
    total: 2,
    totalPages: 1,
  };

  const handlePageChange = (page: number) => {
    console.log('Page changed to:', page);
  };

  const handleLimitChange = (limit: number) => {
    console.log('Limit changed to:', limit);
  };

  const emptyState = {
    icon: RiStoreLine,
    title: 'No warehouses found',
    description: 'Create your first warehouse to get started.',
    action: {
      label: 'Create Warehouse',
      onClick: () => console.log('Create warehouse clicked'),
    },
  };

  return (
    <DataTable
      data={warehouses}
      columns={warehouseColumns}
      pagination={pagination}
      onPageChange={handlePageChange}
      onLimitChange={handleLimitChange}
      onRowClick={(warehouse) => console.log('Warehouse clicked:', warehouse)}
      emptyState={emptyState}
      tableClassName='rounded-lg border border-stroke-soft-200 bg-bg-white-0'
    />
  );
}

// Example 4: Loading and Error States
export function LoadingTableExample() {
  return <DataTable data={[]} columns={userColumns} isLoading={true} />;
}

export function ErrorTableExample() {
  const error = new Error('Failed to load data from server');

  return <DataTable data={[]} columns={userColumns} error={error} />;
}
