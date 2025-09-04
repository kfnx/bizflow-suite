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

interface MachineModel {
  id: string;
  name: string;
}

interface EditingMachineModel extends MachineModel {
  isNew?: boolean;
}

export function MachineModelTable() {
  const queryClient = useQueryClient();
  const [editingItems, setEditingItems] = useState<
    Record<string, EditingMachineModel>
  >({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const newItemIdRef = useRef(0);

  // Fetch machine model
  const { data, isLoading } = useQuery({
    queryKey: ['machine-model'],
    queryFn: async () => {
      const response = await fetch('/api/machine-model');
      if (!response.ok) throw new Error('Failed to fetch machine model');
      const result = await response.json();
      return result.data as MachineModel[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (machineModel: { name: string }) => {
      const response = await fetch('/api/machine-model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machineModel),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to create machine model',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machine-model'] });
      toast.success('Machine model created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create machine model: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...machineModel
    }: {
      id: string;
      name: string;
    }) => {
      const response = await fetch(`/api/machine-model/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machineModel),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to update machine model',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machine-model'] });
      toast.success('Machine model updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update machine model: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/machine-model/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          error?.details || error?.error || 'Failed to delete machine model',
        );
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['machine-model'] });
      toast.success('Machine model deleted successfully');
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

  const handleEdit = useCallback((machineModel: MachineModel) => {
    setEditingItems((prev) => ({
      ...prev,
      [machineModel.id]: { ...machineModel },
    }));
  }, []);

  const handleSave = useCallback(
    async (id: string) => {
      const editingMachineModel = editingItems[id];
      if (!editingMachineModel) return;

      if (!editingMachineModel.name.trim()) {
        toast.error('Machine model name is required');
        return;
      }

      try {
        if (editingMachineModel.isNew) {
          await createMutation.mutateAsync({
            name: editingMachineModel.name,
          });
        } else {
          await updateMutation.mutateAsync({
            id: editingMachineModel.id,
            name: editingMachineModel.name,
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
      if (confirm('Are you sure you want to delete this machine model?')) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const handleFieldChange = useCallback(
    (id: string, field: keyof EditingMachineModel, value: string) => {
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

  const machineModel = data || [];
  const isEditing = useCallback(
    (id: string) => id in editingItems,
    [editingItems],
  );

  // Define columns
  const columns = useMemo<ColumnDef<MachineModel>[]>(
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
          const machineModel = row.original;
          return (
            <Table.Cell>
              {isEditing(machineModel.id) ? (
                <Input.Root className='w-full'>
                  <Input.Wrapper>
                    <Input.Input
                      value={editingItems[machineModel.id]?.name || ''}
                      onChange={(e) =>
                        handleFieldChange(
                          machineModel.id,
                          'name',
                          e.target.value,
                        )
                      }
                      maxLength={36}
                    />
                  </Input.Wrapper>
                </Input.Root>
              ) : (
                <span className='font-medium'>{machineModel.name}</span>
              )}
            </Table.Cell>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const machineModel = row.original;
          return (
            <Table.Cell>
              <div className='flex items-center gap-2'>
                {isEditing(machineModel.id) ? (
                  <>
                    <Button
                      size='small'
                      onClick={() => handleSave(machineModel.id)}
                      disabled={updateMutation.isPending}
                    >
                      <RiSaveLine className='size-4' />
                    </Button>
                    <Button
                      size='small'
                      mode='stroke'
                      onClick={() => handleCancel(machineModel.id)}
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
                        onClick={() => handleEdit(machineModel)}
                      >
                        <RiEditLine className='size-4' />
                      </Button>
                    </PermissionGate>
                    <PermissionGate permission='products:delete'>
                      <Button
                        size='small'
                        mode='stroke'
                        onClick={() => handleDelete(machineModel.id)}
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
    data: machineModel,
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
      <div className='flex justify-center py-8'>Loading machine model...</div>
    );
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>Manage Machine Model</p>
        <PermissionGate permission='products:create'>
          <Button onClick={handleAdd} className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            Add Machine Model
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
                        placeholder='Enter machine model name'
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

          {machineModel.length === 0 &&
            Object.keys(editingItems).length === 0 && (
              <Table.Row>
                <Table.Cell
                  colSpan={2}
                  className='text-gray-500 py-8 text-center'
                >
                  No machine model found. Click &apos;Add Machine Model&apos; to
                  create one.
                </Table.Cell>
              </Table.Row>
            )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
