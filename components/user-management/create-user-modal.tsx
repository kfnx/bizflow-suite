'use client';

import { useState } from 'react';
import { RiUserAddLine } from '@remixicon/react';

import { usePermissions } from '@/hooks/use-permissions';
import * as Button from '@/components/ui/button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as Modal from '@/components/ui/modal';
import * as Select from '@/components/ui/select';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

export function CreateUserModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateUserModalProps) {
  const { getAvailableRolesForCreation } = usePermissions();
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    role: 'staff',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const availableRoles = getAvailableRolesForCreation();

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

      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        phone: '',
        role: 'staff',
      });

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal.Root open={isOpen} onOpenChange={onClose}>
      <Modal.Content className='sm:max-w-md'>
        <Modal.Header>
          <div className='flex items-center gap-2'>
            <RiUserAddLine className='size-5' />
            <h2 className='text-lg font-semibold'>Create New User</h2>
          </div>
        </Modal.Header>

        <form onSubmit={handleSubmit}>
          <Modal.Body className='space-y-4'>
            {error && (
              <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                {error}
              </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='firstName'>
                  First Name <span className='text-red-500'>*</span>
                </Label.Root>
                <Input.Root>
                  <Input.Input
                    id='firstName'
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('firstName', e.target.value)
                    }
                    required
                    className='px-3'
                  />
                </Input.Root>
              </div>
              <div className='flex flex-col gap-2'>
                <Label.Root htmlFor='lastName'>
                  Last Name <span className='text-red-500'>*</span>
                </Label.Root>
                <Input.Root>
                  <Input.Input
                    id='lastName'
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleInputChange('lastName', e.target.value)
                    }
                    required
                    className='px-3'
                  />
                </Input.Root>
              </div>
            </div>

            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='email'>
                Email Address <span className='text-red-500'>*</span>
              </Label.Root>
              <Input.Root>
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
              </Input.Root>
            </div>

            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='password'>
                Password <span className='text-red-500'>*</span>
              </Label.Root>
              <Input.Root>
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
              </Input.Root>
            </div>

            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='phone'>Phone Number</Label.Root>
              <Input.Root>
                <Input.Input
                  id='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange('phone', e.target.value)
                  }
                  className='px-3'
                />
              </Input.Root>
            </div>

            <div className='flex flex-col gap-2'>
              <Label.Root htmlFor='role'>
                Role <span className='text-red-500'>*</span>
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
          </Modal.Body>

          <Modal.Footer>
            <Button.Root
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button.Root>
            <Button.Root type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
