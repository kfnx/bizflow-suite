'use client';

import Link from 'next/link';
import { RiAddLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';

export function ActionButton({
  className,
  label,
  href,
  size = 'medium',
}: {
  className?: string;
  label: string;
  href: string;
  size?: 'small' | 'medium' | 'xsmall' | 'xxsmall';
}) {
  return (
    <Link href={href}>
      <Button.Root className={cn('rounded-xl', className)} size={size}>
        <Button.Icon as={RiAddLine} />
        {label}
      </Button.Root>
    </Link>
  );
}
