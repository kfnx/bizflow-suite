'use client';

import Link from 'next/link';
import { RiArrowLeftLine } from '@remixicon/react';

import * as Button from '@/components/ui/button';

export function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href}>
      <Button.Root variant='neutral' mode='stroke' className='hidden lg:flex'>
        <RiArrowLeftLine className='size-4' />
        {label}
      </Button.Root>
    </Link>
  );
}
