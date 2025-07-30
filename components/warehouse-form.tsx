'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiMapPinLine, RiStoreLine, RiUserLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useBranches } from '@/hooks/use-branches';
import { useUsers } from '@/hooks/use-users';
import { useCreateWarehouse, useUpdateWarehouse } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Checkbox from '@/components/ui/checkbox';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';

interface WarehouseFormData {
  name: string;
  address: string;
  managerId: string;
  branchId: string;
  isActive?: boolean;
}

interface WarehouseFormProps {
  mode: 'create' | 'edit';
  initialData?: WarehouseFormData;
  warehouseId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WarehouseForm({
  mode,
  initialData,
  warehouseId,
  onSuccess,
  onCancel,
}: WarehouseFormProps) {
  const router = useRouter();
  const createWarehouseMutation = useCreateWarehouse();
  const updateWarehouseMutation = useUpdateWarehouse();
  const { data: managersData, isLoading: isLoadingManagers } = useUsers({
    role: 'manager',
    status: 'active',
    limit: 100,
  });
  const { data: branchesData, isLoading: isLoadingBranches } = useBranches({
    limit: 100,
  });

  const [formData, setFormData] = useState<WarehouseFormData>(
    initialData || {
      name: '',
      address: '',
      managerId: '',
      branchId: '',
      isActive: true,
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const managers = managersData?.users || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Basic client-side validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) {
      errors.name = 'Warehouse name is required';
    }
    if (!formData.branchId) {
      errors.branchId = 'Branch is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const baseData = {
      name: formData.name.trim(),
      address: formData.address.trim() || undefined,
      managerId: formData.managerId || undefined,
      branchId: formData.branchId,
    };

    try {
      if (mode === 'create') {
        await createWarehouseMutation.mutateAsync(baseData);
      } else {
        await updateWarehouseMutation.mutateAsync({
          id: warehouseId!,
          data: {
            ...baseData,
            isActive: Boolean(formData.isActive),
          },
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/warehouses');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `An error occurred while ${mode === 'create' ? 'creating' : 'updating'} the warehouse`;
      setError(errorMessage);
    }
  };

  const handleInputChange = (
    field: keyof WarehouseFormData,
    value: string | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      setError(null);
    }
  };

  const isLoading =
    createWarehouseMutation.isPending || updateWarehouseMutation.isPending;

  return (
    <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
          {error && (
            <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Basic Information
            </h3>

            <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='name'>
                  Warehouse Name <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiStoreLine} />
                    <Input.Input
                      id='name'
                      value={formData.name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('name', e.target.value)
                      }
                      placeholder='Enter warehouse name'
                      required
                    />
                  </Input.Wrapper>
                </Input.Root>
                {validationErrors.name && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.name}
                  </div>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='branchId'>
                  Branch <Label.Asterisk />
                </Label.Root>
                {isLoadingBranches ? (
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        disabled
                        value='Loading branches...'
                        readOnly
                      />
                    </Input.Wrapper>
                  </Input.Root>
                ) : branchesData?.data.length === 0 ? (
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        disabled
                        value='No branches available'
                        readOnly
                      />
                    </Input.Wrapper>
                  </Input.Root>
                ) : (
                  <Select.Root
                    value={formData.branchId}
                    onValueChange={(value) =>
                      handleInputChange('branchId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiMapPinLine} />
                      <Select.Value placeholder='Select branch' />
                    </Select.Trigger>
                    <Select.Content>
                      {branchesData?.data.map((branch) => (
                        <Select.Item key={branch.id} value={branch.id}>
                          {branch.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
                {validationErrors.branchId && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.branchId}
                  </div>
                )}
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='manager'>Warehouse Manager</Label.Root>
                {managers.length === 0 ? (
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        disabled
                        value={
                          isLoadingManagers
                            ? 'Loading managers...'
                            : 'No managers available'
                        }
                        readOnly
                      />
                    </Input.Wrapper>
                  </Input.Root>
                ) : (
                  <Select.Root
                    value={formData.managerId}
                    onValueChange={(value) =>
                      handleInputChange('managerId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiUserLine} />
                      <Select.Value placeholder='Select a manager (optional)' />
                    </Select.Trigger>
                    <Select.Content>
                      {managers.map((manager) => (
                        <Select.Item key={manager.id} value={manager.id}>
                          {manager.firstName} {manager.lastName} -{' '}
                          {manager.role}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                )}
                {validationErrors.managerId && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.managerId}
                  </div>
                )}
              </div>
            </div>

            {mode === 'edit' && (
              <div className='mt-6 space-y-4'>
                <div className='flex items-center gap-2'>
                  <Checkbox.Root
                    id='isActive'
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      handleInputChange('isActive', Boolean(checked))
                    }
                  />
                  <Label.Root htmlFor='isActive'>Active Warehouse</Label.Root>
                </div>
              </div>
            )}
          </div>

          <Divider.Root />

          {/* Address Information */}
          <div>
            <h3 className='text-lg text-gray-900 mb-4 font-medium'>
              Address Information
            </h3>

            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='address'>Warehouse Address</Label.Root>
              <TextArea.Root
                id='address'
                value={formData.address}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  handleInputChange('address', e.target.value)
                }
                rows={4}
                placeholder='Enter complete warehouse address (optional)'
                simple
              />
              {validationErrors.address && (
                <div className='text-xs text-red-600'>
                  {validationErrors.address}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
          <Button.Root
            type='button'
            variant='neutral'
            mode='ghost'
            onClick={onCancel || (() => router.push('/warehouses'))}
            disabled={isLoading}
          >
            Cancel
          </Button.Root>
          <Button.Root type='submit' variant='primary' disabled={isLoading}>
            {isLoading
              ? mode === 'create'
                ? 'Creating...'
                : 'Updating...'
              : mode === 'create'
                ? 'Create Warehouse'
                : 'Update Warehouse'}
          </Button.Root>
        </div>
      </form>
    </div>
  );
}
