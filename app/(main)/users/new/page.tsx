'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiUserAddLine } from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { hasPermission } from '@/lib/permissions';
import { usePermissions } from '@/hooks/use-permissions';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Select from '@/components/ui/select';
import { PermissionGate } from '@/components/auth/permission-gate';
import { BackButton } from '@/components/back-button';
import Header from '@/components/header';

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  NIK: string;
  jobTitle: string;
  joinDate: string;
  type: string;
}

export default function CreateUserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { getAvailableRolesForCreation } = usePermissions();
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff',
    NIK: '',
    jobTitle: '',
    joinDate: new Date().toISOString().split('T')[0],
    type: 'full-time',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableRoles = getAvailableRolesForCreation();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/login');
      return;
    }

    // Check permission
    const userHasPermission = hasPermission(session.user.role, 'users:create');
    if (!userHasPermission) {
      router.push('/unauthorized');
      return;
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }

      // Navigate back to users list
      router.push('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const HeaderComponent = () => (
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
  );

  return (
    <PermissionGate permission='users:create'>
      <HeaderComponent />
      <form
        onSubmit={handleSubmit}
        className='mx-auto w-full max-w-4xl space-y-8'
      >
        <div className='space-y-4 rounded-lg border border-stroke-soft-200 p-6'>
          {error && (
            <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
              {error}
            </div>
          )}

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='firstName'>
                First Name <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='firstName'
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    required
                    className='px-3'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='lastName'>
                Last Name <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='lastName'
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    required
                    className='px-3'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor='email'>
              Email Address <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='email'
                  type='email'
                  value={formData.email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('email', e.target.value)
                  }
                  required
                  className='px-3'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor='password'>
              Password <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='password'
                  type='password'
                  value={formData.password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('password', e.target.value)
                  }
                  minLength={8}
                  required
                  className='px-3'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor='phone'>Phone Number</Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('phone', e.target.value)
                  }
                  className='px-3'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='flex flex-col gap-2'>
            <Label.Root htmlFor='NIK'>
              NIK <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  id='NIK'
                  value={formData.NIK}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('NIK', e.target.value)
                  }
                  required
                  className='px-3'
                  placeholder='Enter NIK'
                />
              </Input.Wrapper>
            </Input.Root>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='jobTitle'>Job Title</Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='jobTitle'
                    value={formData.jobTitle}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('jobTitle', e.target.value)
                    }
                    className='px-3'
                    placeholder='Enter job title'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='joinDate'>
                Join Date <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id='joinDate'
                    type='date'
                    value={formData.joinDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('joinDate', e.target.value)
                    }
                    required
                    className='px-3'
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>

          <div className='grid grid-cols-1 gap-6 sm:grid-cols-2'>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='type'>
                Employment Type <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder='Select employment type' />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value='full-time'>Full-time</Select.Item>
                  <Select.Item value='contract'>Contract</Select.Item>
                  <Select.Item value='resigned'>Resigned</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>
            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='role'>
                Role <Label.Asterisk />
              </Label.Root>
              <Select.Root
                value={formData.role}
                onValueChange={(value) => handleInputChange('role', value)}
              >
                <Select.Trigger>
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
          </div>
        </div>

        <div className='flex flex-col gap-4 pt-4 sm:flex-row sm:justify-end'>
          <Button.Root
            type='button'
            variant='neutral'
            mode='ghost'
            onClick={() => router.push('/users')}
            disabled={isLoading}
          >
            Cancel
          </Button.Root>
          <Button.Root type='submit' variant='primary' disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create User'}
          </Button.Root>
        </div>
      </form>
    </PermissionGate>
  );
}
