'use client';

import { useCallback, useRef, useState } from 'react';
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSaveLine,
  RiSettings3Line,
  RiToolsLine,
} from '@remixicon/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Root as Button } from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import {
  Root as Select,
  Content as SelectContent,
  Item as SelectItem,
  Trigger as SelectTrigger,
  Value as SelectValue,
} from '@/components/ui/select';
import * as Table from '@/components/ui/table';
import { PermissionGate } from '@/components/auth/permission-gate';

interface Brand {
  id: string;
  name: string;
  type: 'machine' | 'sparepart';
}

interface EditingBrand extends Brand {
  isNew?: boolean;
}

export function BrandsTable() {
  const queryClient = useQueryClient();
  const [editingItems, setEditingItems] = useState<
    Record<string, EditingBrand>
  >({});
  const newItemIdRef = useRef(0);

  // Fetch brands
  const { data, isLoading } = useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await fetch('/api/brands');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const result = await response.json();
      return result.data as Brand[];
    },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (brand: { name: string; type: string }) => {
      const response = await fetch('/api/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });
      if (!response.ok) throw new Error('Failed to create brand');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand created successfully');
    },
    onError: (error) => {
      toast.error(`Failed to create brand: ${error.message}`);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      ...brand
    }: {
      id: string;
      name: string;
      type: string;
    }) => {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brand),
      });
      if (!response.ok) throw new Error('Failed to update brand');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update brand: ${error.message}`);
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/brands/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete brand');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      toast.success('Brand deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete brand: ${error.message}`);
    },
  });

  const handleAdd = useCallback(() => {
    const newId = `new-${++newItemIdRef.current}`;
    setEditingItems((prev) => ({
      ...prev,
      [newId]: {
        id: newId,
        name: '',
        type: 'machine',
        isNew: true,
      },
    }));
  }, []);

  const handleEdit = useCallback((brand: Brand) => {
    setEditingItems((prev) => ({
      ...prev,
      [brand.id]: { ...brand },
    }));
  }, []);

  const handleSave = useCallback(
    async (id: string) => {
      const editingBrand = editingItems[id];
      if (!editingBrand) return;

      if (!editingBrand.name.trim()) {
        toast.error('Brand name is required');
        return;
      }

      try {
        if (editingBrand.isNew) {
          await createMutation.mutateAsync({
            name: editingBrand.name,
            type: editingBrand.type,
          });
        } else {
          await updateMutation.mutateAsync({
            id: editingBrand.id,
            name: editingBrand.name,
            type: editingBrand.type,
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
      if (confirm('Are you sure you want to delete this brand?')) {
        await deleteMutation.mutateAsync(id);
      }
    },
    [deleteMutation],
  );

  const handleFieldChange = useCallback(
    (id: string, field: keyof EditingBrand, value: string) => {
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

  const brands = data || [];
  const isEditing = (id: string) => id in editingItems;

  if (isLoading) {
    return <div className='flex justify-center py-8'>Loading brands...</div>;
  }

  return (
    <div className='space-y-4 py-4'>
      <div className='flex items-center justify-between'>
        <p className='text-sm text-gray-600'>Manage product brands</p>
        <PermissionGate permission='products:create'>
          <Button onClick={handleAdd} className='flex items-center gap-2'>
            <RiAddLine className='size-4' />
            Add Brand
          </Button>
        </PermissionGate>
      </div>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head>Type</Table.Head>
            <Table.Head className='w-32'>Actions</Table.Head>
          </Table.Row>
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
                        placeholder='Enter brand name'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </Table.Cell>
                <Table.Cell>
                  <Select
                    value={item.type}
                    onValueChange={(value) =>
                      handleFieldChange(item.id, 'type', value)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='machine'>
                        <div className='flex items-center gap-2'>
                          <RiSettings3Line className='size-4' />
                          Machine
                        </div>
                      </SelectItem>
                      <SelectItem value='sparepart'>
                        <div className='flex items-center gap-2'>
                          <RiToolsLine className='size-4' />
                          Sparepart
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
          {brands.map((brand) => (
            <Table.Row key={brand.id}>
              <Table.Cell>
                {isEditing(brand.id) ? (
                  <Input.Root className='w-full'>
                    <Input.Wrapper>
                      <Input.Input
                        value={editingItems[brand.id]?.name || ''}
                        onChange={(e) =>
                          handleFieldChange(brand.id, 'name', e.target.value)
                        }
                      />
                    </Input.Wrapper>
                  </Input.Root>
                ) : (
                  <span className='font-medium'>{brand.name}</span>
                )}
              </Table.Cell>
              <Table.Cell>
                {isEditing(brand.id) ? (
                  <Select
                    value={editingItems[brand.id]?.type || ''}
                    onValueChange={(value) =>
                      handleFieldChange(brand.id, 'type', value)
                    }
                  >
                    <SelectTrigger className='w-full'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='machine'>
                        <div className='flex items-center gap-2'>
                          <RiSettings3Line className='size-4' />
                          Machine
                        </div>
                      </SelectItem>
                      <SelectItem value='sparepart'>
                        <div className='flex items-center gap-2'>
                          <RiToolsLine className='size-4' />
                          Sparepart
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className='text-sm text-gray-600 capitalize'>
                    {brand.type === 'machine' ? (
                      <RiSettings3Line className='size-4' />
                    ) : (
                      <RiToolsLine className='size-4' />
                    )}
                    {brand.type}
                  </span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className='flex gap-2'>
                  {isEditing(brand.id) ? (
                    <>
                      <Button
                        size='small'
                        onClick={() => handleSave(brand.id)}
                        disabled={updateMutation.isPending}
                      >
                        <RiSaveLine className='size-4' />
                      </Button>
                      <Button
                        size='small'
                        mode='stroke'
                        onClick={() => handleCancel(brand.id)}
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
                          onClick={() => handleEdit(brand)}
                        >
                          <RiEditLine className='size-4' />
                        </Button>
                      </PermissionGate>
                      <PermissionGate permission='products:delete'>
                        <Button
                          size='small'
                          mode='stroke'
                          onClick={() => handleDelete(brand.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <RiDeleteBinLine className='size-4' />
                        </Button>
                      </PermissionGate>
                    </>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}

          {brands.length === 0 && Object.keys(editingItems).length === 0 && (
            <Table.Row>
              <Table.Cell
                colSpan={3}
                className='text-gray-500 py-8 text-center'
              >
                No brands found. Click &apos;Add Brand&apos; to create one.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
