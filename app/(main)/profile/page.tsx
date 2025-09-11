'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  RiCalendarLine,
  RiMailLine,
  RiMapPin2Line,
  RiPhoneLine,
  RiShieldCheckLine,
  RiUserLine,
} from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { cn } from '@/utils/cn';
import { useCurrentUser } from '@/hooks/use-users';
import { getUserRoles } from '@/lib/permissions';
import { useQuery } from '@tanstack/react-query';
import * as Avatar from '@/components/ui/avatar';
import * as Divider from '@/components/ui/divider';
import { Loading } from '@/components/ui/loading';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useCurrentUser();

  // Fetch user roles
  const { data: userRoles = [], isLoading: rolesLoading } = useQuery({
    queryKey: ['user-roles', session?.user?.id],
    queryFn: () => getUserRoles(session!.user.id),
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (status !== 'loading' && !session) {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading' || userLoading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <Loading size={20} />
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  if (userError) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        <div className='text-error-base'>
          Error loading user data: {userError.message}
        </div>
      </div>
    );
  }

  // Use userData from the hook if available, otherwise fall back to session user
  const user = userData?.user || session.user;

  // Type guard to check if we have the full user data from API
  const hasFullUserData = userData?.user && 'NIK' in userData.user;
  const userDisplayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.firstName || 'User';

  return (
    <div className='mx-auto flex max-w-4xl flex-col gap-6 p-6'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-2xl font-semibold text-text-strong-950'>
            Profile
          </h1>
          <p className='text-sm text-text-sub-600'>
            View your account information
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className='shadow-sm rounded-lg border border-stroke-soft-200 bg-bg-white-0'>
        {/* Avatar Section */}
        <div className='border-b border-stroke-soft-200 p-6'>
          <div className='flex items-center gap-4'>
            <Avatar.Root size='80' color='blue'>
              <Avatar.Image
                src={user.avatar || '/images/avatar/illustration/arthur.png'}
                alt={userDisplayName}
              />
            </Avatar.Root>
            <div className='flex-1'>
              <h2 className='text-title-h3 text-text-strong-950'>
                {userDisplayName}
              </h2>
              <div className='mt-1 text-paragraph-sm text-text-sub-600'>
                {user.email}
              </div>
              <div className='mt-2 flex items-center gap-2'>
                <div
                  className={cn(
                    'text-xs inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium',
                    user.isAdmin
                      ? 'border border-red-200 bg-red-50 text-red-700'
                      : 'border border-blue-200 bg-blue-50 text-blue-700',
                  )}
                >
                  <RiShieldCheckLine className='size-3' />
                  {user.isAdmin ? 'Administrator' : rolesLoading ? 'Loading...' : userRoles.length > 0 ? userRoles.join(', ') : 'No Role'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className='p-6'>
          <Divider.Root variant='solid-text'>Personal Information</Divider.Root>

          <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                  <RiUserLine className='size-4 text-text-sub-600' />
                </div>
                <div className='flex-1'>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Full Name
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {userDisplayName}
                  </div>
                </div>
              </div>

              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                  <RiMailLine className='size-4 text-text-sub-600' />
                </div>
                <div className='flex-1'>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Email Address
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {user.email}
                  </div>
                </div>
              </div>

              {user.phone && (
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                    <RiPhoneLine className='size-4 text-text-sub-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-subheading-xs uppercase text-text-soft-400'>
                      Phone Number
                    </div>
                    <div className='mt-1 text-label-sm text-text-strong-950'>
                      {user.phone}
                    </div>
                  </div>
                </div>
              )}

              {hasFullUserData && userData.user.NIK && (
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                    <RiUserLine className='size-4 text-text-sub-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-subheading-xs uppercase text-text-soft-400'>
                      NIK
                    </div>
                    <div className='mt-1 font-mono text-label-sm text-text-strong-950'>
                      {userData.user.NIK}
                    </div>
                  </div>
                </div>
              )}

              {hasFullUserData && userData.user.jobTitle && (
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                    <RiUserLine className='size-4 text-text-sub-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-subheading-xs uppercase text-text-soft-400'>
                      Job Title
                    </div>
                    <div className='mt-1 text-label-sm text-text-strong-950'>
                      {userData.user.jobTitle}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-4'>
              <div className='flex items-center gap-3'>
                <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                  <RiShieldCheckLine className='size-4 text-text-sub-600' />
                </div>
                <div className='flex-1'>
                  <div className='text-subheading-xs uppercase text-text-soft-400'>
                    Role & Permissions
                  </div>
                  <div className='mt-1 text-label-sm text-text-strong-950'>
                    {rolesLoading ? 'Loading...' : userRoles.length > 0 ? userRoles.join(', ') : 'No Role'} {user.isAdmin && '(Admin)'}
                  </div>
                </div>
              </div>

              {hasFullUserData && userData.user.branchName && (
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                    <RiMapPin2Line className='size-4 text-text-sub-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-subheading-xs uppercase text-text-soft-400'>
                      Branch
                    </div>
                    <div className='mt-1 text-label-sm text-text-strong-950'>
                      {userData.user.branchName}
                    </div>
                  </div>
                </div>
              )}

              {hasFullUserData && userData.user.joinDate && (
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                    <RiCalendarLine className='size-4 text-text-sub-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-subheading-xs uppercase text-text-soft-400'>
                      Join Date
                    </div>
                    <div className='mt-1 text-label-sm text-text-strong-950'>
                      {new Date(userData.user.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              )}

              {hasFullUserData && userData.user.type && (
                <div className='flex items-center gap-3'>
                  <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                    <RiUserLine className='size-4 text-text-sub-600' />
                  </div>
                  <div className='flex-1'>
                    <div className='text-subheading-xs uppercase text-text-soft-400'>
                      Employee Type
                    </div>
                    <div className='mt-1 text-label-sm text-text-strong-950'>
                      {userData.user.type}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information Section */}
          {hasFullUserData &&
            (userData.user.code ||
              userData.user.isActive !== undefined ||
              userData.user.createdAt ||
              userData.user.updatedAt) && (
              <>
                <Divider.Root variant='solid-text' className='mt-8'>
                  Additional Information
                </Divider.Root>

                <div className='mt-4 grid grid-cols-1 gap-6 md:grid-cols-2'>
                  <div className='space-y-4'>
                    {userData.user.code && (
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                          <RiUserLine className='size-4 text-text-sub-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='text-subheading-xs uppercase text-text-soft-400'>
                            Employee Code
                          </div>
                          <div className='mt-1 font-mono text-label-sm text-text-strong-950'>
                            {userData.user.code}
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='flex items-center gap-3'>
                      <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                        <RiShieldCheckLine className='size-4 text-text-sub-600' />
                      </div>
                      <div className='flex-1'>
                        <div className='text-subheading-xs uppercase text-text-soft-400'>
                          Account Status
                        </div>
                        <div className='mt-1'>
                          <span
                            className={cn(
                              'text-xs inline-flex items-center gap-1 rounded-full px-2 py-1 font-medium',
                              userData.user.isActive
                                ? 'border border-green-200 bg-green-50 text-green-700'
                                : 'border border-red-200 bg-red-50 text-red-700',
                            )}
                          >
                            {userData.user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-4'>
                    {userData.user.createdAt && (
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                          <RiCalendarLine className='size-4 text-text-sub-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='text-subheading-xs uppercase text-text-soft-400'>
                            Account Created
                          </div>
                          <div className='mt-1 text-label-sm text-text-strong-950'>
                            {new Date(
                              userData.user.createdAt,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {userData.user.updatedAt && (
                      <div className='flex items-center gap-3'>
                        <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-bg-weak-50'>
                          <RiCalendarLine className='size-4 text-text-sub-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='text-subheading-xs uppercase text-text-soft-400'>
                            Last Updated
                          </div>
                          <div className='mt-1 text-label-sm text-text-strong-950'>
                            {new Date(
                              userData.user.updatedAt,
                            ).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
