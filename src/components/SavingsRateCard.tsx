import { Target, TrendingUp, TrendingDown } from 'lucide-react';

interface SavingsRateCardProps {
  savingsRate: number;
  change?: number;
  changeLabel?: string;
  targetRate?: number;
  className?: string;
}

export function SavingsRateCard({
  savingsRate,
  change,
  changeLabel = 'vs last period',
  targetRate = 20,
  className = '',
}: SavingsRateCardProps) {
  const isOnTrack = savingsRate >= targetRate;
  const progressPercentage = Math.min((savingsRate / targetRate) * 100, 100);
  const isPositiveChange = change !== undefined && change >= 0;

  return (
    <div className={`bg-[#141824] rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-gray-400 text-sm">Savings Rate</p>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Target className="w-3.5 h-3.5" />
          <span>Target: {targetRate}%</span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className={`text-4xl font-bold ${isOnTrack ? 'text-green-400' : 'text-yellow-400'}`}>
          {savingsRate.toFixed(1)}%
        </h2>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isOnTrack ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-gray-500">0%</span>
          <span className="text-xs text-gray-500">{targetRate}%</span>
        </div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 text-sm pt-3 border-t border-gray-800">
          {isPositiveChange ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
          <span className={isPositiveChange ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
            {isPositiveChange ? '+' : ''}
            {change.toFixed(1)}pp
          </span>
          <span className="text-gray-500">{changeLabel}</span>
        </div>
      )}

      {!isOnTrack && (
        <div className="mt-3 pt-3 border-t border-gray-800">
          <p className="text-xs text-yellow-400">
            Save {((targetRate - savingsRate) * 1).toFixed(1)}% more to reach your target
          </p>
        </div>
      )}
    </div>
  );
}
