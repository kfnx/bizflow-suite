'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  RiArrowLeftLine,
  RiCheckLine,
  RiErrorWarningLine,
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
} from '@remixicon/react';
import { useSession } from 'next-auth/react';

import { cn } from '@/utils/cn';
import { useUpdatePassword } from '@/hooks/use-users';
import * as Divider from '@/components/ui/divider';
import * as FancyButton from '@/components/ui/fancy-button';
import * as Input from '@/components/ui/input';
import * as Label from '@/components/ui/label';
import * as LinkButton from '@/components/ui/link-button';

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function UpdatePasswordPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const updatePasswordMutation = useUpdatePassword();

  const [formData, setFormData] = React.useState<PasswordFormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [validationErrors, setValidationErrors] = React.useState<
    Record<string, string>
  >({});

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    // if (!/(?=.*\d)/.test(password)) {
    //   return 'Password must contain at least one number';
    // }
    return null;
  };

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (updatePasswordMutation.error) {
      updatePasswordMutation.reset();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Clear previous validation errors
    setValidationErrors({});

    // Client-side validation
    const errors: Record<string, string> = {};

    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else {
      const passwordError = validatePassword(formData.newPassword);
      if (passwordError) {
        errors.newPassword = passwordError;
      }
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Submit the form
    updatePasswordMutation.mutate(formData);
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className='w-full max-w-[472px] px-4'>
        <div className='flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8'>
          <div className='flex flex-col items-center gap-2'>
            <div className='text-paragraph-sm text-text-sub-600'>
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (updatePasswordMutation.isSuccess) {
    return (
      <div className='w-full max-w-[472px] px-4'>
        <div className='flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8'>
          <div className='flex flex-col items-center gap-2'>
            {/* Success icon */}
            <div className='flex size-16 items-center justify-center rounded-full bg-success-lighter'>
              <RiCheckLine className='size-8 text-success-base' />
            </div>

            <div className='space-y-1 text-center'>
              <div className='text-title-h6 lg:text-title-h5'>
                Password updated successfully
              </div>
              <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
                Your password has been updated. You can now sign in with your
                new password.
              </div>
            </div>
          </div>

          <Divider.Root />

          <div className='text-center'>
            <LinkButton.Root variant='gray' size='medium' underline asChild>
              <Link href='/'>
                <RiArrowLeftLine className='size-4' />
                Back to Dashboard
              </Link>
            </LinkButton.Root>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full max-w-[472px] px-4'>
      <form
        onSubmit={handleSubmit}
        className='flex w-full flex-col gap-6 rounded-20 bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 md:p-8'
      >
        <div className='flex flex-col items-center gap-2'>
          {/* icon */}
          <div
            className={cn(
              'relative flex size-[68px] shrink-0 items-center justify-center rounded-full backdrop-blur-xl lg:size-24',
              // bg
              'before:absolute before:inset-0 before:rounded-full',
              'before:bg-gradient-to-b before:from-neutral-500 before:to-transparent before:opacity-10',
            )}
          >
            <div className='relative z-10 flex size-12 items-center justify-center rounded-full bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 lg:size-16'>
              <RiLockLine className='size-6 text-text-sub-600 lg:size-8' />
            </div>
          </div>

          <div className='space-y-1 text-center'>
            <div className='text-title-h6 lg:text-title-h5'>
              Update your password
            </div>
            <div className='text-paragraph-sm text-text-sub-600 lg:text-paragraph-md'>
              Enter your current password and choose a new secure password.
            </div>
          </div>
        </div>

        <Divider.Root />

        {/* Error Message */}
        {updatePasswordMutation.error && (
          <div className='flex items-center gap-2 rounded-lg bg-error-lighter p-3 text-paragraph-sm text-error-base'>
            <RiErrorWarningLine className='size-4 shrink-0' />
            <span>{updatePasswordMutation.error.message}</span>
          </div>
        )}

        {/* Current Password */}
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='currentPassword'>
            Current Password <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiLockLine} />
              <Input.Input
                id='currentPassword'
                type={showPasswords.current ? 'text' : 'password'}
                placeholder='Enter your current password'
                required
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange('currentPassword', e.target.value)
                }
                disabled={updatePasswordMutation.isPending}
              />
              <Input.Affix>
                <button
                  type='button'
                  onClick={() => toggleShowPassword('current')}
                  className='hover:text-text-base flex items-center justify-center p-1 text-text-sub-600'
                  disabled={updatePasswordMutation.isPending}
                >
                  {showPasswords.current ? (
                    <RiEyeOffLine className='size-4' />
                  ) : (
                    <RiEyeLine className='size-4' />
                  )}
                </button>
              </Input.Affix>
            </Input.Wrapper>
          </Input.Root>
          {validationErrors.currentPassword && (
            <div className='text-paragraph-xs text-error-base'>
              {validationErrors.currentPassword}
            </div>
          )}
        </div>

        {/* New Password */}
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='newPassword'>
            New Password <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiLockLine} />
              <Input.Input
                id='newPassword'
                type={showPasswords.new ? 'text' : 'password'}
                placeholder='Enter your new password'
                required
                value={formData.newPassword}
                onChange={(e) =>
                  handleInputChange('newPassword', e.target.value)
                }
                disabled={updatePasswordMutation.isPending}
              />
              <Input.Affix>
                <button
                  type='button'
                  onClick={() => toggleShowPassword('new')}
                  className='hover:text-text-base flex items-center justify-center p-1 text-text-sub-600'
                  disabled={updatePasswordMutation.isPending}
                >
                  {showPasswords.new ? (
                    <RiEyeOffLine className='size-4' />
                  ) : (
                    <RiEyeLine className='size-4' />
                  )}
                </button>
              </Input.Affix>
            </Input.Wrapper>
          </Input.Root>
          {validationErrors.newPassword && (
            <div className='text-paragraph-xs text-error-base'>
              {validationErrors.newPassword}
            </div>
          )}
          <div className='text-paragraph-xs text-text-sub-600'>
            Password must be at least 8 characters with uppercase, lowercase,
            and number
          </div>
        </div>

        {/* Confirm Password */}
        <div className='flex flex-col gap-1'>
          <Label.Root htmlFor='confirmPassword'>
            Confirm New Password <Label.Asterisk />
          </Label.Root>
          <Input.Root>
            <Input.Wrapper>
              <Input.Icon as={RiLockLine} />
              <Input.Input
                id='confirmPassword'
                type={showPasswords.confirm ? 'text' : 'password'}
                placeholder='Confirm your new password'
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                disabled={updatePasswordMutation.isPending}
              />
              <Input.Affix>
                <button
                  type='button'
                  onClick={() => toggleShowPassword('confirm')}
                  className='hover:text-text-base flex items-center justify-center p-1 text-text-sub-600'
                  disabled={updatePasswordMutation.isPending}
                >
                  {showPasswords.confirm ? (
                    <RiEyeOffLine className='size-4' />
                  ) : (
                    <RiEyeLine className='size-4' />
                  )}
                </button>
              </Input.Affix>
            </Input.Wrapper>
          </Input.Root>
          {validationErrors.confirmPassword && (
            <div className='text-paragraph-xs text-error-base'>
              {validationErrors.confirmPassword}
            </div>
          )}
        </div>

        <FancyButton.Root
          variant='primary'
          size='medium'
          type='submit'
          disabled={updatePasswordMutation.isPending}
        >
          {updatePasswordMutation.isPending ? 'Updating...' : 'Update password'}
        </FancyButton.Root>

        <div className='text-center'>
          <LinkButton.Root variant='gray' size='medium' underline asChild>
            <Link href='/dashboard'>
              <RiArrowLeftLine className='size-4' />
              Back to Dashboard
            </Link>
          </LinkButton.Root>
        </div>
      </form>
    </div>
  );
}
