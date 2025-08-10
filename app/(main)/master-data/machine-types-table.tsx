'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSaveLine,
  RiArrowUpSFill,
  RiArrowDownSFill,
  RiExpandUpDownFill,
} from '@remixicon/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type ColumnDef,
  flexRender,
} from '@tanstack/react-table';
import { toast } from 'sonner';

const getSortingIcon = (state: 'asc' | 'desc' | false) => {
  if (state === 'asc')
    return <RiArrowUpSFill className='size-5 text-text-sub-600' />;
  if (state === 'desc')
    return <RiArrowDownSFill className='size-5 text-text-sub-600' />;
  return <RiExpandUpDownFill className='size-5 text-text-sub-600' />;
};

import { Root as Button } from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Table from '@/components/ui/table';
import { PermissionGate } from '@/components/auth/permission-gate';

interface MachineType {
  id: string;
  name: string;
}

interface EditingMachineType extends MachineType {
  isNew?: boolean;
}

export function MachineTypesTable() {
  const queryClient = useQueryClient();
  const [editingItems, setEditingItems] = useState<
    Record<string, EditingMachineType>
  >({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const newItemIdRef = useRef(0);

  // Fetch machine types
  const { data, isLoading } = useQuery({
    queryKey: ['machine-types'],
    queryFn: async () => {
      const response = await fetch('/api/machine-types');
      if (!response.ok) throw new Error('Failed to fetch machine types');
      const result = await response.json();
      return result.data as MachineType[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (machineType: { name: string }) => {
      const response = await fetch('/api/machine-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machineType),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.details || error?.error || 'Failed to create machine type');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machine-types'] });
      toast.success('Machine type created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create machine type: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...machineType
    }: {
      id: string;
      name: string;
    }) => {
      const response = await fetch(`/api/machine-types/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machineType),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.details || error?.error || 'Failed to update machine type');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machine-types'] });
      toast.success('Machine type updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update machine type: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/machine-types/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error?.details || error?.error || 'Failed to delete machine type');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machine-types'] });
      toast.success('Machine type deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete machine type: ${error.message}`);
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

  const handleEdit = useCallback((machineType: MachineType) => {
    setEditingItems((prev) => ({
      ...prev,
      [machineType.id]: { ...machineType },
    }));
  }, []);

  const handleSave = useCallback(
    async (id: string) => {
      const editingMachineType = editingItems[id];
      if (!editingMachineType) return;

      if (!editingMachineType.name.trim()) {
        toast.error('Machine type name is required');
        return;
      }

      try {
        if (editingMachineType.isNew) {
          await createMutation.mutateAsync({
            name: editingMachineType.name,
          });
        } else {
          await updateMutation.mutateAsync({
            id: editingMachineType.id,
            name: editingMachineType.name,
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
      if (confirm('Are you sure you want to delete this machine type?')) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const handleFieldChange = useCallback(
    (id: string, field: keyof EditingMachineType, value: string) => {
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

  const machineTypes = data || [];
  const isEditing = (id: string) => id in editingItems;

  // Define columns
  const columns = useMemo<ColumnDef<MachineType>[]>(
    () => [
      {
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
        cell: ({ row }) => {
          const machineType = row.original;
          return (
            <Table.Cell>
              {isEditing(machineType.id) ? (
                <Input.Root className='w-full'>
                  <Input.Wrapper>
                    <Input.Input
                      value={editingItems[machineType.id]?.name || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          machineType.id,
                          'name',
                          e.target.value,
                        )
                      }
                      placeholder='Enter machine type (e.g., Excavator)'
                    />
                  </Input.Wrapper>
                </Input.Root>
              ) : (
                <span className='font-medium'>{machineType.name}</span>
              )}
            </Table.Cell>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const machineType = row.original;
          return (
            <Table.Cell>
              <div className='flex gap-2'>
                {isEditing(machineType.id) ? (
                  <>
                    <Button
                      size='small'
                      onClick={() => handleSave(machineType.id)}
                      disabled={updateMutation.isPending}
                    >
                      <RiSaveLine className='size-4' />
                    </Button>
                    <Button
                      size='small'
                      mode='stroke'
                      onClick={() => handleCancel(machineType.id)}
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
                        onClick={() => handleEdit(machineType)}
                      >
                        <RiEditLine className='size-4' />
                      </Button>
                    </PermissionGate>
                    <PermissionGate permission='products:delete'>
                      <Button
                        size='small'
                        mode='stroke'
                        onClick={() => handleDelete(machineType.id)}
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
    [editingItems, isEditing, handleFieldChange, handleSave, handleCancel, handleEdit, handleDelete, updateMutation.isPending, deleteMutation.isPending],
  );

  // Initialize table
  const table = useReactTable({
    data: machineTypes,
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
      <div className='flex justify-center py-8'>Loading machine types...</div>
    );
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>
          Manage equipment types (excavator, bulldozer, etc.)
        </p>
        <PermissionGate permission='products:create'>
          <Button onClick={handleAdd} className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            Add Machine Type
          </Button>
        </PermissionGate>
      </div>

      <Table.Root>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Head key={header.id} className={header.id === 'actions' ? 'w-32' : ''}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
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
                        placeholder='Enter machine type (e.g., Excavator)'
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

          {machineTypes.length === 0 &&
            Object.keys(editingItems).length === 0 && (
              <Table.Row>
                <Table.Cell
                  colSpan={2}
                  className='text-gray-500 py-8 text-center'
                >
                  No machine types found. Click &apos;Add Machine Type&apos; to
                  create one.
                </Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
