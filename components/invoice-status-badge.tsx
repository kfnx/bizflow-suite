import * as Badge from '@/components/ui/badge';

export const invoiceStatusConfig = {
  draft: {
    label: 'Draft',
    variant: 'lighter' as const,
    color: 'gray' as const,
  },
  sent: {
    label: 'Sent',
    variant: 'lighter' as const,
    color: 'blue' as const,
  },
  paid: {
    label: 'Paid',
    variant: 'lighter' as const,
    color: 'green' as const,
  },
  void: {
    label: 'Void',
    variant: 'lighter' as const,
    color: 'red' as const,
  },
  overdue: {
    label: 'Overdue',
    variant: 'lighter' as const,
    color: 'red' as const,
  },
} as const;

export type InvoiceStatus = keyof typeof invoiceStatusConfig;

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  size?: 'small' | 'medium';
}

export function InvoiceStatusBadge({
  status,
  size = 'medium',
}: InvoiceStatusBadgeProps) {
  const statusConfig = invoiceStatusConfig[status];

  if (!statusConfig) {
    return null;
  }

  return (
    <Badge.Root
      variant={statusConfig.variant}
      color={statusConfig.color}
      size={size}
    >
      {statusConfig.label}
    </Badge.Root>
  );
}
