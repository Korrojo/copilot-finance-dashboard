import { AlertCircle, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { Sparkline } from './charts/Sparkline';
import { AccountHealthBadge } from './AccountHealthBadge';
import type { DetailedAccount, AccountHealth, AccountConnection } from '../types/account';
import { INSTITUTION_INFO } from '../types/account';

interface AccountCardProps {
  account: DetailedAccount;
  health: AccountHealth;
  connection: AccountConnection;
  sparklineData: number[];
  showBalances: boolean;
  onClick: () => void;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export function AccountCard({
  account,
  health,
  connection,
  sparklineData,
  showBalances,
  onClick,
}: AccountCardProps) {
  // Calculate percentage change from sparkline data
  const percentageChange = sparklineData.length >= 2
    ? ((sparklineData[sparklineData.length - 1] - sparklineData[0]) / sparklineData[0]) * 100
    : 0;

  const isPositiveChange = percentageChange > 0;

  // Get institution info
  const institutionInfo = INSTITUTION_INFO[account.institution.toLowerCase().replace(/\s+/g, '_')] || {
    logo: '🏦',
    color: account.color || '#3b82f6',
  };

  // Calculate utilization for credit cards
  const utilization = account.type === 'credit' && account.limit
    ? (Math.abs(account.currentBalance) / account.limit) * 100
    : 0;

  // Determine sparkline color based on account type and utilization
  const getSparklineColor = () => {
    if (account.type === 'credit') {
      if (utilization > 80) return '#ef4444'; // red
      if (utilization > 50) return '#eab308'; // yellow
      return '#22c55e'; // green
    }
    if (account.type === 'investment') return '#10b981'; // emerald
    return '#3b82f6'; // blue
  };

  const sparklineColor = getSparklineColor();
  const sparklineFillColor = sparklineColor + '20'; // Add 20% opacity

  return (
    <div
      onClick={onClick}
      className="bg-[#141824] rounded-xl p-6 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
    >
      {/* Header: Institution logo, name, and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{institutionInfo.logo}</span>
            <h3 className="text-lg font-semibold text-white">
              {account.nickname || account.name}
            </h3>
            {account.needsAttention && (
              <AlertCircle className="w-4 h-4 text-yellow-400" />
            )}
          </div>
          <p className="text-sm text-gray-500">
            {account.institution} ••• {account.mask}
          </p>
        </div>
        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: institutionInfo.color }}
        />
      </div>

      {/* Balance */}
      <div className="mb-3">
        <p className="text-2xl font-bold text-white">
          {showBalances
            ? formatCurrency(account.type === 'credit' ? Math.abs(account.currentBalance) : account.currentBalance)
            : '••••••'}
        </p>
        {account.limit && (
          <p className="text-sm text-gray-400 mt-1">
            of {formatCurrency(account.limit)} limit
          </p>
        )}
      </div>

      {/* Utilization Bar (for credit cards) */}
      {account.type === 'credit' && account.limit && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span>{utilization.toFixed(0)}% utilized</span>
            {account.availableBalance && (
              <span>{formatCurrency(account.availableBalance)} available</span>
            )}
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${
                utilization > 80 ? 'bg-red-500' : utilization > 50 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(utilization, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Sparkline with percentage change */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <Sparkline
            data={sparklineData}
            width={150}
            height={32}
            color={sparklineColor}
            fillColor={sparklineFillColor}
          />
          {percentageChange !== 0 && (
            <div className={`flex items-center gap-1 text-xs font-medium ${
              isPositiveChange ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositiveChange ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{Math.abs(percentageChange).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer: Health badge and last synced */}
      <div className="flex items-center justify-between">
        <AccountHealthBadge health={health} showScore={true} size="sm" />
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>{formatTimeAgo(connection.lastSync)}</span>
        </div>
      </div>
    </div>
  );
}
