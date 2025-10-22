import { X, Edit2, Tag, FileText, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';
import type { Transaction } from '../types';

interface TransactionDetailPanelProps {
  transaction: Transaction;
  allTransactions: Transaction[];
  onClose: () => void;
  onEdit?: (transaction: Transaction) => void;
  onAddNote?: (transactionId: string) => void;
  onAddTags?: (transactionId: string) => void;
  onRecurring?: (transactionId: string) => void;
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

export function TransactionDetailPanel({
  transaction,
  allTransactions,
  onClose,
  onEdit,
  onAddNote,
  onAddTags,
  onRecurring,
}: TransactionDetailPanelProps) {
  // Find similar transactions (same merchant)
  const similarTransactions = allTransactions
    .filter(t => t.id !== transaction.id && t.merchant === transaction.merchant)
    .slice(0, 10);

  // Group similar transactions by month
  const transactionsByMonth = similarTransactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  // Calculate stats for similar transactions
  const totalSimilar = similarTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const avgSimilar = similarTransactions.length > 0 ? totalSimilar / similarTransactions.length : 0;
  const minSimilar = similarTransactions.length > 0
    ? Math.min(...similarTransactions.map(t => Math.abs(t.amount)))
    : 0;
  const maxSimilar = similarTransactions.length > 0
    ? Math.max(...similarTransactions.map(t => Math.abs(t.amount)))
    : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="w-96 bg-[#0f1218] border-l border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="sticky top-0 bg-[#0f1218] border-b border-gray-800 p-6 z-10">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">{transaction.merchant}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-gray-400">{formatDate(transaction.date)}</p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Amount Card */}
        <div className="bg-[#141824] rounded-xl p-5 border border-gray-800">
          <p className="text-sm text-gray-400 mb-2">Amount</p>
          <p className={`text-4xl font-bold ${
            transaction.amount > 0 ? 'text-green-400' : 'text-white'
          }`}>
            {formatCurrency(transaction.amount)}
          </p>
          {transaction.amount < 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
              <TrendingDown className="w-4 h-4" />
              <span>Spending</span>
            </div>
          )}
          {transaction.amount > 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>Income</span>
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-sm text-gray-400">Category</span>
            <span
              className={`text-sm px-3 py-1 rounded-full ${
                categoryColors[transaction.category] || 'bg-gray-500'
              } text-white`}
            >
              {transaction.category}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-sm text-gray-400">Account</span>
            <span className="text-sm text-white font-medium">{transaction.account}</span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-sm text-gray-400">Status</span>
            <span className={`text-sm px-3 py-1 rounded-full ${
              transaction.status === 'posted'
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
            }`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-800">
            <span className="text-sm text-gray-400">Type</span>
            <span className="text-sm text-white capitalize">{transaction.type}</span>
          </div>
        </div>

        {/* Notes */}
        {transaction.notes && (
          <div className="bg-[#141824] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <FileText className="w-4 h-4" />
              <span>Notes</span>
            </div>
            <p className="text-white text-sm">{transaction.notes}</p>
          </div>
        )}

        {/* Tags */}
        {transaction.tags && transaction.tags.length > 0 && (
          <div className="bg-[#141824] rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
              <Tag className="w-4 h-4" />
              <span>Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {transaction.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded border border-blue-500/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Similar Transactions */}
        {similarTransactions.length > 0 && (
          <div className="bg-[#141824] rounded-xl p-5 border border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Similar Transactions</h3>
              <span className="text-xs text-gray-400">{similarTransactions.length} found</span>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-[#0a0e1a] rounded-lg">
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(-avgSimilar, false)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Min</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(-minSimilar, false)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Max</p>
                <p className="text-sm font-semibold text-white">{formatCurrency(-maxSimilar, false)}</p>
              </div>
            </div>

            {/* Monthly Grouping */}
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {Object.entries(transactionsByMonth).map(([month, transactions]) => (
                <div key={month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-400 uppercase">{month}</span>
                    <span className="text-xs text-gray-500">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className="space-y-1">
                    {transactions.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 bg-[#0a0e1a] rounded hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-400">
                            {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <span className="text-sm font-medium text-white">
                          {formatCurrency(t.amount, false)}
                        </span>
                      </div>
                    ))}
                    {transactions.length > 3 && (
                      <p className="text-xs text-gray-500 text-center py-1">
                        +{transactions.length - 3} more
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions Footer */}
      <div className="sticky bottom-0 bg-[#0f1218] border-t border-gray-800 p-4 space-y-2">
        <button
          onClick={() => onEdit?.(transaction)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit Transaction</span>
        </button>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onAddNote?.(transaction.id)}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Add Note</span>
          </button>
          <button
            onClick={() => onAddTags?.(transaction.id)}
            className="flex items-center justify-center gap-2 py-2 px-3 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors text-sm"
          >
            <Tag className="w-4 h-4" />
            <span>Add Tags</span>
          </button>
        </div>
        {similarTransactions.length > 2 && (
          <button
            onClick={() => onRecurring?.(transaction.id)}
            className="w-full py-2 px-4 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/30 hover:bg-purple-500/20 transition-colors text-sm"
          >
            Mark as Recurring
          </button>
        )}
      </div>
    </div>
  );
}
