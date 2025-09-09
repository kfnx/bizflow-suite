'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  RiAddLine, 
  RiDeleteBinLine, 
  RiEditLine, 
  RiSearchLine,
  RiSettingsLine,
  RiCheckLine,
  RiCloseLine
} from '@remixicon/react';
import { toast } from 'sonner';

import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Button from '@/components/ui/button';
import * as Modal from '@/components/ui/modal';
import * as Table from '@/components/ui/table';
import * as Checkbox from '@/components/ui/checkbox';

interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  permissions?: Permission[];
}

interface Permission {
  id: string;
  name: string;
  description?: string;
  resources?: string;
  actions?: string;
  createdAt: string;
  updatedAt: string;
}

interface RoleFormData {
  name: string;
  description?: string;
}

// API Functions
async function fetchRoles({ search = '', page = 1, limit = 50 }) {
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

async function fetchPermissions({ limit = 100 }) {
  const params = new URLSearchParams({
    limit: limit.toString(),
  });

  const response = await fetch(`/api/permissions?${params}`);
  if (!response.ok) {
    throw new Error('Failed to fetch permissions');
  }
  return response.json();
}

async function fetchRoleWithPermissions(roleId: string) {
  const response = await fetch(`/api/roles/${roleId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch role permissions');
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

async function assignPermissionsToRole(roleId: string, permissionIds: string[]) {
  const response = await fetch(`/api/roles/${roleId}/permissions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ permissionIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to assign permissions');
  }
  return response.json();
}

// Role Dialog Component
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
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>{role ? 'Edit Role' : 'Create Role'}</Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label.Root htmlFor='name'>Name</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='name'
                  value={formData.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder='Role name'
                  required
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div>
            <Label.Root htmlFor='description'>Description</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='description'
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder='Role description'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <Modal.Footer>
            <Button.Root variant='neutral' onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button.Root>
            <Button.Root type='submit' disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : role ? 'Update' : 'Create'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}

// Enhanced Role Permissions Dialog Component with better UX
function RolePermissionsDialog({
  isOpen,
  onClose,
  role,
}: {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
}) {
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const queryClient = useQueryClient();

  // Fetch all permissions
  const { data: permissionsData, isLoading: permissionsLoading } = useQuery({
    queryKey: ['permissions'],
    queryFn: () => fetchPermissions({ limit: 200 }),
  });

  // Fetch role with current permissions
  const { data: roleData, isLoading: roleLoading } = useQuery({
    queryKey: ['role', role?.id],
    queryFn: () => role ? fetchRoleWithPermissions(role.id) : null,
    enabled: !!role?.id && isOpen,
  });

  // Initialize selected permissions when role data is loaded
  useEffect(() => {
    if (roleData?.permissions) {
      setSelectedPermissions(roleData.permissions.map((p: any) => p.permissionId));
    }
  }, [roleData]);

  const handlePermissionToggle = (permissionId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permissionId)
        ? prev.filter(id => id !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSelectAll = (category: string) => {
    const categoryPermissions = getFilteredPermissions()
      .filter((p: Permission) => category === 'all' || p.name.startsWith(category))
      .map((p: Permission) => p.id);
    
    setSelectedPermissions(prev => 
      Array.from(new Set([...prev, ...categoryPermissions]))
    );
  };

  const handleDeselectAll = (category: string) => {
    const categoryPermissions = getFilteredPermissions()
      .filter((p: Permission) => category === 'all' || p.name.startsWith(category))
      .map((p: Permission) => p.id);
    
    setSelectedPermissions(prev => 
      prev.filter(id => !categoryPermissions.includes(id))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    try {
      await assignPermissionsToRole(role.id, selectedPermissions);
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['role', role.id] });
      toast.success('Permissions updated successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update permissions');
    }
  };

  const getFilteredPermissions = () => {
    const allPermissions = permissionsData?.data || [];
    
    return allPermissions.filter((permission: Permission) => {
      const matchesSearch = searchFilter === '' || 
        permission.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (permission.description && permission.description.toLowerCase().includes(searchFilter.toLowerCase()));
      
      const matchesCategory = categoryFilter === 'all' || 
        permission.name.startsWith(categoryFilter);
      
      return matchesSearch && matchesCategory;
    });
  };

  const getPermissionCategories = () => {
    const allPermissions = permissionsData?.data || [];
    const categories = new Set<string>();
    
    allPermissions.forEach((permission: Permission) => {
      const category = permission.name.split(':')[0];
      categories.add(category);
    });
    
    return Array.from(categories).sort();
  };

  const groupPermissionsByCategory = () => {
    const filteredPermissions = getFilteredPermissions();
    const grouped: Record<string, Permission[]> = {};
    
    filteredPermissions.forEach((permission: Permission) => {
      const category = permission.name.split(':')[0];
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(permission);
    });
    
    return grouped;
  };

  if (permissionsLoading || roleLoading) {
    return (
      <Modal.Root open={isOpen} onOpenChange={onClose}>
        <Modal.Content className='max-w-4xl'>
          <Modal.Header>
            <Modal.Title>Loading...</Modal.Title>
          </Modal.Header>
          <div className='p-8 text-center'>Loading permissions...</div>
        </Modal.Content>
      </Modal.Root>
    );
  }

  const categories = getPermissionCategories();
  const groupedPermissions = groupPermissionsByCategory();
  const filteredPermissions = getFilteredPermissions();

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content className='max-w-4xl max-h-[90vh] overflow-hidden'>
        <Modal.Header>
          <Modal.Title>
            Manage Permissions - {role?.name}
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit} className='flex flex-col space-y-4 overflow-hidden'>
          {/* Search and Filters */}
          <div className='flex items-center gap-4 p-4 border-b'>
            <div className='flex-1'>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Icon as={RiSearchLine} />
                  <Input.Input
                    placeholder='Search permissions...'
                    value={searchFilter}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                      setSearchFilter(e.target.value)
                    }
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className='px-3 py-2 border border-stroke-soft-200 rounded-lg bg-bg-white-0 text-text-strong-950'
            >
              <option value='all'>All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Bulk Actions */}
          <div className='flex items-center justify-between px-4'>
            <div className='text-sm text-text-sub-600'>
              {selectedPermissions.length} of {filteredPermissions.length} permissions selected
            </div>
            <div className='flex items-center gap-2'>
              <Button.Root
                type='button'
                variant='neutral'
                size='small'
                onClick={() => handleSelectAll(categoryFilter)}
              >
                <RiCheckLine className='size-4' />
                Select All
              </Button.Root>
              <Button.Root
                type='button'
                variant='neutral'
                size='small'
                onClick={() => handleDeselectAll(categoryFilter)}
              >
                <RiCloseLine className='size-4' />
                Deselect All
              </Button.Root>
            </div>
          </div>

          {/* Permissions List */}
          <div className='flex-1 overflow-y-auto px-4'>
            <div className='space-y-6'>
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                <div key={category} className='space-y-2'>
                  <div className='flex items-center justify-between sticky top-0 bg-bg-white-0 py-2 border-b border-stroke-soft-200'>
                    <h3 className='font-medium text-text-strong-950 capitalize'>
                      {category} ({categoryPermissions.length})
                    </h3>
                    <div className='flex items-center gap-2'>
                      <Button.Root
                        type='button'
                        variant='neutral'
                        size='xxsmall'
                        onClick={() => handleSelectAll(category)}
                      >
                        Select All
                      </Button.Root>
                      <Button.Root
                        type='button'
                        variant='neutral'
                        size='xxsmall'
                        onClick={() => handleDeselectAll(category)}
                      >
                        Clear
                      </Button.Root>
                    </div>
                  </div>
                  
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    {categoryPermissions.map((permission: Permission) => (
                      <div key={permission.id} className='flex items-start space-x-3 rounded-lg border p-3 hover:bg-bg-weak-50'>
                        <Checkbox.Root
                          checked={selectedPermissions.includes(permission.id)}
                          onCheckedChange={() => handlePermissionToggle(permission.id)}
                          className='mt-1'
                        />
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-text-strong-950 truncate'>
                            {permission.name}
                          </div>
                          {permission.description && (
                            <div className='text-sm text-text-sub-600 line-clamp-2'>
                              {permission.description}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              onClick={onClose}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit'>
              Update Permissions ({selectedPermissions.length})
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}

export default function RolesContent() {
  const [search, setSearch] = useState('');
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isRolePermissionsDialogOpen, setIsRolePermissionsDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const queryClient = useQueryClient();

  // Roles data
  const { data: rolesData, isLoading: rolesLoading, error: rolesError } = useQuery({
    queryKey: ['roles', search],
    queryFn: () => fetchRoles({ search }),
  });

  // Mutations
  const deleteRoleMutation = useMutation({
    mutationFn: deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('Role deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Handlers
  const handleEditRole = (role: Role) => {
    setSelectedRole(role);
    setIsRoleDialogOpen(true);
  };

  const handleDeleteRole = (role: Role) => {
    if (confirm(`Are you sure you want to delete "${role.name}"?`)) {
      deleteRoleMutation.mutate(role.id);
    }
  };

  const handleManageRolePermissions = (role: Role) => {
    setSelectedRole(role);
    setIsRolePermissionsDialogOpen(true);
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsRoleDialogOpen(true);
  };

  const handleCloseRoleDialog = () => {
    setIsRoleDialogOpen(false);
    setSelectedRole(null);
  };

  const handleCloseRolePermissionsDialog = () => {
    setIsRolePermissionsDialogOpen(false);
    setSelectedRole(null);
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-display-xs font-semibold text-text-strong-950'>
            Roles Management
          </h1>
          <p className='text-text-sub-600'>
            Manage user roles and assign permissions
          </p>
        </div>
        <Button.Root onClick={handleCreateRole}>
          <RiAddLine className='size-4' />
          Create Role
        </Button.Root>
      </div>

      {/* Search */}
      <div className='flex items-center gap-4'>
        <div className='relative flex-1'>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                placeholder='Search roles...'
                value={search}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              />
            </Input.Wrapper>
          </Input.Root>
        </div>
      </div>

      {/* Roles Table */}
      <div className='rounded-lg border border-stroke-soft-200'>
        {rolesLoading ? (
          <div className='p-8 text-center'>Loading roles...</div>
        ) : rolesError ? (
          <div className='p-8 text-center text-error-base'>
            Error: {rolesError.message}
          </div>
        ) : (
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Name</Table.Head>
                <Table.Head>Description</Table.Head>
                <Table.Head>Created</Table.Head>
                <Table.Head className='w-[150px]'>Actions</Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rolesData?.data?.map((role: Role) => (
                <Table.Row key={role.id}>
                  <Table.Cell className='font-medium'>{role.name}</Table.Cell>
                  <Table.Cell>{role.description || '-'}</Table.Cell>
                  <Table.Cell>
                    {new Date(role.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <div className='flex items-center gap-2'>
                      <Button.Root
                        variant='neutral'
                        size='small'
                        onClick={() => handleManageRolePermissions(role)}
                        title='Manage Permissions'
                      >
                        <RiSettingsLine className='size-4' />
                      </Button.Root>
                      <Button.Root
                        variant='neutral'
                        size='small'
                        onClick={() => handleEditRole(role)}
                        title='Edit Role'
                      >
                        <RiEditLine className='size-4' />
                      </Button.Root>
                      <Button.Root
                        variant='error'
                        size='small'
                        onClick={() => handleDeleteRole(role)}
                        disabled={deleteRoleMutation.isPending}
                        title='Delete Role'
                      >
                        <RiDeleteBinLine className='size-4' />
                      </Button.Root>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        )}
      </div>

      {/* Dialogs */}
      <RoleDialog
        isOpen={isRoleDialogOpen}
        onClose={handleCloseRoleDialog}
        role={selectedRole}
      />

      <RolePermissionsDialog
        isOpen={isRolePermissionsDialogOpen}
        onClose={handleCloseRolePermissionsDialog}
        role={selectedRole}
      />
    </>
  );
}