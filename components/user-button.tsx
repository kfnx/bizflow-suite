'use client';

import * as React from 'react';
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiLayoutGridLine,
  RiLogoutBoxRLine,
  RiMoonLine,
  RiPaletteLine,
  RiPulseLine,
  RiSettings2Line,
} from '@remixicon/react';
import { signOut, useSession } from 'next-auth/react';
import { useTheme } from 'next-themes';

import { cn, cnExt } from '@/utils/cn';
import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import * as Dropdown from '@/components/ui/dropdown';
import * as ToggleGroup from '@/components/ui/toggle-group';

import IconVerifiedFill from '~/icons/icon-verified-fill.svg';

export function UserButton({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div
        className={cnExt(
          'flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none',
          className,
        )}
      >
        <div className='size-10 animate-pulse rounded-full bg-bg-weak-50' />
        <div className='flex-1 space-y-2' data-hide-collapsed>
          <div className='h-4 animate-pulse rounded bg-bg-weak-50' />
          <div className='h-3 animate-pulse rounded bg-bg-weak-50' />
        </div>
      </div>
    );
  }

  // Don't render if no session
  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const userDisplayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || 'User';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <Dropdown.Root>
      <Dropdown.Trigger
        className={cnExt(
          'flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none',
          className,
        )}
      >
        <Avatar.Root size='40' color='blue'>
          <Avatar.Image
            src={user.avatar || '/images/avatar/illustration/arthur.png'}
            alt={userDisplayName}
          />
        </Avatar.Root>
        <div
          className='flex w-[172px] shrink-0 items-center gap-3'
          data-hide-collapsed
        >
          <div className='flex-1 space-y-1'>
            <div className='flex items-center gap-0.5 text-label-sm'>
              {userDisplayName}
              <IconVerifiedFill className='size-5 text-verified-base' />
            </div>
            <div className='text-paragraph-xs text-text-sub-600'>
              {user.email}
            </div>
          </div>

          <div className='flex size-6 items-center justify-center rounded-md'>
            <RiArrowRightSLine className='size-5 text-text-sub-600' />
          </div>
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side='right' sideOffset={24} align='end'>
        <Dropdown.Item disabled className='cursor-default'>
          <Dropdown.ItemIcon as={RiPaletteLine} />
          <span className='text-text-strong-950'>Theme</span>
          <span className='flex-1' />
          <ToggleGroup.Root
            type='single'
            value={theme}
            onValueChange={(value: string) => {
              if (value) setTheme(value as 'light' | 'dark' | 'system');
            }}
            className='w-auto'
          >
            <ToggleGroup.Item value='light' className='text-xs px-2 py-1'>
              Light
            </ToggleGroup.Item>
            <ToggleGroup.Item value='dark' className='text-xs px-2 py-1'>
              Dark
            </ToggleGroup.Item>
            <ToggleGroup.Item value='system' className='text-xs px-2 py-1'>
              Auto
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </Dropdown.Item>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item disabled>
            <Dropdown.ItemIcon as={RiPulseLine} />
            Activity
          </Dropdown.Item>
          <Dropdown.Item disabled>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Integrations
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item onSelect={handleLogout}>
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            Logout
          </Dropdown.Item>
        </Dropdown.Group>
        <div className='p-2 text-paragraph-sm text-text-soft-400'>v.0.1</div>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}

export function UserButtonMobile({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
      <div
        className={cnExt(
          'flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none',
          className,
        )}
      >
        <div className='size-12 animate-pulse rounded-full bg-bg-weak-50' />
        <div className='flex-1 space-y-2'>
          <div className='h-4 animate-pulse rounded bg-bg-weak-50' />
          <div className='h-3 animate-pulse rounded bg-bg-weak-50' />
        </div>
      </div>
    );
  }

  // Don't render if no session
  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const userDisplayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || 'User';

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <Dropdown.Root modal={false}>
      <Dropdown.Trigger
        className={cnExt(
          'group flex w-full items-center gap-3 whitespace-nowrap rounded-10 p-3 text-left outline-none hover:bg-bg-weak-50 focus:outline-none',
          className,
        )}
      >
        <Avatar.Root size='48' color='blue'>
          <Avatar.Image
            src={user.avatar || '/images/avatar/illustration/arthur.png'}
            alt={userDisplayName}
          />
        </Avatar.Root>
        <div className='flex-1 space-y-1'>
          <div className='flex items-center gap-0.5 text-label-md'>
            {userDisplayName}
            <IconVerifiedFill className='size-5 text-verified-base' />
          </div>
          <div className='text-paragraph-sm text-text-sub-600'>
            {user.email}
          </div>
        </div>
        <div
          className={cn(
            'flex size-6 items-center justify-center rounded-md border border-stroke-soft-200 bg-bg-white-0 text-text-sub-600 shadow-regular-xs',
            // open
            'group-data-[state=open]:bg-bg-strong-950 group-data-[state=open]:text-text-white-0 group-data-[state=open]:shadow-none',
          )}
        >
          <RiArrowDownSLine className='size-5 group-data-[state=open]:-rotate-180' />
        </div>
      </Dropdown.Trigger>
      <Dropdown.Content side='top' align='end'>
        <Dropdown.Item disabled>
          <Dropdown.ItemIcon as={RiMoonLine} />
          Theme
          <span className='flex-1' />
          <ToggleGroup.Root
            type='single'
            value={theme}
            onValueChange={(value: string) => {
              if (value) setTheme(value as 'light' | 'dark' | 'system');
            }}
            className='w-auto'
          >
            <ToggleGroup.Item value='light' className='text-xs px-2 py-1'>
              Light
            </ToggleGroup.Item>
            <ToggleGroup.Item value='dark' className='text-xs px-2 py-1'>
              Dark
            </ToggleGroup.Item>
            <ToggleGroup.Item value='system' className='text-xs px-2 py-1'>
              Auto
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </Dropdown.Item>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiPulseLine} />
            Activity
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiLayoutGridLine} />
            Integrations
          </Dropdown.Item>
          <Dropdown.Item>
            <Dropdown.ItemIcon as={RiSettings2Line} />
            Settings
          </Dropdown.Item>
        </Dropdown.Group>
        <Divider.Root variant='line-spacing' />
        <Dropdown.Group>
          <Dropdown.Item onSelect={handleLogout}>
            <Dropdown.ItemIcon as={RiLogoutBoxRLine} />
            Logout
          </Dropdown.Item>
        </Dropdown.Group>
        <div className='p-2 text-paragraph-sm text-text-soft-400'>v.0.1</div>
      </Dropdown.Content>
    </Dropdown.Root>
  );
}
