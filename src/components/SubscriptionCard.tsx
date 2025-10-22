import { AlertCircle, Calendar, TrendingUp } from 'lucide-react';
import type { Subscription } from '../types/subscription';
import { FREQUENCY_LABELS, SUBSCRIPTION_STATUS_COLORS } from '../types/subscription';
import { formatNextBillingDate } from '../utils/subscriptionDetection';

interface SubscriptionCardProps {
  subscription: Subscription;
  onCancel?: (id: string) => void;
  onPause?: (id: string) => void;
  onResume?: (id: string) => void;
  showActions?: boolean;
}

export function SubscriptionCard({
  subscription,
  onCancel,
  onPause,
  onResume,
  showActions = true,
}: SubscriptionCardProps) {
  const statusColor = SUBSCRIPTION_STATUS_COLORS[subscription.status];
  const frequencyLabel = FREQUENCY_LABELS[subscription.pattern.frequency];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-4 hover:border-gray-600/50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-white font-medium">{subscription.merchantName}</h3>
            <span
              className={`px-2 py-0.5 rounded text-xs border ${statusColor}`}
            >
              {subscription.status}
            </span>
          </div>
          <p className="text-sm text-gray-400">{subscription.category}</p>
        </div>

        <div className="text-right">
          <div className="text-xl font-semibold text-white">
            ${subscription.amount.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">{frequencyLabel}</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-3 pt-3 border-t border-gray-700/50">
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Total Spent</div>
          <div className="text-sm font-medium text-white">
            ${subscription.totalSpent.toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Payments</div>
          <div className="text-sm font-medium text-white">
            {subscription.occurrences}
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">Since</div>
          <div className="text-sm font-medium text-white">
            {new Date(subscription.firstDetected).toLocaleDateString('en-US', {
              month: 'short',
              year: '2-digit',
            })}
          </div>
        </div>
      </div>

      {/* Next Billing */}
      {subscription.status === 'active' && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-700/30 rounded text-sm">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-gray-300">
            Next billing: {formatNextBillingDate(subscription.pattern.nextDate)}
          </span>
        </div>
      )}

      {/* Low Usage Warning */}
      {subscription.isLowUsage && subscription.status === 'active' && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm">
          <AlertCircle className="w-4 h-4 text-yellow-400" />
          <span className="text-yellow-400">Consider reviewing - low usage detected</span>
        </div>
      )}

      {/* Cancelled Info */}
      {subscription.status === 'cancelled' && subscription.cancellationDate && (
        <div className="flex items-center gap-2 mb-3 p-2 bg-gray-700/30 rounded text-sm">
          <span className="text-gray-400">
            Cancelled on{' '}
            {new Date(subscription.cancellationDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      )}

      {/* Actions */}
      {showActions && (
        <div className="flex gap-2 pt-3 border-t border-gray-700/50">
          {subscription.status === 'active' && (
            <>
              {onPause && (
                <button
                  onClick={() => onPause(subscription.id)}
                  className="flex-1 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-700 text-gray-300 text-sm rounded transition-colors"
                >
                  Pause
                </button>
              )}
              {onCancel && (
                <button
                  onClick={() => onCancel(subscription.id)}
                  className="flex-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-sm rounded transition-colors"
                >
                  Cancel
                </button>
              )}
            </>
          )}
          {subscription.status === 'paused' && onResume && (
            <button
              onClick={() => onResume(subscription.id)}
              className="flex-1 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 text-green-400 text-sm rounded transition-colors"
            >
              Resume
            </button>
          )}
        </div>
      )}

      {/* Confidence Badge (for debugging/transparency) */}
      {subscription.pattern.confidence < 0.9 && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
          <TrendingUp className="w-3 h-3" />
          <span>
            {Math.round(subscription.pattern.confidence * 100)}% confidence
          </span>
        </div>
      )}
    </div>
  );
}
