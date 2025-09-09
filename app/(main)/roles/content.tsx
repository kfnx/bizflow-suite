'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { RiAddLine, RiDeleteBinLine, RiEditLine, RiSearchLine } from '@remixicon/react';
import { toast } from 'sonner';

import * as Input from '@/components/ui/input';
import * as Button from '@/components/ui/button';
import * as Dialog from '@/components/ui/dialog';
import * as Table from '@/components/ui/table';
import { Pagination } from '@/components/ui/pagination';

interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleFormData {
  name: string;
  description?: string;
}

async function fetchRoles({ search = '', page = 1, limit = 10 }) {
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    limit: limit.toString(),
  });

  const response = await fetch(`/api/roles?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch roles');
  }
  return response.json();
}

async function createRole(data: RoleFormData) {
  const response = await fetch('/api/roles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create role');
  }

  return response.json();
}

async function updateRole(id: string, data: RoleFormData) {
  const response = await fetch(`/api/roles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update role');
  }

  return response.json();
}

async function deleteRole(id: string) {
  const response = await fetch(`/api/roles/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete role');
  }

  return response.json();
}

function RoleDialog({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}) {
  const [formData, setFormData] = useState<RoleFormData>({
    name: role?.name || '',
    description: role?.description || '',
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: RoleFormData) =>
      role ? updateRole(role.id, data) : createRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success(`Role ${role ? 'updated' : 'created'} successfully`);
      onClose();
      setFormData({ name: '', description: '' });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{role ? 'Edit Role' : 'Create Role'}</Dialog.Title>
        </Dialog.Header>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Input.Label htmlFor='name'>Name</Input.Label>
            <Input.Root
              id='name'
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder='Role name'
              required
            />
          </div>

          <div>
            <Input.Label htmlFor='description'>Description</Input.Label>
            <Input.Root
              id='description'
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder='Role description'
            />
          </div>

          <Dialog.Footer>
            <Button.Root variant='secondary' onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button.Root>
            <Button.Root type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : role ? 'Update' : 'Create'}
            </Button.Root>
          </Dialog.Footer>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}

export default function RolesContent() {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['roles', search, currentPage],
    queryFn: () => fetchRoles({ search, page: currentPage }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsDialogOpen(true);
  };

  const handleDelete = (role: Role) => {
    if (confirm(`Are you sure you want to delete "${role.name}"?`)) {
      deleteMutation.mutate(role.id);
    }
  };

  const handleCreate = () => {
    setSelectedRole(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedRole(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-display-xs font-semibold text-text-strong-950'>Roles</h1>
          <p className='text-text-sub-600'>
            Manage user roles and their permissions
          </p>
        </div>
        <Button.Root onClick={handleCreate}>
          <RiAddLine className='size-4' />
          Create Role
        </Button.Root>
      </div>

      <div className='flex items-center gap-4'>
        <div className='relative flex-1'>
          <RiSearchLine className='absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-soft-400' />
          <Input.Root
            className='pl-10'
            placeholder='Search roles...'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className='rounded-lg border border-stroke-soft-200'>
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Description</Table.Head>
              <Table.Head>Created</Table.Head>
              <Table.Head className='w-[100px]'>Actions</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data?.data?.map((role: Role) => (
              <Table.Row key={role.id}>
                <Table.Cell className='font-medium'>{role.name}</Table.Cell>
                <Table.Cell>{role.description || '-'}</Table.Cell>
                <Table.Cell>
                  {new Date(role.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <div className='flex items-center gap-2'>
                    <Button.Root
                      variant='ghost'
                      size='sm'
                      onClick={() => handleEdit(role)}
                    >
                      <RiEditLine className='size-4' />
                    </Button.Root>
                    <Button.Root
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(role)}
                      disabled={deleteMutation.isPending}
                    >
                      <RiDeleteBinLine className='size-4' />
                    </Button.Root>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>

      {data?.pagination && (
        <Pagination
          currentPage={currentPage}
          totalPages={data.pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <RoleDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        role={selectedRole}
      />
    </>
  );
}