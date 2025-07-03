'use client';

import * as React from 'react';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';

import { cn, cnExt } from '@/utils/cn';

const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    className={cnExt('flex items-center', className)}
    {...props}
  />
));
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={cnExt(
      'focus-visible:ring-ring inline-flex items-center justify-center whitespace-nowrap px-3 py-1.5 text-paragraph-sm font-medium transition-all hover:bg-bg-weak-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-orange-500 data-[state=on]:text-white data-[state=on]:hover:bg-orange-600',
      // First item: rounded-l-md
      'first:rounded-l-md',
      // Last item: rounded-r-md
      'last:rounded-r-md',
      // Not first or last: no rounded corners
      'not-first:not-last:rounded-none',
      'border border-bg-soft-200',
      className,
    )}
    {...props}
  >
    {children}
  </ToggleGroupPrimitive.Item>
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;

export { ToggleGroup as Root, ToggleGroupItem as Item };
