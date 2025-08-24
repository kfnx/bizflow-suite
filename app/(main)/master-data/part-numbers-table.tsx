'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  RiAddLine,
  RiArrowDownSFill,
  RiArrowUpSFill,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiExpandUpDownFill,
  RiSaveLine,
} from '@remixicon/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';
import { toast } from 'sonner';

import { Root as Button } from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Table from '@/components/ui/table';
import { PermissionGate } from '@/components/auth/permission-gate';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

interface PartNumber {
  id: string;
  name: string;
}

interface EditingPartNumber extends PartNumber {
  isNew?: boolean;
}

export function PartNumbersTable() {
  const queryClient = useQueryClient();
  const [editingItems, setEditingItems] = useState<
    Record<string, EditingPartNumber>
  >({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const newItemIdRef = useRef(0);

  // Fetch part numbers
  const { data, isLoading } = useQuery({
    queryKey: ['part-numbers'],
    queryFn: async () => {
      const response = await fetch('/api/part-numbers');
      if (!response.ok) throw new Error('Failed to fetch part numbers');
      const result = await response.json();
      return result.data as PartNumber[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (partNumber: { name: string }) => {
      const response = await fetch('/api/part-numbers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partNumber),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to create part number',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-numbers'] });
      toast.success('Part number created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create part number: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, ...partNumber }: { id: string; name: string }) => {
      const response = await fetch(`/api/part-numbers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partNumber),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to update part number',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-numbers'] });
      toast.success('Part number updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update part number: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/part-numbers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to delete part number',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['part-numbers'] });
      toast.success('Part number deleted successfully');
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleAdd = useCallback(() => {
    const newId = `new-${++newItemIdRef.current}`;
    setEditingItems((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        name: '',
        isNew: true,
      },
    }));
  }, []);

  const handleEdit = useCallback((partNumber: PartNumber) => {
    setEditingItems((prev) => ({
      ...prev,
      [partNumber.id]: { ...partNumber },
    }));
  }, []);

  const handleSave = useCallback(
    async (id: string) => {
      const editingPartNumber = editingItems[id];
      if (!editingPartNumber) return;

      if (!editingPartNumber.name.trim()) {
        toast.error('Part number name is required');
        return;
      }

      try {
        if (editingPartNumber.isNew) {
          await createMutation.mutateAsync({
            name: editingPartNumber.name,
          });
        } else {
          await updateMutation.mutateAsync({
            id: editingPartNumber.id,
            name: editingPartNumber.name,
          });
        }
        setEditingItems((prev) => {
          const { [id]: removed, ...rest } = prev;
          return rest;
        });
      } catch (error) {
        // Error handling is done in the mutation
      }
    },
    [editingItems, createMutation, updateMutation],
  );

  const handleCancel = useCallback((id: string) => {
    setEditingItems((prev) => {
      const { [id]: removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      if (confirm('Are you sure you want to delete this part number?')) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const handleFieldChange = useCallback(
    (id: string, field: keyof EditingPartNumber, value: string) => {
      setEditingItems((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: value,
        },
      }));
    },
    [],
  );

  const partNumbers = data || [];
  const isEditing = useCallback(
    (id: string) => id in editingItems,
    [editingItems],
  );

  // Define columns
  const columns = useMemo<ColumnDef<PartNumber>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <div className='flex items-center gap-0.5'>
            Name
            <button
              type='button'
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
            >
              {getSortingIcon(column.getIsSorted())}
            </button>
          </div>
        ),
        cell: ({ row }) => {
          const partNumber = row.original;
          return (
            <Table.Cell>
              {isEditing(partNumber.id) ? (
                <Input.Root className='w-full'>
                  <Input.Wrapper>
                    <Input.Input
                      value={editingItems[partNumber.id]?.name || ''}
                      onChange={(e) =>
                        handleFieldChange(partNumber.id, 'name', e.target.value)
                      }
                      maxLength={36}
                    />
                  </Input.Wrapper>
                </Input.Root>
              ) : (
                <span className='font-medium'>{partNumber.name}</span>
              )}
            </Table.Cell>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const partNumber = row.original;
          return (
            <Table.Cell>
              <div className='flex items-center gap-2'>
                {isEditing(partNumber.id) ? (
                  <>
                    <Button
                      size='small'
                      onClick={() => handleSave(partNumber.id)}
                      disabled={updateMutation.isPending}
                    >
                      <RiSaveLine className='size-4' />
                    </Button>
                    <Button
                      size='small'
                      mode='stroke'
                      onClick={() => handleCancel(partNumber.id)}
                    >
                      <RiCloseLine className='size-4' />
                    </Button>
                  </>
                ) : (
                  <>
                    <PermissionGate permission='products:update'>
                      <Button
                        size='small'
                        mode='stroke'
                        onClick={() => handleEdit(partNumber)}
                      >
                        <RiEditLine className='size-4' />
                      </Button>
                    </PermissionGate>
                    <PermissionGate permission='products:delete'>
                      <Button
                        size='small'
                        mode='stroke'
                        onClick={() => handleDelete(partNumber.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <RiDeleteBinLine className='size-4' />
                      </Button>
                    </PermissionGate>
                  </>
                )}
              </div>
            </Table.Cell>
          );
        },
      },
    ],
    [
      editingItems,
      isEditing,
      handleFieldChange,
      handleSave,
      handleCancel,
      handleEdit,
      handleDelete,
      updateMutation.isPending,
      deleteMutation.isPending,
    ],
  );

  // Initialize table
  const table = useReactTable({
    data: partNumbers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  if (isLoading) {
    return (
      <div className='flex justify-center py-8'>Loading part numbers...</div>
    );
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>Manage part numbers</p>
        <PermissionGate permission='products:create'>
          <Button onClick={handleAdd} className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            Add Part Number
          </Button>
        </PermissionGate>
      </div>

      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Head
                  key={header.id}
                  className={header.id === 'actions' ? 'w-32' : ''}
                >
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
          {/* New items being added */}
          {Object.values(editingItems)
            .filter((item) => item.isNew)
            .map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>
                  <Input.Root className='w-full'>
                    <Input.Wrapper>
                      <Input.Input
                        value={item.name}
                        onChange={(e) =>
                          handleFieldChange(item.id, 'name', e.target.value)
                        }
                        placeholder='Enter part number name'
                        maxLength={36}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </Table.Cell>
                <Table.Cell>
                  <div className='flex gap-2'>
                    <Button
                      size='small'
                      onClick={() => handleSave(item.id)}
                      disabled={createMutation.isPending}
                    >
                      <RiSaveLine className='size-4' />
                    </Button>
                    <Button
                      size='small'
                      mode='stroke'
                      onClick={() => handleCancel(item.id)}
                    >
                      <RiCloseLine className='size-4' />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}

          {/* Existing items */}
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}

          {partNumbers.length === 0 &&
            Object.keys(editingItems).length === 0 && (
              <Table.Row>
                <Table.Cell
                  colSpan={2}
                  className='text-gray-500 py-8 text-center'
                >
                  No part numbers found. Click &apos;Add Part Number&apos; to
                  create one.
                </Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
