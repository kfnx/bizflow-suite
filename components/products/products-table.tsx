'use client';

import * as React from 'react';
import {
  RiArrowDownSFill,
  RiArrowLeftDoubleLine,
  RiArrowLeftSLine,
  RiArrowRightDoubleLine,
  RiArrowRightSLine,
  RiArrowUpSFill,
  RiBuildingLine,
  RiExpandUpDownFill,
  RiFileTextLine,
} from '@remixicon/react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import { formatCurrency } from '@/utils/number-formatter';
import { useProducts, type ProductWithRelations } from '@/hooks/use-products';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import * as Pagination from '@/components/ui/pagination';
import * as Select from '@/components/ui/select';
import * as Table from '@/components/ui/table';
import { ProductPreviewDrawer } from '@/components/products/product-preview-drawer';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

interface ProductsTableProps {
  filters: {
    search: string;
    category: string;
    brand: string;
    sortBy: string;
    page?: number;
    limit?: number;
  };
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function ProductsTable({
  filters,
  onPageChange,
  onLimitChange,
}: ProductsTableProps) {
  const { data, isLoading, error } = useProducts(filters);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [quickViewProduct, setQuickViewProduct] =
    React.useState<ProductWithRelations | null>(null);

  const handleRowClick = (product: ProductWithRelations) => {
    setQuickViewProduct(product);
  };

  const columns: ColumnDef<ProductWithRelations>[] = [
    {
      id: 'product',
      accessorKey: 'name',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5'>
          Product
          <button
            type='button'
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            {getSortingIcon(column.getIsSorted())}
          </button>
        </div>
      ),
      cell: ({ row }) => (
        <div className='flex flex-col'>
          <div className='text-paragraph-md font-medium text-text-sub-600'>
            {row.original.name || 'Unnamed Product'}
          </div>
          <div className='text-paragraph-sm text-text-soft-400'>
            {row.original.brandName && `${row.original.brandName} • `}
            {row.original.category || 'Uncategorized'}
            {row.original.partNumber && ` • ${row.original.partNumber}`}
          </div>
        </div>
      ),
    },
    {
      id: 'price',
      accessorKey: 'price',
      header: ({ column }) => (
        <div className='flex items-center gap-0.5 text-right'>
          Price
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
          {formatCurrency(parseInt(row.original.price), 'IDR')}
        </div>
      ),
    },
    {
      id: 'warehouse',
      header: 'Warehouse',
      cell: ({ row }) => (
        <div className='flex items-center gap-1 text-paragraph-sm text-text-sub-600'>
          <RiBuildingLine className='size-4 text-text-soft-400' />
          <span className='max-w-32 truncate'>
            {row.original.warehouseName || 'No Warehouse'}
          </span>
        </div>
      ),
    },
    {
      id: 'stock',
      header: 'Stock',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <Badge.Root
            variant='lighter'
            color={
              row.original.condition === 'new'
                ? 'green'
                : row.original.condition === 'used'
                  ? 'orange'
                  : row.original.condition === 'refurbished'
                    ? 'blue'
                    : 'gray'
            }
            className='text-xs px-1 py-0'
          >
            {row.original.condition}
          </Badge.Root>
          <span className='font-medium text-text-sub-600'>
            {row.original.quantity?.toLocaleString() || 0}
          </span>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: data?.data || [],
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
    return <Loading className='min-h-64' />;
  }

  if (error) {
    return (
      <div className='p-4 text-center text-red-500'>Error: {error.message}</div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className='p-8 text-center'>
        <RiFileTextLine className='text-gray-400 mx-auto size-12' />
        <h3 className='text-gray-900 mt-2 text-paragraph-sm font-medium'>
          No products found
        </h3>
        <p className='text-gray-500 mt-1 text-paragraph-sm'>
          {filters?.search || filters?.category || filters?.brand
            ? 'No products match your current filters. Try adjusting your search criteria.'
            : 'Get started by adding a new product.'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='space-y-4'>
        <Table.Root>
          <Table.Header>
            {table.getHeaderGroups().map((headerGroup) => (
              <Table.Row key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Table.Head key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </Table.Head>
                ))}
              </Table.Row>
            ))}
          </Table.Header>
          <Table.Body>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <Table.Row
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='cursor-pointer hover:bg-bg-soft-200'
                  onClick={() => handleRowClick(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <Table.Cell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </Table.Cell>
                  ))}
                </Table.Row>
              ))
            ) : (
              <Table.Row>
                <Table.Cell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>

        <ProductsTablePagination
          data={data.pagination}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
        />
      </div>

      <ProductPreviewDrawer
        product={quickViewProduct}
        open={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </>
  );
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface ProductsTablePaginationProps {
  data: PaginationData;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function ProductsTablePagination({
  data,
  onPageChange,
  onLimitChange,
}: ProductsTablePaginationProps) {
  const currentPage = data.page;
  const totalPages = data.totalPages;
  const limit = data.limit;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange?.(page);
    }
  };

  const handleLimitChange = (newLimit: string) => {
    const limitNumber = parseInt(newLimit);
    if (limitNumber !== limit) {
      onLimitChange?.(limitNumber);
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, current page, and neighbors
      if (currentPage <= 3) {
        // Near the beginning
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className='mt-auto'>
      <div className='mt-4 flex items-center justify-between py-4 lg:hidden'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button.Root>
        <span className='whitespace-nowrap text-center text-paragraph-sm text-text-sub-600'>
          Page {currentPage} of {totalPages}
        </span>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='xsmall'
          className='w-28'
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button.Root>
      </div>
      <div className='mt-10 hidden items-center gap-3 lg:flex'>
        <span className='flex-1 whitespace-nowrap text-paragraph-sm text-text-sub-600'>
          Page {currentPage} of {totalPages}
        </span>

        <Pagination.Root>
          <Pagination.NavButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(1)}
          >
            <Pagination.NavIcon as={RiArrowLeftDoubleLine} />
          </Pagination.NavButton>
          <Pagination.NavButton
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <Pagination.NavIcon as={RiArrowLeftSLine} />
          </Pagination.NavButton>

          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className='px-2 text-text-sub-600'>...</span>
              ) : (
                <Pagination.Item
                  current={page === currentPage}
                  onClick={() => handlePageChange(page as number)}
                >
                  {page}
                </Pagination.Item>
              )}
            </React.Fragment>
          ))}

          <Pagination.NavButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <Pagination.NavIcon as={RiArrowRightSLine} />
          </Pagination.NavButton>
          <Pagination.NavButton
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(totalPages)}
          >
            <Pagination.NavIcon as={RiArrowRightDoubleLine} />
          </Pagination.NavButton>
        </Pagination.Root>

        <div className='flex flex-1 justify-end'>
          <Select.Root
            size='xsmall'
            value={limit.toString()}
            onValueChange={handleLimitChange}
          >
            <Select.Trigger className='w-auto'>
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              <Select.Item value='7'>7 / page</Select.Item>
              <Select.Item value='15'>15 / page</Select.Item>
              <Select.Item value='50'>50 / page</Select.Item>
              <Select.Item value='100'>100 / page</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}
