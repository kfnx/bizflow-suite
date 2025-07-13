# DataTable Component

A reusable, feature-rich data table component built with React Table and TanStack Table. This component can be used for displaying any type of tabular data with built-in sorting, pagination, loading states, error handling, and customizable empty states.

## Features

- ✅ **Sortable columns** with visual indicators
- ✅ **Pagination** with configurable page sizes
- ✅ **Loading states** with customizable loading UI
- ✅ **Error handling** with error message display
- ✅ **Empty states** with customizable icons, titles, and actions
- ✅ **Row click handlers** for interactive tables
- ✅ **Responsive design** with mobile-friendly pagination
- ✅ **Customizable styling** with className props
- ✅ **Row dividers** option for better visual separation
- ✅ **Action columns** with proper event handling
- ✅ **TypeScript support** with full type safety

## Basic Usage

```tsx
import { type ColumnDef } from '@tanstack/react-table';

import {
  DataTable,
  getSortingIcon,
  type PaginationInfo,
} from '@/components/ui/data-table';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
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
  // ... more columns
];

export function UserTable() {
  const [users, setUsers] = React.useState<User[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  ]);

  const pagination: PaginationInfo = {
    page: 1,
    limit: 10,
    total: 1,
    totalPages: 1,
  };

  return (
    <DataTable
      data={users}
      columns={columns}
      pagination={pagination}
      onRowClick={(user) => console.log('User clicked:', user)}
    />
  );
}
```

## Props

### DataTableProps<TData>

| Prop              | Type                      | Required | Description                              |
| ----------------- | ------------------------- | -------- | ---------------------------------------- |
| `data`            | `TData[]`                 | ✅       | Array of data to display in the table    |
| `columns`         | `ColumnDef<TData>[]`      | ✅       | Column definitions for the table         |
| `pagination`      | `PaginationInfo`          | ❌       | Pagination information                   |
| `isLoading`       | `boolean`                 | ❌       | Whether the table is in loading state    |
| `error`           | `Error \| null`           | ❌       | Error object to display                  |
| `onRowClick`      | `(item: TData) => void`   | ❌       | Callback when a row is clicked           |
| `onPageChange`    | `(page: number) => void`  | ❌       | Callback when page changes               |
| `onLimitChange`   | `(limit: number) => void` | ❌       | Callback when page limit changes         |
| `emptyState`      | `EmptyStateConfig`        | ❌       | Configuration for empty state            |
| `className`       | `string`                  | ❌       | Additional CSS classes for the container |
| `tableClassName`  | `string`                  | ❌       | Additional CSS classes for the table     |
| `showRowDividers` | `boolean`                 | ❌       | Whether to show dividers between rows    |
| `initialSorting`  | `SortingState`            | ❌       | Initial sorting state                    |

### PaginationInfo

```tsx
interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### EmptyStateConfig

```tsx
interface EmptyStateConfig {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## Advanced Examples

### 1. Table with Custom Empty State

```tsx
import { RiUserLine } from '@remixicon/react';

const emptyState = {
  icon: RiUserLine,
  title: 'No users found',
  description: 'Get started by creating a new user.',
  action: {
    label: 'Add User',
    onClick: () => (window.location.href = '/users/new'),
  },
};

<DataTable data={users} columns={columns} emptyState={emptyState} />;
```

### 2. Table with Loading State

```tsx
<DataTable data={[]} columns={columns} isLoading={true} />
```

### 3. Table with Error State

```tsx
<DataTable
  data={[]}
  columns={columns}
  error={new Error('Failed to load users')}
/>
```

### 4. Table with Custom Styling

```tsx
<DataTable
  data={users}
  columns={columns}
  className='max-w-4xl'
  tableClassName='rounded-lg border border-stroke-soft-200 bg-bg-white-0'
  showRowDividers={true}
/>
```

### 5. Table with Action Column

```tsx
const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: 'actions',
    cell: ({ row }) => (
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button.Root variant='neutral' mode='ghost' size='xsmall'>
            <RiMoreLine className='size-4' />
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onClick={() => handleEdit(row.original)}>
            Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleDelete(row.original)}>
            Delete
          </Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    ),
    meta: {
      className: 'px-5 w-0', // Prevents row click on action column
    },
  },
];
```

## Migration from Existing Tables

### From QuotationsTable

**Before:**

```tsx
export function QuotationsTable({ filters, onPreview }: QuotationsTableProps) {
  const { data, isLoading, error } = useQuotations(filters);
  // ... complex table implementation
}
```

**After:**

```tsx
export function QuotationsTable({ filters, onPreview }: QuotationsTableProps) {
  const { data, isLoading, error } = useQuotations(filters);

  const columns = React.useMemo(() => createColumns(), []);

  const handleRowClick = React.useCallback(
    (quotation: Quotation) => {
      onPreview?.(quotation.id);
    },
    [onPreview],
  );

  return (
    <DataTable
      data={data?.data || []}
      columns={columns}
      pagination={data?.pagination}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      emptyState={{
        icon: RiFileTextLine,
        title: 'No quotations found',
        description: 'Get started by creating a new quotation.',
        action: {
          label: 'Create Quotation',
          onClick: () => (window.location.href = '/quotations/new'),
        },
      }}
      showRowDividers={true}
    />
  );
}
```

### From WarehousesTable

**Before:**

```tsx
export function WarehousesTable({ warehouses, pagination, ... }: WarehousesTableProps) {
  // ... complex table implementation with manual pagination
}
```

**After:**

```tsx
export function WarehousesTable({ warehouses, pagination, ... }: WarehousesTableProps) {
  const columns = React.useMemo(() => createColumns(), []);

  const handleRowClick = React.useCallback(
    (warehouse: Warehouse) => {
      onWarehouseSelect?.(warehouse.id);
    },
    [onWarehouseSelect],
  );

  return (
    <DataTable
      data={warehouses}
      columns={columns}
      pagination={pagination}
      isLoading={isLoading}
      error={error}
      onRowClick={handleRowClick}
      onPageChange={onPageChange}
      onLimitChange={onLimitChange}
      emptyState={{
        icon: RiStoreLine,
        title: 'No warehouses found',
        description: 'Create your first warehouse to get started.',
        action: {
          label: 'Add Warehouse',
          onClick: () => window.location.href = '/warehouses/new',
        },
      }}
      tableClassName='rounded-lg border border-stroke-soft-200 bg-bg-white-0'
    />
  );
}
```

## Benefits of Using DataTable

1. **Consistency**: All tables across the application will have the same look and behavior
2. **Maintainability**: Changes to table functionality only need to be made in one place
3. **Performance**: Optimized with React.memo and useCallback for better performance
4. **Accessibility**: Built-in accessibility features and keyboard navigation
5. **Type Safety**: Full TypeScript support with proper type inference
6. **Flexibility**: Highly customizable while maintaining consistency
7. **Testing**: Easier to test with a single component to focus on

## Best Practices

1. **Use React.useMemo for columns**: Prevent unnecessary re-renders
2. **Use React.useCallback for event handlers**: Optimize performance
3. **Provide meaningful empty states**: Help users understand what to do next
4. **Handle loading and error states**: Always provide feedback to users
5. **Use proper TypeScript types**: Ensure type safety throughout
6. **Customize styling with className props**: Maintain design system consistency
7. **Handle action column clicks properly**: Use `e.stopPropagation()` to prevent row clicks

## Dependencies

- `@tanstack/react-table`: Core table functionality
- `@remixicon/react`: Icons
- `react`: React framework
- Tailwind CSS: Styling
- Custom UI components: Button, Dropdown, Pagination, Select, Table
