'use client';

import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';

import { cnExt } from '@/utils/cn';

export function Command({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cnExt(
        'flex h-full w-full flex-col overflow-hidden rounded-xl border border-stroke-soft-200 bg-bg-white-0 text-text-strong-950 shadow-regular-sm',
        className,
      )}
      {...props}
    />
  );
}

export const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Input
    ref={ref}
    className={cnExt(
      'w-full border-b border-stroke-soft-200 px-4 py-2 text-paragraph-md text-text-strong-950 placeholder:text-text-soft-400 focus:outline-none',
      className,
    )}
    {...props}
  />
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

export const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cnExt('max-h-60 overflow-y-auto', className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

export const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cnExt(
      'px-4 py-2 text-paragraph-sm text-text-soft-400',
      className,
    )}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

export const CommandGroup = CommandPrimitive.Group;

export const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cnExt(
      'flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-paragraph-sm text-text-strong-950 hover:bg-faded-lighter',
      className,
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

export const CommandSeparator = CommandPrimitive.Separator;
