'use client';

import * as Badge from '@/components/ui/badge';

interface DeliveryNoteStatusBadgeProps {
  status: string;
  size?: 'small' | 'medium';
}

export function DeliveryNoteStatusBadge({
  status,
  size = 'small',
}: DeliveryNoteStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return {
          variant: 'lighter' as const,
          color: 'orange' as const,
          label: 'Pending',
        };
      case 'delivered':
        return {
          variant: 'lighter' as const,
          color: 'green' as const,
          label: 'Delivered',
        };
      case 'canceled':
      case 'cancelled':
        return {
          variant: 'lighter' as const,
          color: 'red' as const,
          label: 'Canceled',
        };
      default:
        return {
          variant: 'lighter' as const,
          color: 'gray' as const,
          label: status,
        };
    }
  };

  const { variant, color, label } = getStatusConfig(status);

  return (
    <Badge.Root variant={variant} color={color} size={size}>
      {label}
    </Badge.Root>
  );
}
