import { useState } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import type { Transaction } from '../types';

interface AccountTransactionListProps {
  transactions: Transaction[];
  accountId: string;
  limit?: number;
}

export function AccountTransactionList({
  transactions,
  accountId,
  limit = 10,
}: AccountTransactionListProps) {
  const [showAll, setShowAll] = useState(false);

  // Filter transactions for this account
  const accountTransactions = transactions.filter(t => t.account === accountId);

  // Sort by date (most recent first)
  const sortedTransactions = [...accountTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Limit displayed transactions if not showing all
  const displayedTransactions = showAll ? sortedTransactions : sortedTransactions.slice(0, limit);

  if (accountTransactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No transactions found for this account
      </div>
    );
  }

  return (
    <div>
      <div className="space-y-2">
        {displayedTransactions.map(transaction => {
          const isExpense = transaction.amount < 0;
          return (
            <div
              key={transaction.id}
              className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-white">{transaction.merchant}</h4>
                    {transaction.status === 'pending' && (
                      <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                        Pending
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <span>
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{transaction.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-bold ${
                      isExpense ? 'text-red-400' : 'text-green-400'
                    }`}
                  >
                    {isExpense ? '-' : '+'}{formatCurrency(Math.abs(transaction.amount))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Show More/Less Button */}
      {sortedTransactions.length > limit && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-lg border border-gray-700 transition-colors"
        >
          {showAll
            ? 'Show Less'
            : `Show ${sortedTransactions.length - limit} More Transactions`}
        </button>
      )}
    </div>
  );
}
