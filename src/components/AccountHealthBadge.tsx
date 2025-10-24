import type { AccountHealth } from '../types/account';
import { ACCOUNT_HEALTH_COLORS } from '../types/account';

interface AccountHealthBadgeProps {
  health: AccountHealth;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
};

export function AccountHealthBadge({ health, showScore = true, size = 'md' }: AccountHealthBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`rounded font-medium ${ACCOUNT_HEALTH_COLORS[health.status]} ${SIZE_CLASSES[size]}`}
      >
        {health.status.toUpperCase()}
      </span>
      {showScore && (
        <span className="text-xs text-gray-500">{health.score}/100</span>
      )}
    </div>
  );
}
