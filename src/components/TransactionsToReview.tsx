import { ChevronRight, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import type { Transaction } from '../types';

interface TransactionsToReviewProps {
  transactions: Transaction[];
  maxItems?: number;
  onViewAll?: () => void;
  onSelectTransaction?: (transaction: Transaction) => void;
}

const categoryColors: Record<string, string> = {
  Shopping: 'bg-pink-500',
  Restaurants: 'bg-green-500',
  Groceries: 'bg-blue-500',
  'Auto Misc': 'bg-cyan-500',
  Utility: 'bg-yellow-500',
  Other: 'bg-gray-500',
  'Food & Drink': 'bg-orange-500',
  Entertainment: 'bg-purple-500',
  Transportation: 'bg-indigo-500',
  Healthcare: 'bg-red-500',
};

export function TransactionsToReview({
  transactions,
  maxItems = 5,
  onViewAll,
  onSelectTransaction,
}: TransactionsToReviewProps) {
  // Filter transactions that need review (e.g., pending, large amounts, etc.)
  const needsReview = transactions
    .filter(t => {
      // Criteria for needing review:
      // 1. Pending transactions
      // 2. Large transactions (over $100)
      // 3. Uncategorized transactions
      return (
        t.status === 'pending' ||
        Math.abs(t.amount) > 100 ||
        t.category === 'Other' ||
        !t.notes
      );
    })
    .slice(0, maxItems);

  if (needsReview.length === 0) {
    return (
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Transactions to review</h3>
        </div>
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-500/20 mb-3">
            <AlertCircle className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-gray-400">No transactions to review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Transactions to review</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-400 text-sm hover:text-blue-300 flex items-center gap-1"
          >
            VIEW ALL
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-2">
        {needsReview.map((transaction) => {
          const requiresAction = transaction.status === 'pending' || Math.abs(transaction.amount) > 200;

          return (
            <div
              key={transaction.id}
              onClick={() => onSelectTransaction?.(transaction)}
              className="flex items-center justify-between p-3 hover:bg-[#1a1f2e] rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {requiresAction && (
                  <div className="w-2 h-2 rounded-full bg-yellow-500 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white font-medium truncate">{transaction.merchant}</span>
                    {transaction.status === 'pending' && (
                      <span className="text-xs px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-full flex-shrink-0">
                        PENDING
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span className="text-xs">•</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        categoryColors[transaction.category] || 'bg-gray-500'
                      } text-white`}
                    >
                      {transaction.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <span
                  className={`text-base font-semibold ${
                    transaction.amount > 0 ? 'text-green-400' : 'text-white'
                  }`}
                >
                  {formatCurrency(transaction.amount)}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
