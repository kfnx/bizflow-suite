'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiBuildingLine, RiEditLine, RiMapPin2Line } from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { hasPermission } from '@/lib/permissions';
import { updateBranchSchema } from '@/lib/validations/branch';
import { useBranch, useUpdateBranch } from '@/hooks/use-branches';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface EditBranchData {
  name: string;
}

interface EditBranchPageProps {
  params: {
    id: string;
  };
}

export default function EditBranchPage({ params }: EditBranchPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const updateBranchMutation = useUpdateBranch();

  const {
    data: branchData,
    isLoading: branchLoading,
    error: branchError,
  } = useBranch(params.id);

  const [formData, setFormData] = useState<EditBranchData>({
    name: '',
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
    const userHasPermission = hasPermission(session.user, 'branches:update');
    if (!userHasPermission) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router]);

  // Populate form data when branch data is loaded
  useEffect(() => {
    if (branchData?.branch) {
      const branch = branchData.branch;
      setFormData({
        name: branch.name || '',
      });
    }
  }, [branchData]);

  if (status === 'loading' || branchLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  if (branchError) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        Error: Failed to load branch details
      </div>
    );
  }

  if (!branchData?.branch) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        Branch not found
      </div>
    );
  }

  const validateField = (
    field: keyof EditBranchData,
    value: string,
  ): string | null => {
    switch (field) {
      case 'name':
        return !value.trim() ? 'Branch name is required' : null;
      default:
        return null;
    }
  };

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const field = key as keyof EditBranchData;
      const error = validateField(field, formData[field]);
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
    const parsed = updateBranchSchema.safeParse(formData);
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
      await updateBranchMutation.mutateAsync({
        id: params.id,
        data: formData,
      });
      router.push('/branches');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update branch');
    }
  };

  const handleInputChange = (field: keyof EditBranchData, value: string) => {
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
    <PermissionGate permission='branches:update'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6' />
          </div>
        }
        title='Edit Branch'
        description={`Update ${branchData.branch.name} branch information.`}
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
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Branch Information
              </h3>

              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='name'>
                  New Branch Name <Label.Asterisk />
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
            </div>

            <div className='text-sm text-gray-600 pt-4'>
              <p>
                * Updating the branch name will affect all users currently
                assigned to this branch. The change will be reflected in their
                profiles and system records.
              </p>
            </div>
          </div>

          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={() => router.push('/branches')}
              disabled={updateBranchMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={updateBranchMutation.isPending}
            >
              {updateBranchMutation.isPending ? 'Updating...' : 'Update Branch'}
            </Button.Root>
          </div>
        </form>
      </div>
    </PermissionGate>
  );
}
