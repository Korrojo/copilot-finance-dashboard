import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import { Sparkline } from './Sparkline';

export type CardVariant = 'success' | 'danger' | 'neutral';

interface CashFlowSummaryCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  variant?: CardVariant;
  sparklineData?: number[];
  className?: string;
  stats?: Array<{ label: string; value: string }>;
  large?: boolean;
}

const variantStyles = {
  success: {
    valueColor: 'text-green-400',
    sparklineColor: '#22c55e',
    changePositive: 'text-green-400',
    changeNegative: 'text-red-400',
  },
  danger: {
    valueColor: 'text-red-400',
    sparklineColor: '#ef4444',
    changePositive: 'text-red-400',
    changeNegative: 'text-green-400',
  },
  neutral: {
    valueColor: 'text-white',
    sparklineColor: '#3b82f6',
    changePositive: 'text-green-400',
    changeNegative: 'text-red-400',
  },
};

export function CashFlowSummaryCard({
  title,
  value,
  change,
  changeLabel = 'vs last period',
  variant = 'neutral',
  sparklineData,
  className = '',
  stats,
  large = false,
}: CashFlowSummaryCardProps) {
  const styles = variantStyles[variant];
  const isPositiveChange = change !== undefined && change >= 0;

  return (
    <div className={`bg-[#141824] rounded-xl border border-gray-800 ${large ? 'p-8' : 'p-6'} ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-gray-400 text-sm mb-2">{title}</p>
          <h2 className={`${large ? 'text-4xl' : 'text-3xl'} font-bold ${styles.valueColor}`}>
            {formatCurrency(value)}
          </h2>
        </div>
        {sparklineData && sparklineData.length > 1 && (
          <Sparkline
            data={sparklineData}
            color={styles.sparklineColor}
            height={large ? 50 : 40}
          />
        )}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 text-sm mb-3">
          {isPositiveChange ? (
            <TrendingUp className={`w-4 h-4 ${variant === 'danger' ? styles.changePositive : 'text-green-400'}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 ${variant === 'danger' ? styles.changeNegative : 'text-red-400'}`} />
          )}
          <span
            className={`font-medium ${
              variant === 'danger'
                ? isPositiveChange
                  ? styles.changePositive
                  : styles.changeNegative
                : isPositiveChange
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {isPositiveChange ? '+' : ''}
            {change.toFixed(2)}%
          </span>
          <span className="text-gray-500">{changeLabel}</span>
        </div>
      )}

      {stats && stats.length > 0 && (
        <div className="pt-3 border-t border-gray-800 grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index}>
              <p className="text-xs text-gray-500">{stat.label}</p>
              <p className="text-sm font-medium text-gray-300">{stat.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
