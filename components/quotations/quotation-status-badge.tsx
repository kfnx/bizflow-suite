import * as Badge from '@/components/ui/badge';

export const quotationStatusConfig = {
  draft: {
    label: 'Draft',
    variant: 'lighter' as const,
    color: 'gray' as const,
  },
  submitted: {
    label: 'Submitted',
    variant: 'lighter' as const,
    color: 'blue' as const,
  },
  approved: {
    label: 'Approved',
    variant: 'lighter' as const,
    color: 'green' as const,
  },
  sent: {
    label: 'Sent',
    variant: 'lighter' as const,
    color: 'blue' as const,
  },
  accepted: {
    label: 'Accepted',
    variant: 'lighter' as const,
    color: 'green' as const,
  },
  rejected: {
    label: 'Rejected',
    variant: 'lighter' as const,
    color: 'red' as const,
  },
  revised: {
    label: 'Revised',
    variant: 'lighter' as const,
    color: 'orange' as const,
  },
} as const;

export type QuotationStatus = keyof typeof quotationStatusConfig;

interface QuotationStatusBadgeProps {
  status: QuotationStatus;
  size?: 'small' | 'medium';
}

export function QuotationStatusBadge({
  status,
  size = 'medium',
}: QuotationStatusBadgeProps) {
  const statusConfig = quotationStatusConfig[status];

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
