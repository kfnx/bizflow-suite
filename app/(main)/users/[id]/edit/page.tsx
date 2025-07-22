'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiBriefcaseLine,
  RiCalendarLine,
  RiEditLine,
  RiHashtag,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiUserLine,
} from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { hasPermission } from '@/lib/permissions';
import { useBranches } from '@/hooks/use-branches';
import { usePermissions } from '@/hooks/use-permissions';
import { useUpdateUser, useUser } from '@/hooks/use-users';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import * as Switch from '@/components/ui/switch';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface EditUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  NIK: string;
  jobTitle: string;
  joinDate: string;
  type: string;
  role: string;
  branchId: string;
  isActive: boolean;
  isAdmin: boolean;
}

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { getAvailableRolesForCreation } = usePermissions();
  const { data: branchesData, isLoading: branchesLoading } = useBranches();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useUser(params.id);
  const updateUserMutation = useUpdateUser();

  const [formData, setFormData] = useState<EditUserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    NIK: '',
    jobTitle: '',
    joinDate: '',
    type: 'full-time',
    role: 'staff',
    branchId: '',
    isActive: true,
    isAdmin: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const availableRoles = getAvailableRolesForCreation();

  // Helper function to get branch name by ID
  const getBranchNameById = (branchId: string) => {
    if (!branchesData?.data) return '';
    const branch = branchesData.data.find((b) => b.id === branchId);
    return branch?.name || '';
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Check permission
    const userHasPermission = hasPermission(session.user, 'users:update');
    if (!userHasPermission) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router]);

  // Populate form data when user data is loaded
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        NIK: user.NIK || '',
        jobTitle: user.jobTitle || '',
        joinDate: user.joinDate
          ? new Date(user.joinDate).toISOString().split('T')[0]
          : '',
        type: user.type || 'full-time',
        role: user.role || 'staff',
        branchId: user.branchId || '',
        isActive: user.isActive ?? true,
        isAdmin: user.isAdmin ?? false,
      });
    }
  }, [userData]);

  if (status === 'loading' || userLoading || branchesLoading) {
    return (
      <div className='flex h-full w-full items-center justify-center text-text-sub-600'>
        Loading...
      </div>
    );
  }

  if (userError) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        Error: {userError.message}
      </div>
    );
  }

  if (!userData?.user) {
    return (
      <div className='flex h-full w-full items-center justify-center text-red-600'>
        User not found
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!formData.NIK.trim()) {
      errors.NIK = 'NIK is required';
    }
    if (!formData.joinDate) {
      errors.joinDate = 'Join date is required';
    }
    if (!formData.branchId.trim()) {
      errors.branchId = 'Branch is required';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        userId: params.id,
        userData: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          NIK: formData.NIK,
          jobTitle: formData.jobTitle || undefined,
          joinDate: formData.joinDate,
          type: formData.type as 'full-time' | 'contract' | 'resigned',
          role: formData.role as 'staff' | 'manager' | 'director',
          branchId: formData.branchId,
          isActive: formData.isActive,
          isAdmin: formData.isAdmin,
        },
      });

      // Navigate back to users list
      router.push('/users');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An error occurred while updating the user');
      }
    }
  };

  const handleInputChange = (
    field: keyof EditUserData,
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

  return (
    <PermissionGate permission='users:update'>
      <Header
        icon={
          <div className='flex size-12 shrink-0 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'>
            <RiEditLine className='size-6' />
          </div>
        }
        title='Edit User'
        description={`Update ${userData.user.firstName} ${userData.user.lastName}'s information.`}
      >
        <BackButton href='/users' label='Back to Users' />
      </Header>
      <div className='flex flex-1 flex-col gap-6 px-4 py-6 lg:px-8'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-6 rounded-lg border border-stroke-soft-200 p-6'>
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
                        required
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
                        required
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
                      />
                    </Input.Wrapper>
                  </Input.Root>
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
                        required
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
                        placeholder='Enter job title'
                      />
                    </Input.Wrapper>
                  </Input.Root>
                </div>
              </div>
            </div>

            <Divider.Root />
            {/* Work Information */}
            <div>
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
                        required
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
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='role'>
                    Role <Label.Asterisk />
                  </Label.Root>
                  <Select.Root
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiUserLine} />
                      <Select.Value placeholder='Select role' />
                    </Select.Trigger>
                    <Select.Content>
                      {availableRoles.map((role) => (
                        <Select.Item key={role} value={role}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
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
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiMapPin2Line} />
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
                  {validationErrors.branchId && (
                    <div className='text-xs text-red-600'>
                      {validationErrors.branchId}
                    </div>
                  )}
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-1'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='isActive'>Account Status</Label.Root>
                  <Select.Root
                    value={formData.isActive ? 'active' : 'inactive'}
                    onValueChange={(value) =>
                      handleInputChange('isActive', value === 'active')
                    }
                  >
                    <Select.Trigger>
                      <Select.TriggerIcon as={RiUserLine} />
                      <Select.Value placeholder='Select status' />
                    </Select.Trigger>
                    <Select.Content>
                      <Select.Item value='active'>Active</Select.Item>
                      <Select.Item value='inactive'>Inactive</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
              </div>

              <div className='mt-6 grid grid-cols-1 gap-6 sm:grid-cols-1'>
                <div className='flex flex-col gap-2'>
                  <Label.Root htmlFor='isAdmin'>
                    Administrator Access
                  </Label.Root>
                  <div className='flex items-center space-x-3'>
                    <Switch.Root
                      id='isAdmin'
                      checked={formData.isAdmin}
                      onCheckedChange={(checked) =>
                        handleInputChange('isAdmin', checked)
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
              disabled={updateUserMutation.isPending}
            >
              Cancel
            </Button.Root>
            <Button.Root
              type='submit'
              variant='primary'
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
            </Button.Root>
          </div>
        </form>
      </div>
    </PermissionGate>
  );
}
