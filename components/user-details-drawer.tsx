'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  RiCloseLine,
  RiEditLine,
  RiKeyLine,
  RiLoader4Line,
  RiLockPasswordLine,
  RiUserLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
import { usePermissions } from '@/hooks/use-permissions';
import { useResetUserPassword, useUser } from '@/hooks/use-users';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Drawer from '@/components/ui/drawer';
import { PermissionGate } from '@/components/auth/permission-gate';

interface UserDetailsDrawerProps {
  userId: string | null;
  open: boolean;
  onClose: () => void;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'director':
      return 'purple';
    case 'manager':
      return 'blue';
    case 'staff':
      return 'orange';
    default:
      return 'gray';
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'full-time':
      return 'green';
    case 'contract':
      return 'blue';
    case 'resigned':
      return 'red';
    default:
      return 'gray';
  }
};

function UserDetailsContent({ user }: { user: any }) {
  const { can } = usePermissions();
  const resetPasswordMutation = useResetUserPassword();

  const handleEdit = () => {
    window.location.href = `/users/${user.id}/edit`;
  };

  const handleResetPassword = async () => {
    if (
      !confirm(
        `Are you sure you want to reset ${user.firstName} ${user.lastName}'s password? This will set their password to the default password.`,
      )
    ) {
      return;
    }

    try {
      await resetPasswordMutation.mutateAsync(user.id);
      alert(
        'Password reset successfully! User can now login with the default password.',
      );
    } catch (error) {
      alert(
        error instanceof Error ? error.message : 'Failed to reset password',
      );
    }
  };

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='border-b pb-4'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <h2 className='text-xl text-gray-900 font-semibold'>
              {user.firstName} {user.lastName}
            </h2>
            <p className='text-sm text-gray-600'>
              {user.code} • {user.email}
            </p>
            {user.jobTitle && (
              <p className='text-sm text-gray-500'>{user.jobTitle}</p>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Badge.Root
              variant='light'
              color={getRoleColor(user.role)}
              size='medium'
            >
              {user.role}
            </Badge.Root>
            <Badge.Root
              variant='light'
              color={getTypeColor(user.type || 'full-time')}
              size='medium'
            >
              {user.type || 'full-time'}
            </Badge.Root>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <PermissionGate permission='users:update'>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={handleEdit}
            >
              <RiEditLine className='size-4' />
              Edit User
            </Button.Root>
            <Button.Root
              variant='neutral'
              mode='stroke'
              size='small'
              onClick={handleResetPassword}
              disabled={resetPasswordMutation.isPending}
            >
              <RiLockPasswordLine className='size-4' />
              {resetPasswordMutation.isPending
                ? 'Resetting...'
                : 'Reset Password'}
            </Button.Root>
          </PermissionGate>
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h3 className='text-sm text-gray-900 mb-3 font-medium'>
          Personal Information
        </h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
              NIK
            </label>
            <p className='text-sm text-gray-900 mt-1 font-medium'>
              {user.NIK || '—'}
            </p>
          </div>
          <div>
            <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
              Phone
            </label>
            <p className='text-sm text-gray-900 mt-1 font-medium'>
              {user.phone || '—'}
            </p>
          </div>
          <div>
            <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
              Join Date
            </label>
            <p className='text-sm text-gray-900 mt-1 font-medium'>
              {user.joinDate ? formatDate(user.joinDate) : '—'}
            </p>
          </div>
          <div>
            <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
              Status
            </label>
            <Badge.Root
              variant='light'
              color={user.isActive ? 'green' : 'red'}
              size='small'
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge.Root>
          </div>
        </div>
      </div>

      {/* Work Information */}
      <div>
        <h3 className='text-sm text-gray-900 mb-3 font-medium'>
          Work Information
        </h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
              Employee Code
            </label>
            <p className='text-sm text-gray-900 mt-1 font-mono font-medium'>
              {user.code}
            </p>
          </div>
          <div>
            <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
              Department Role
            </label>
            <p className='text-sm text-gray-900 mt-1 font-medium'>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
          </div>
          <div className='col-span-2'>
            <label className='text-xs text-gray-500 block font-medium uppercase tracking-wide'>
              Job Title
            </label>
            <p className='text-sm text-gray-900 mt-1 font-medium'>
              {user.jobTitle || '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Section */}
      {user.avatar && (
        <div>
          <h3 className='text-sm text-gray-900 mb-3 font-medium'>Avatar</h3>
          <div className='flex items-center gap-3'>
            <img
              src={user.avatar}
              alt={`${user.firstName} ${user.lastName}`}
              className='ring-gray-200 size-16 rounded-full object-cover ring-1'
            />
            <div>
              <p className='text-sm text-gray-900 font-medium'>
                Profile Picture
              </p>
              <p className='text-xs text-gray-500'>
                Last updated {formatDate(user.updatedAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <div className='text-xs text-gray-500 border-t pt-4'>
        Account created on {formatDate(user.createdAt)}
        {user.updatedAt !== user.createdAt && (
          <span> • Last updated {formatDate(user.updatedAt)}</span>
        )}
      </div>
    </div>
  );
}

export function UserDetailsDrawer({
  userId,
  open,
  onClose,
}: UserDetailsDrawerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const { data, isLoading, error } = useUser(userId || '');

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!open || !userId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className={isMobile ? 'max-w-full' : 'max-w-md'}>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>User Details</Drawer.Title>
        </Drawer.Header>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-6 py-6'>
          {isLoading && (
            <div className='flex items-center justify-center py-8'>
              <RiLoader4Line className='text-gray-400 size-6 animate-spin' />
              <span className='text-sm text-gray-500 ml-2'>Loading...</span>
            </div>
          )}

          {error && (
            <div className='py-8 text-center'>
              <p className='text-sm text-red-600'>Error: {error.message}</p>
            </div>
          )}

          {data?.user && !isLoading && !error && (
            <UserDetailsContent user={data.user} />
          )}
        </div>
      </Drawer.Content>
    </Drawer.Root>
  );
}
