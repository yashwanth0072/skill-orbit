import { cn } from '@/lib/utils';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

type Status = 'pending' | 'accepted' | 'declined' | 'matched' | 'unmatched';

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig: Record<Status, { label: string; icon: React.ElementType; className: string }> = {
  pending: {
    label: 'Pending',
    icon: Clock,
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  accepted: {
    label: 'Accepted',
    icon: Check,
    className: 'bg-success/10 text-success border-success/20',
  },
  declined: {
    label: 'Declined',
    icon: X,
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  matched: {
    label: 'Matched',
    icon: Check,
    className: 'bg-primary/10 text-primary border-primary/20',
  },
  unmatched: {
    label: 'Gap',
    icon: AlertCircle,
    className: 'bg-muted text-muted-foreground border-border',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border',
        config.className,
        className
      )}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}
