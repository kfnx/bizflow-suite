'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBriefcaseLine,
  RiCalendarLine,
  RiHashtag,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiShieldUserLine,
  RiUserAddLine,
  RiUserLine,
} from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { DEFAULT_PASSWORD } from '@/lib/db/constants';
// import { hasPermission } from '@/lib/permissions';
import { CreateUserRequest } from '@/lib/validations/user';
import { useBranches } from '@/hooks/use-branches';
import { usePermissions } from '@/hooks/use-permissions';
import { useRoles } from '@/hooks/use-roles';
import { useCreateUser } from '@/hooks/use-users';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Switch from '@/components/ui/switch';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface ValidationError {
  field: string;
  message: string;
}

export default function CreateUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {} = usePermissions();
  const { data: branchesData, isLoading: branchesLoading } = useBranches();
  const { data: rolesData, isLoading: rolesLoading } = useRoles({ limit: 50 });
  const createUserMutation = useCreateUser();
  const [formData, setFormData] = useState<CreateUserRequest>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',

    NIK: '',
    jobTitle: '',
    joinDate: new Date().toISOString().split('T')[0],
    type: 'full-time' as const,
    branchId: '',
    roleId: 'none',
    isAdmin: false,
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

    // TODO: Re-implement permission check - temporarily disabled for build
    // const userHasPermission = hasPermission([], 'users:create', session.user?.isAdmin);
    // if (!userHasPermission) {
    //   router.push('/unauthorized');
    //   return;
    // }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  const validateField = (
    field: keyof CreateUserRequest,
    value: string,
  ): string | null => {
    switch (field) {
      case 'firstName':
        return !value.trim() ? 'First name is required' : null;
      case 'email':
        if (!value.trim()) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return 'Please enter a valid email address';
        return null;
      case 'NIK':
        return !value.trim() ? 'NIK is required' : null;
      case 'joinDate':
        return !value ? 'Join date is required' : null;
      case 'branchId':
        return !value.trim() ? 'Branch is required' : null;
      default:
        return null;
    }
  };

  const validateForm = (): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.keys(formData).forEach((key) => {
      const field = key as keyof CreateUserRequest;
      const error = validateField(field, formData[field] as string);
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

    try {
      await createUserMutation.mutateAsync(formData);
      // Navigate back to users list
      router.push('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleInputChange = (
    field: keyof CreateUserRequest,
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

  const handleBooleanChange = (
    field: keyof CreateUserRequest,
    value: boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user changes value
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (error) {
      setError(null);
    }
  };

  return (
    <PermissionGate permission='users:create'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiUserAddLine className='size-6' />
          </div>
        }
        title='New User'
        description='Add a new user to the system.'
      >
        <BackButton href='/users' label='Back to Users' />
      </Header>
      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form
          onSubmit={handleSubmit}
          className='mx-auto w-full max-w-4xl space-y-8'
          noValidate
        >
          <div className='space-y-4 rounded-lg border border-stroke-soft-200 p-6'>
            {error && (
              <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                {error}
              </div>
            )}

            {/* Personal Information */}
            <div>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Personal Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='firstName'>
                    First Name <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiUserLine} />
                      <Input.Input
                        id='firstName'
                        value={formData.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('firstName', e.target.value)
                        }
                        placeholder='Enter first name'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.firstName && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.firstName}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='lastName'>Last Name</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiUserLine} />
                      <Input.Input
                        id='lastName'
                        value={formData.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('lastName', e.target.value)
                        }
                        placeholder='Enter last name'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.lastName && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.lastName}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='email'>
                    Email Address <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiMailLine} />
                      <Input.Input
                        id='email'
                        type='email'
                        value={formData.email}
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

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='phone'>Phone Number</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiPhoneLine} />
                      <Input.Input
                        id='phone'
                        type='tel'
                        value={formData.phone}
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
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='NIK'>
                    NIK <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiHashtag} />
                      <Input.Input
                        id='NIK'
                        value={formData.NIK}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('NIK', e.target.value)
                        }
                        placeholder='Enter NIK'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.NIK && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.NIK}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='jobTitle'>Job Title</Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiBriefcaseLine} />
                      <Input.Input
                        id='jobTitle'
                        value={formData.jobTitle}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('jobTitle', e.target.value)
                        }
                        placeholder='Enter job title (optional)'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.jobTitle && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.jobTitle}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Password Information */}
            <div className='pt-6'>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Account Security
              </h3>
            </div>

            <div className='flex flex-col gap-2'>
              <Label.Root>Default Password</Label.Root>
              <div className='px-4 py-2 text-paragraph-sm text-text-sub-600'>
                {DEFAULT_PASSWORD}
              </div>
              <div className='mt-1 text-label-xs text-text-sub-600'>
                * The user will be able to login with this default password and
                can change it later.
              </div>
            </div>

            {/* Work Information */}
            <div className='pt-6'>
              <h3 className='text-lg text-gray-900 mb-4 font-medium'>
                Work Information
              </h3>

              <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='joinDate'>
                    Join Date <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Icon as={RiCalendarLine} />
                      <Input.Input
                        id='joinDate'
                        type='date'
                        value={formData.joinDate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleInputChange('joinDate', e.target.value)
                        }
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {validationErrors.joinDate && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.joinDate}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='type'>
                    Employment Type <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiBriefcaseLine} />
                      <Select.Value placeholder='Select employment type' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='full-time'>Full-time</Select.Item>
                      <Select.Item value='contract'>Contract</Select.Item>
                      <Select.Item value='resigned'>Resigned</Select.Item>
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.type && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.type}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='branchId'>
                    Branch <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.branchId}
                    onValueChange={(value) =>
                      handleInputChange('branchId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiMapPin2Line} />
                      <Select.Value placeholder='Select branch' />
                    </Select.Trigger>
                    <Select.Content>
                      {branchesLoading ? (
                        <Select.Item value='-' disabled>
                          Loading branches...
                        </Select.Item>
                      ) : (
                        branchesData?.data.map((branch) => (
                          <Select.Item key={branch.id} value={branch.id}>
                            {branch.name}
                          </Select.Item>
                        ))
                      )}
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.branchId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.branchId}
                    </div>
                  )}
                </div>

                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='roleId'>Role</Label.Root>
                  <Select.Root
                    value={formData.roleId}
                    onValueChange={(value) =>
                      handleInputChange('roleId', value)
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiShieldUserLine} />
                      <Select.Value placeholder='Select role (optional)' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='none'>No Role</Select.Item>
                      {rolesLoading ? (
                        <Select.Item value='-' disabled>
                          Loading roles...
                        </Select.Item>
                      ) : (
                        rolesData?.data?.map((role) => (
                          <Select.Item key={role.id} value={role.id}>
                            {role.name}
                          </Select.Item>
                        ))
                      )}
                    </Select.Content>
                  </Select.Root>
                  {validationErrors.roleId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.roleId}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='isAdmin'>
                    Administrator Access
                  </Label.Root>
                  <div className='flex items-center space-x-3'>
                    <Switch.Root
                      id='isAdmin'
                      checked={formData.isAdmin}
                      onCheckedChange={(checked) =>
                        handleBooleanChange('isAdmin', checked)
                      }
                    />
                    <Label.Root htmlFor='isAdmin' className='text-sm'>
                      Grant administrator privileges
                    </Label.Root>
                  </div>
                  <div className='text-label-xs text-text-sub-600'>
                    Administrators can manage users, reset passwords, and access
                    admin-only features.
                  </div>
                  {validationErrors.isAdmin && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.isAdmin}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-4 pb-4 sm:flex-row sm:justify-end'>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={() => router.push('/users')}
              disabled={createUserMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={createUserMutation.isPending}
            >
              {createUserMutation.isPending ? 'Creating...' : 'Create User'}
            </Button.Root>
          </div>
        </form>
      </div>
    </PermissionGate>
  );
}
