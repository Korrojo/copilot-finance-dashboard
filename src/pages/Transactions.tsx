import { useState, useMemo } from 'react';
import { Filter, Search, Download, ChevronRight } from 'lucide-react';
import { mockTransactions } from '../utils/mockTransactions';
import { formatCurrency } from '../utils/formatCurrency';
import { TransactionDetailPanel } from '../components/TransactionDetailPanel';
import type { Transaction } from '../types';

const categoryColors: Record<string, string> = {
  Shopping: 'bg-pink-500',
  Restaurants: 'bg-green-500',
  Groceries: 'bg-blue-500',
  'Auto Misc': 'bg-cyan-500',
  Utility: 'bg-yellow-500',
  Other: 'bg-gray-500',
};

type SortOption = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc' | 'merchant-asc';

export function Transactions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<{ min: string; max: string }>({ min: '', max: '' });

  // Get unique categories and accounts
  const categories = useMemo(() =>
    Array.from(new Set(mockTransactions.map(t => t.category))).sort(),
    []
  );

  const accounts = useMemo(() =>
    Array.from(new Set(mockTransactions.map(t => t.account))).sort(),
    []
  );

  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter((transaction) => {
      // Search filter
      const matchesSearch =
        transaction.merchant.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(transaction.category)) {
        return false;
      }

      // Account filter
      if (selectedAccounts.length > 0 && !selectedAccounts.includes(transaction.account)) {
        return false;
      }

      // Amount range filter
      const amount = Math.abs(transaction.amount);
      const min = amountRange.min ? parseFloat(amountRange.min) : -Infinity;
      const max = amountRange.max ? parseFloat(amountRange.max) : Infinity;
      if (amount < min || amount > max) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedCategories, selectedAccounts, amountRange]);

  // Sorted transactions
  const sortedTransactions = useMemo(() => {
    const sorted = [...filteredTransactions];
    switch (sortBy) {
      case 'date-desc':
        return sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'date-asc':
        return sorted.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      case 'amount-desc':
        return sorted.sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
      case 'amount-asc':
        return sorted.sort((a, b) => Math.abs(a.amount) - Math.abs(b.amount));
      case 'merchant-asc':
        return sorted.sort((a, b) => a.merchant.localeCompare(b.merchant));
      default:
        return sorted;
    }
  }, [filteredTransactions, sortBy]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const groupTransactionsByDate = () => {
    const grouped: Record<string, Transaction[]> = {};
    sortedTransactions.forEach((transaction) => {
      const date = transaction.date;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();

  const handleExport = () => {
    const csv = [
      ['Date', 'Merchant', 'Category', 'Account', 'Amount', 'Status', 'Type'],
      ...sortedTransactions.map(t => [
        t.date,
        t.merchant,
        t.category,
        t.account,
        t.amount.toString(),
        t.status,
        t.type
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedAccounts([]);
    setAmountRange({ min: '', max: '' });
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedAccounts.length > 0 ||
    amountRange.min !== '' || amountRange.max !== '';

  const selectedTransactionData = mockTransactions.find(t => t.id === selectedTransaction);

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
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                showFilters || hasActiveFilters
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-[#0a0e1a] text-gray-300 border-gray-700 hover:border-gray-600'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              {hasActiveFilters && <span className="text-xs">({
                selectedCategories.length + selectedAccounts.length + (amountRange.min || amountRange.max ? 1 : 0)
              })</span>}
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-2 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 focus:outline-none focus:border-blue-500"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High-Low)</option>
              <option value="amount-asc">Amount (Low-High)</option>
              <option value="merchant-asc">Merchant (A-Z)</option>
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-800 grid grid-cols-3 gap-4">
              {/* Categories Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Categories</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map(category => (
                    <label key={category} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, category]);
                          } else {
                            setSelectedCategories(selectedCategories.filter(c => c !== category));
                          }
                        }}
                        className="rounded border-gray-700 bg-[#0a0e1a] text-blue-600 focus:ring-blue-500"
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              {/* Accounts Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Accounts</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {accounts.map(account => (
                    <label key={account} className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAccounts.includes(account)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAccounts([...selectedAccounts, account]);
                          } else {
                            setSelectedAccounts(selectedAccounts.filter(a => a !== account));
                          }
                        }}
                        className="rounded border-gray-700 bg-[#0a0e1a] text-blue-600 focus:ring-blue-500"
                      />
                      {account}
                    </label>
                  ))}
                </div>
              </div>

              {/* Amount Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Amount Range</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={amountRange.min}
                    onChange={(e) => setAmountRange({ ...amountRange, min: e.target.value })}
                    className="w-full bg-[#0a0e1a] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={amountRange.max}
                    onChange={(e) => setAmountRange({ ...amountRange, max: e.target.value })}
                    className="w-full bg-[#0a0e1a] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  />
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="w-full text-sm text-gray-400 hover:text-white mt-2"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
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

      {/* Detail Panel (Right Sidebar) */}
      {selectedTransaction && selectedTransactionData && (
        <TransactionDetailPanel
          transaction={selectedTransactionData}
          allTransactions={mockTransactions}
          onClose={() => setSelectedTransaction(null)}
          onEdit={(transaction) => {
            console.log('Edit transaction:', transaction);
            // TODO: Implement edit functionality
          }}
          onAddNote={(transactionId) => {
            console.log('Add note to transaction:', transactionId);
            // TODO: Implement add note functionality
          }}
          onAddTags={(transactionId) => {
            console.log('Add tags to transaction:', transactionId);
            // TODO: Implement add tags functionality
          }}
          onRecurring={(transactionId) => {
            console.log('Mark as recurring:', transactionId);
            // TODO: Implement recurring transaction functionality
          }}
        />
      )}
    </div>
  );
}
