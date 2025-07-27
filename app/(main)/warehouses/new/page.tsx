'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiMapPinLine, RiStoreLine, RiUserLine } from '@remixicon/react';
import { toast } from 'sonner';

import { useBranches } from '@/hooks/use-branches';
import { useUsers } from '@/hooks/use-users';
import { useCreateWarehouse } from '@/hooks/use-warehouses';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as TextArea from '@/components/ui/textarea';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface WarehouseFormData {
  name: string;
  address: string;
  managerId: string;
  branchId: string;
}

export default function NewWarehousePage() {
  const router = useRouter();
  const createWarehouseMutation = useCreateWarehouse();
  const { data: managersData, isLoading: isLoadingManagers } = useUsers({
    role: 'manager',
    status: 'active',
    limit: 100,
  });
  const { data: branchesData, isLoading: isLoadingBranches } = useBranches({
    limit: 100,
  });

  const [formData, setFormData] = useState<WarehouseFormData>({
    name: '',
    address: '',
    managerId: '',
    branchId: '',
  });
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const managers = managersData?.users || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

    const submitData = {
      name: formData.name.trim(),
      address: formData.address.trim() || undefined,
      managerId: formData.managerId || undefined,
      branchId: formData.branchId,
    };

    createWarehouseMutation.mutate(submitData, {
      onSuccess: () => {
        router.push('/warehouses');
      },
      onError: (error) => {
        // Handle validation errors from server
        if (error.message.includes('validation')) {
          const serverErrors: Record<string, string> = {};
          serverErrors.name = 'Invalid warehouse data';
          setValidationErrors(serverErrors);
        }
      },
    });
  };

  const handleInputChange = (field: keyof WarehouseFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const isLoading = createWarehouseMutation.isPending;

  return (
    <>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiStoreLine className='size-6 text-text-sub-600' />
          </div>
        }
        title='New Warehouse'
        description='Add a new warehouse to your system.'
      >
        <BackButton href='/warehouses' label='Back to Warehouses' />
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
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
                        onChange={(e) =>
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
                  <Select.Root
                    value={formData.branchId}
                    onValueChange={(value) =>
                      handleInputChange('branchId', value)
                    }
                    disabled={isLoadingBranches}
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiMapPinLine} />
                      <Select.Value placeholder='Select branch' />
                    </Select.Trigger>
                    <Select.Content>
                      {isLoadingBranches && (
                        <Select.Item value='loading' disabled>
                          Loading branches...
                        </Select.Item>
                      )}
                      {!isLoadingBranches &&
                        branchesData?.data.length === 0 && (
                          <Select.Item value='no-branches' disabled>
                            No branches available
                          </Select.Item>
                        )}
                      {branchesData?.data.map((branch) => (
                        <Select.Item key={branch.id} value={branch.id}>
                          {branch.name}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.branchId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.branchId}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='manager'>Warehouse Manager</Label.Root>
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
                      {isLoadingManagers && (
                        <Select.Item value='loading' disabled>
                          Loading managers...
                        </Select.Item>
                      )}
                      {!isLoadingManagers && managers.length === 0 && (
                        <Select.Item value='no-managers' disabled>
                          No managers available
                        </Select.Item>
                      )}
                      {managers.map((manager) => (
                        <Select.Item key={manager.id} value={manager.id}>
                          {manager.firstName} {manager.lastName} -{' '}
                          {manager.role}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.managerId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.managerId}
                    </div>
                  )}
                </div>
              </div>
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
                  onChange={(e) => handleInputChange('address', e.target.value)}
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
              onClick={() => router.push('/warehouses')}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Warehouse'}
            </Button.Root>
          </div>
        </form>
      </div>
    </>
  );
}
