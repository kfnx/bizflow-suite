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

interface UnitOfMeasure {
  id: string;
  name: string;
  abbreviation: string;
}

interface EditingUnitOfMeasure extends UnitOfMeasure {
  isNew?: boolean;
}

export function UnitOfMeasuresTable() {
  const queryClient = useQueryClient();
  const [editingItems, setEditingItems] = useState<
    Record<string, EditingUnitOfMeasure>
  >({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const newItemIdRef = useRef(0);

  // Fetch unit of measures
  const { data, isLoading } = useQuery({
    queryKey: ['unit-of-measures'],
    queryFn: async () => {
      const response = await fetch('/api/unit-of-measures');
      if (!response.ok) throw new Error('Failed to fetch unit of measures');
      const result = await response.json();
      return result.data as UnitOfMeasure[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (uom: { name: string; abbreviation: string }) => {
      const response = await fetch('/api/unit-of-measures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uom),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to create unit of measure',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-of-measures'] });
      toast.success('Unit of measure created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create unit of measure: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...uom
    }: {
      id: string;
      name: string;
      abbreviation: string;
    }) => {
      const response = await fetch(`/api/unit-of-measures/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(uom),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to update unit of measure',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-of-measures'] });
      toast.success('Unit of measure updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update unit of measure: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/unit-of-measures/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to delete unit of measure',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-of-measures'] });
      toast.success('Unit of measure deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete unit of measure: ${error.message}`);
    },
  });

  const handleAdd = useCallback(() => {
    const newId = `new-${++newItemIdRef.current}`;
    setEditingItems((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        name: '',
        abbreviation: '',
        isNew: true,
      },
    }));
  }, []);

  const handleEdit = useCallback((uom: UnitOfMeasure) => {
    setEditingItems((prev) => ({
      ...prev,
      [uom.id]: { ...uom },
    }));
  }, []);

  const handleSave = useCallback(
    async (id: string) => {
      const editingUom = editingItems[id];
      if (!editingUom) return;

      if (!editingUom.name.trim()) {
        toast.error('Unit name is required');
        return;
      }

      if (!editingUom.abbreviation.trim()) {
        toast.error('Abbreviation is required');
        return;
      }

      try {
        if (editingUom.isNew) {
          await createMutation.mutateAsync({
            name: editingUom.name,
            abbreviation: editingUom.abbreviation,
          });
        } else {
          await updateMutation.mutateAsync({
            id: editingUom.id,
            name: editingUom.name,
            abbreviation: editingUom.abbreviation,
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
      if (confirm('Are you sure you want to delete this unit of measure?')) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const handleFieldChange = useCallback(
    (id: string, field: keyof EditingUnitOfMeasure, value: string) => {
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

  const unitOfMeasures = data || [];
  const isEditing = useCallback((id: string) => id in editingItems, [editingItems]);

  // Define columns
  const columns = useMemo<ColumnDef<UnitOfMeasure>[]>(
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
          const uom = row.original;
          return (
            <Table.Cell>
              {isEditing(uom.id) ? (
                <Input.Root className='w-full'>
                  <Input.Wrapper>
                    <Input.Input
                      value={editingItems[uom.id]?.name || ''}
                      onChange={(e) =>
                        handleFieldChange(uom.id, 'name', e.target.value)
                      }
                      maxLength={36}
                    />
                  </Input.Wrapper>
                </Input.Root>
              ) : (
                <span className='font-medium'>{uom.name}</span>
              )}
            </Table.Cell>
          );
        },
      },
      {
        accessorKey: 'abbreviation',
        header: ({ column }) => (
          <div className='flex items-center gap-0.5'>
            Abbreviation
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
          const uom = row.original;
          return (
            <Table.Cell>
              {isEditing(uom.id) ? (
                <Input.Root className='w-full'>
                  <Input.Wrapper>
                    <Input.Input
                      value={editingItems[uom.id]?.abbreviation || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          uom.id,
                          'abbreviation',
                          e.target.value,
                        )
                      }
                    />
                  </Input.Wrapper>
                </Input.Root>
              ) : (
                <span className='text-sm bg-gray-100 rounded px-2 py-1 font-mono'>
                  {uom.abbreviation}
                </span>
              )}
            </Table.Cell>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const uom = row.original;
          return (
            <Table.Cell>
              <div className='flex gap-2'>
                {isEditing(uom.id) ? (
                  <>
                    <Button
                      size='small'
                      onClick={() => handleSave(uom.id)}
                      disabled={updateMutation.isPending}
                    >
                      <RiSaveLine className='size-4' />
                    </Button>
                    <Button
                      size='small'
                      mode='stroke'
                      onClick={() => handleCancel(uom.id)}
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
                        onClick={() => handleEdit(uom)}
                      >
                        <RiEditLine className='size-4' />
                      </Button>
                    </PermissionGate>
                    <PermissionGate permission='products:delete'>
                      <Button
                        size='small'
                        mode='stroke'
                        onClick={() => handleDelete(uom.id)}
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
    data: unitOfMeasures,
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
      <div className='flex justify-center py-8'>
        Loading unit of measures...
      </div>
    );
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>
          Manage measurement units (kg, pcs, etc.)
        </p>
        <PermissionGate permission='products:create'>
          <Button onClick={handleAdd} className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            Add Unit of Measure
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
                        placeholder='Enter unit name (e.g., Kilogram)'
                        maxLength={36}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </Table.Cell>
                <Table.Cell>
                  <Input.Root className='w-full'>
                    <Input.Wrapper>
                      <Input.Input
                        value={item.abbreviation}
                        onChange={(e) =>
                          handleFieldChange(
                            item.id,
                            'abbreviation',
                            e.target.value,
                          )
                        }
                        placeholder='Enter abbreviation (e.g., kg)'
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

          {unitOfMeasures.length === 0 &&
            Object.keys(editingItems).length === 0 && (
              <Table.Row>
                <Table.Cell
                  colSpan={3}
                  className='text-gray-500 py-8 text-center'
                >
                  No unit of measures found. Click &apos;Add Unit of
                  Measure&apos; to create one.
                </Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
