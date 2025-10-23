/**
 * StatusBadge component for displaying transaction status
 * Supports: Pending, Posted, Cleared, To Review
 */

export type TransactionStatus = 'pending' | 'posted' | 'cleared' | 'to_review';

interface StatusBadgeProps {
  status: TransactionStatus;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    },
    posted: {
      label: 'Posted',
      color: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    cleared: {
      label: 'Cleared',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    to_review: {
      label: 'To Review',
      color: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    },
  };

  const config = statusConfig[status];
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.color} ${sizeClasses}`}
    >
      {config.label}
    </span>
  );
}
