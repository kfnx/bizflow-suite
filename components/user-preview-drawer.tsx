'use client';

import React from 'react';
import {
  RiEditLine,
  RiLoader4Line,
  RiLockPasswordLine,
} from '@remixicon/react';

import { formatDate } from '@/utils/date-formatter';
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
  return (
    <>
      <Divider.Root variant='solid-text'>User Info</Divider.Root>

      <div className='p-5'>
        <div className='mb-3 flex items-center justify-between'>
          <div>
            <div className='text-title-h4 text-text-strong-950'>
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
            <Badge.Root
              variant='light'
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
        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            NIK
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {user.NIK || '—'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Phone
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {user.phone || '—'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Branch
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {user.branchName || '—'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Join Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {user.joinDate ? formatDate(user.joinDate) : '—'}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Status
          </div>
          <div className='mt-1'>
            <Badge.Root
              variant='light'
              color={user.isActive ? 'green' : 'red'}
              size='small'
            >
              {user.isActive ? 'Active' : 'Inactive'}
            </Badge.Root>
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Employee Code
          </div>
          <div className='mt-1 font-mono text-label-sm text-text-strong-950'>
            {user.code}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Department Role
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </div>
        </div>

        <Divider.Root variant='line-spacing' />

        <div>
          <div className='text-subheading-xs uppercase text-text-soft-400'>
            Created Date
          </div>
          <div className='mt-1 text-label-sm text-text-strong-950'>
            {formatDate(user.createdAt)}
          </div>
        </div>

        {user.updatedAt !== user.createdAt && (
          <>
            <Divider.Root variant='line-spacing' />
            <div>
              <div className='text-subheading-xs uppercase text-text-soft-400'>
                Last Updated
              </div>
              <div className='mt-1 text-label-sm text-text-strong-950'>
                {formatDate(user.updatedAt)}
              </div>
            </div>
          </>
        )}
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
                  Last updated {formatDate(user.updatedAt)}
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
      <Drawer.Content>
        {/* Header */}
        <Drawer.Header>
          <Drawer.Title>User Preview</Drawer.Title>
        </Drawer.Header>

        <Drawer.Body>
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
