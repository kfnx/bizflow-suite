'use client';

import React from 'react';
import {
  RiEditLine,
  RiLoader4Line,
  RiLockPasswordLine,
} from '@remixicon/react';

import { usePermissions } from '@/hooks/use-permissions';
import { useResetUserPassword, useUser } from '@/hooks/use-users';
import * as Badge from '@/components/ui/badge';
import * as Button from '@/components/ui/button';
import * as Divider from '@/components/ui/divider';
import * as Drawer from '@/components/ui/drawer';
import { PermissionGate } from '@/components/auth/permission-gate';

interface UserPreviewDrawerProps {
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

function UserPreviewContent({ user }: { user: any }) {
  const renderDetailField = (label: string, value: string | number) => (
    <div>
      <div className='text-subheading-xs uppercase text-text-soft-400'>
        {label}
      </div>
      <div className='mt-1 text-label-sm text-text-strong-950'>{value}</div>
    </div>
  );

  return (
    <>
      <Divider.Root variant='solid-text'>User Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <div className='text-title-h5 text-text-strong-950'>
              {user.firstName} {user.lastName}
            </div>
            <div className='mt-1 text-paragraph-sm text-text-sub-600'>
              {user.code} • {user.email}
            </div>
            {user.jobTitle && (
              <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                {user.jobTitle}
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2'>
            <Badge.Root
              variant='lighter'
              color={getRoleColor(user.role)}
              size='medium'
            >
              {user.role}
            </Badge.Root>
            <Badge.Root
              variant='lighter'
              color={getTypeColor(user.type || 'full-time')}
              size='medium'
            >
              {user.type || 'full-time'}
            </Badge.Root>
            <Badge.Root
              variant='lighter'
              color={user.isAdmin ? 'purple' : 'gray'}
              size='medium'
            >
              {user.isAdmin ? 'Admin' : 'User'}
            </Badge.Root>
          </div>
        </div>
      </div>

      <Divider.Root variant='solid-text'>Preview</Divider.Root>

      <div className='flex flex-col gap-3 p-5'>
        <div className='grid grid-cols-2 gap-x-6 gap-y-4'>
          {/* Left Column */}
          <div className='space-y-4'>
            {renderDetailField('NIK', user.NIK || '—')}
            {renderDetailField('Branch', user.branchName || '—')}
            {renderDetailField(
              'Join Date',
              user.joinDate
                ? new Date(user.joinDate).toLocaleDateString()
                : '—',
            )}
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Status
              </div>
              <div className='mt-1'>
                <Badge.Root
                  variant='lighter'
                  color={user.isActive ? 'green' : 'red'}
                  size='small'
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge.Root>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className='space-y-4'>
            {renderDetailField('Phone', user.phone || '—')}
            {renderDetailField(
              'Department Role',
              user.role.charAt(0).toUpperCase() + user.role.slice(1),
            )}
            {renderDetailField(
              'Created Date',
              new Date(user.createdAt).toLocaleDateString(),
            )}
            {user.updatedAt !== user.createdAt &&
              renderDetailField(
                'Last Updated',
                new Date(user.updatedAt).toLocaleDateString(),
              )}
            {renderDetailField('Employee Code', user.code)}
          </div>
        </div>
      </div>

      {user.avatar && (
        <>
          <Divider.Root variant='solid-text'>Avatar</Divider.Root>
          <div className='p-5'>
            <div className='flex items-center gap-3'>
              <img
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
                className='ring-gray-200 size-16 rounded-full object-cover ring-1'
              />
              <div>
                <div className='text-label-sm text-text-strong-950'>
                  Profile Picture
                </div>
                <div className='text-paragraph-sm text-text-sub-600'>
                  Last updated {new Date(user.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function UserPreviewFooter({ user }: { user: any }) {
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
    <Drawer.Footer className='border-t'>
      <PermissionGate permission='users:update'>
        <Button.Root
          variant='neutral'
          mode='stroke'
          size='medium'
          className='w-full'
          onClick={handleEdit}
        >
          <Button.Icon as={RiEditLine} />
          Edit User
        </Button.Root>
        <Button.Root
          variant='primary'
          size='medium'
          className='w-full'
          onClick={handleResetPassword}
          disabled={resetPasswordMutation.isPending}
        >
          <Button.Icon as={RiLockPasswordLine} />
          {resetPasswordMutation.isPending ? 'Resetting...' : 'Reset Password'}
        </Button.Root>
      </PermissionGate>
    </Drawer.Footer>
  );
}

export function UserPreviewDrawer({
  userId,
  open,
  onClose,
}: UserPreviewDrawerProps) {
  const { data, isLoading, error } = useUser(userId || '');

  if (!open || !userId) return null;

  return (
    <Drawer.Root open={open} onOpenChange={onClose}>
      <Drawer.Content className='flex h-full flex-col'>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>User Preview</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body className='flex-1 overflow-y-auto'>
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
            <UserPreviewContent user={data.user} />
          )}
        </Drawer.Body>

        {data?.user && !isLoading && !error && (
          <UserPreviewFooter user={data.user} />
        )}
      </Drawer.Content>
    </Drawer.Root>
  );
}
