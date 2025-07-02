'use client';

import { useState } from 'react';
import { RiCloseLine, RiUserAddLine } from '@remixicon/react';

import { usePermissions } from '@/hooks/use-permissions';
import { Root as Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Root as Label } from '@/components/ui/label';
import {
  Root as Modal,
  Body as ModalBody,
  Content as ModalContent,
  Footer as ModalFooter,
  Header as ModalHeader,
} from '@/components/ui/modal';

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
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent className='sm:max-w-md'>
        <ModalHeader>
          <div className='flex items-center gap-2'>
            <RiUserAddLine className='size-5' />
            <h2 className='text-lg font-semibold'>Create New User</h2>
          </div>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody className='space-y-4'>
            {error && (
              <div className='text-sm rounded-md border border-red-200 bg-red-50 px-4 py-3 text-red-700'>
                {error}
              </div>
            )}

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='firstName'>First Name *</Label>
                <Input
                  id='firstName'
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange('firstName', e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor='lastName'>Last Name *</Label>
                <Input
                  id='lastName'
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange('lastName', e.target.value)
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor='email'>Email Address *</Label>
              <Input
                id='email'
                type='email'
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor='password'>Password *</Label>
              <Input
                id='password'
                type='password'
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                minLength={8}
                required
              />
            </div>

            <div>
              <Label htmlFor='phone'>Phone Number</Label>
              <Input
                id='phone'
                type='tel'
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor='role'>Role *</Label>
              <select
                id='role'
                value={formData.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                className='border-gray-300 text-sm w-full rounded-md border px-3 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500'
                required
              >
                {availableRoles.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              type='button'
              variant='neutral'
              mode='ghost'
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type='submit' variant='primary' disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create User'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
