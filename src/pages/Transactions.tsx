import { useState } from 'react';
import { Filter, Search, Download, ChevronRight } from 'lucide-react';
import { mockTransactions } from '../utils/mockTransactions';
import { formatCurrency } from '../utils/formatCurrency';

const categoryColors: Record<string, string> = {
  Shopping: 'bg-pink-500',
  Restaurants: 'bg-green-500',
  Groceries: 'bg-blue-500',
  'Auto Misc': 'bg-cyan-500',
  Utility: 'bg-yellow-500',
  Other: 'bg-gray-500',
};

export function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);

  const filteredTransactions = mockTransactions.filter((transaction) =>
    transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transaction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupTransactionsByDate = () => {
    const grouped: Record<string, typeof mockTransactions> = {};
    filteredTransactions.forEach((transaction) => {
      const date = transaction.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">All transactions</h1>
          <p className="text-gray-400">{filteredTransactions.length} transactions</p>
        </div>

        {/* Filters Bar */}
        <div className="bg-[#141824] rounded-xl p-4 mb-6 border border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a0e1a] text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600">
              <span>Sort</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <div key={date}>
              <div className="text-sm text-gray-500 font-semibold mb-3 uppercase">
                {formatDate(date)}
              </div>
              <div className="bg-[#141824] rounded-xl border border-gray-800 overflow-hidden">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    onClick={() => setSelectedTransaction(transaction.id)}
                    className={`flex items-center justify-between p-4 hover:bg-[#1a1f2e] cursor-pointer transition-colors ${
                      index !== transactions.length - 1 ? 'border-b border-gray-800' : ''
                    } ${selectedTransaction === transaction.id ? 'bg-[#1a1f2e]' : ''}`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{transaction.merchant}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              categoryColors[transaction.category] || 'bg-gray-500'
                            } text-white`}
                          >
                            {transaction.category}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {transaction.account}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-semibold ${
                          transaction.amount > 0 ? 'text-green-400' : 'text-white'
                        }`}
                      >
                        {formatCurrency(transaction.amount)}
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="bg-[#141824] rounded-xl p-12 border border-gray-800 text-center">
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>

      {/* Detail Panel (Right Sidebar) - Placeholder for now */}
      {selectedTransaction && (
        <div className="w-96 bg-[#141824] border-l border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Transaction Details</h2>
            <button
              onClick={() => setSelectedTransaction(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="text-gray-400">
            Detail panel coming in Phase 2.5
          </div>
        </div>
      )}
    </div>
  );
}
