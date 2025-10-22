import { Calendar, AlertTriangle } from 'lucide-react';
import type { UpcomingBill } from '../types/subscription';
import { formatNextBillingDate } from '../utils/subscriptionDetection';

interface UpcomingBillsProps {
  bills: UpcomingBill[];
  maxItems?: number;
}

export function UpcomingBills({ bills, maxItems }: UpcomingBillsProps) {
  const displayBills = maxItems ? bills.slice(0, maxItems) : bills;
  const totalUpcoming = displayBills.reduce((sum, bill) => sum + bill.estimatedAmount, 0);

  if (bills.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Upcoming Bills</h3>
        </div>
        <p className="text-gray-400 text-center py-8">
          No upcoming bills in the next 30 days
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Upcoming Bills</h3>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">Next 30 days</div>
          <div className="text-lg font-semibold text-white">
            ${totalUpcoming.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-2">
        {displayBills.map((bill) => {
          const isUrgent = bill.daysUntilDue <= 3;
          const isPastDue = bill.isPastDue;

          return (
            <div
              key={bill.subscription.id}
              className={`p-3 rounded-lg border transition-colors ${
                isPastDue
                  ? 'bg-red-500/10 border-red-500/30'
                  : isUrgent
                  ? 'bg-yellow-500/10 border-yellow-500/30'
                  : 'bg-gray-700/30 border-gray-700/50 hover:border-gray-600/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-white">
                      {bill.subscription.merchantName}
                    </span>
                    {(isPastDue || isUrgent) && (
                      <AlertTriangle
                        className={`w-4 h-4 ${
                          isPastDue ? 'text-red-400' : 'text-yellow-400'
                        }`}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-sm">
                    <span
                      className={
                        isPastDue
                          ? 'text-red-400 font-medium'
                          : isUrgent
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }
                    >
                      {formatNextBillingDate(bill.dueDate)}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{bill.subscription.category}</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold text-white">
                    ${bill.estimatedAmount.toFixed(2)}
                  </div>
                  {bill.daysUntilDue > 0 && (
                    <div className="text-xs text-gray-500">
                      {bill.daysUntilDue} day{bill.daysUntilDue !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show more indicator */}
      {maxItems && bills.length > maxItems && (
        <div className="mt-3 pt-3 border-t border-gray-700/50 text-center">
          <span className="text-sm text-gray-400">
            +{bills.length - maxItems} more bill{bills.length - maxItems !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
}
