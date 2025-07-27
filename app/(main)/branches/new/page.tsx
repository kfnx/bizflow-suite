'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBuildingLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
} from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { hasPermission } from '@/lib/permissions';
import { createBranchSchema } from '@/lib/validations/branch';
import { useCreateBranch } from '@/hooks/use-branches';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface CreateBranchData {
  name: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  fax?: string;
  email?: string;
}

export default function CreateBranchPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const createBranchMutation = useCreateBranch();

  const [formData, setFormData] = useState<CreateBranchData>({
    name: '',
    address: '',
    postalCode: '',
    phone: '',
    fax: '',
    email: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Check permission
    const userHasPermission = hasPermission(session.user, 'branches:create');
    if (!userHasPermission) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  const validateField = (
    field: keyof CreateBranchData,
    value: string,
  ): string | null => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'Branch name is required' : null;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Invalid email format';
        }
        return null;
      default:
        return null;
    }
  };

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const field = key as keyof CreateBranchData;
      const value = formData[field] || '';
      const error = validateField(field, value);
      if (error) {
        errors[field] = error;
      }
    });

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Client-side validation
    const clientErrors = validateForm();
    if (Object.keys(clientErrors).length > 0) {
      setValidationErrors(clientErrors);
      return;
    }

    // Validate with Zod schema
    const parsed = createBranchSchema.safeParse(formData);
    if (!parsed.success) {
      const zodErrors: Record<string, string> = {};
      parsed.error.errors.forEach((error) => {
        const field = error.path[0] as string;
        zodErrors[field] = error.message;
      });
      setValidationErrors(zodErrors);
      return;
    }

    try {
      await createBranchMutation.mutateAsync(formData);
      router.push('/branches');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create branch');
    }
  };

  const handleInputChange = (field: keyof CreateBranchData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      setError(null);
    }
  };

  return (
    <PermissionGate permission='branches:create'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiMapPin2Line className='size-6' />
          </div>
        }
        title='New Branch'
        description='Add a new branch location to the system.'
      >
        <BackButton href='/branches' label='Back to Branches' />
      </Header>

      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form
          onSubmit={handleSubmit}
          className='mx-auto w-full max-w-2xl space-y-8'
          noValidate
        >
          <div className='space-y-4 rounded-lg border border-stroke-soft-200 p-6'>
            {error && (
              <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                {error}
              </div>
            )}

            {/* Branch Information */}
            <div className='flex flex-col gap-4'>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Branch Information
              </h3>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='name'>
                    Branch Name <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiBuildingLine} />
                      <Input.Input
                        id='name'
                        value={formData.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('name', e.target.value)
                        }
                        placeholder='Enter branch name (e.g., Jakarta HQ, Surabaya Office)'
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
                  <Label.Root htmlFor='postalCode'>Postal Code</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiMapPin2Line} />
                      <Input.Input
                        id='postalCode'
                        value={formData.postalCode || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('postalCode', e.target.value)
                        }
                        placeholder='Enter postal code'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.postalCode && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.postalCode}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='address'>Address</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiMapPin2Line} />
                    <Input.Input
                      id='address'
                      value={formData.address || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('address', e.target.value)
                      }
                      placeholder='Enter complete address'
                    />
                  </Input.Wrapper>
                </Input.Root>
                {validationErrors.address && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.address}
                  </div>
                )}
              </div>

              <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='phone'>Phone</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiPhoneLine} />
                      <Input.Input
                        id='phone'
                        value={formData.phone || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('phone', e.target.value)
                        }
                        placeholder='Enter phone number'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.phone && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.phone}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='fax'>Fax</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiPhoneLine} />
                      <Input.Input
                        id='fax'
                        value={formData.fax || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('fax', e.target.value)
                        }
                        placeholder='Enter fax number'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.fax && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.fax}
                    </div>
                  )}
                </div>
              </div>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='email'>Email</Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Icon as={RiMailLine} />
                    <Input.Input
                      id='email'
                      type='email'
                      value={formData.email || ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleInputChange('email', e.target.value)
                      }
                      placeholder='Enter email address'
                    />
                  </Input.Wrapper>
                </Input.Root>
                {validationErrors.email && (
                  <div className='text-xs text-red-600'>
                    {validationErrors.email}
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
              onClick={() => router.push('/branches')}
              disabled={createBranchMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={createBranchMutation.isPending}
            >
              {createBranchMutation.isPending ? 'Creating...' : 'Create Branch'}
            </Button.Root>
          </div>
        </form>
      </div>
    </PermissionGate>
  );
}
