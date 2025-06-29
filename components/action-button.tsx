'use client';

import Link from 'next/link';
import { RiAddLine } from '@remixicon/react';

import { cn } from '@/utils/cn';
import * as Button from '@/components/ui/button';

export function ActionButton({
  className,
  label,
  href,
}: {
  className?: string;
  label: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Button.Root className={cn('rounded-xl', className)}>
        <Button.Icon as={RiAddLine} />
        {label}
      </Button.Root>
    </Link>
  );
}
