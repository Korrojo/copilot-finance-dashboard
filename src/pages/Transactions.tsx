import { useState, useMemo } from 'react';
import { Filter, Search, Download, ChevronRight, Plus, Undo2, Redo2 } from 'lucide-react';
import { mockTransactions } from '../utils/mockTransactions';
import { formatCurrency } from '../utils/formatCurrency';
import { getRelativeDateLabel } from '../utils/dateHelpers';
import { TransactionDetailPanel } from '../components/TransactionDetailPanel';
import { BulkActionToolbar } from '../components/BulkActionToolbar';
import { FilterChips } from '../components/FilterChips';
import { StatusBadge } from '../components/StatusBadge';
import { AddTransactionModal } from '../components/AddTransactionModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useUndoStack } from '../hooks/useUndoStack';
import type { Transaction } from '../types';
import type { TransactionStatus } from '../components/StatusBadge';

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
  // Undo/Redo stack for transactions
  const {
    state: transactions,
    performAction,
    undo,
    redo,
    canUndo,
    canRedo,
    lastAction,
  } = useUndoStack<Transaction[]>(mockTransactions);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Multi-select state
  const [selectedTransactionIds, setSelectedTransactionIds] = useState<Set<string>>(new Set());

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [amountRange, setAmountRange] = useState<{ min: string; max: string }>({ min: '', max: '' });

  // Get unique categories and accounts
  const categories = useMemo(() =>
    Array.from(new Set(transactions.map(t => t.category))).sort(),
    [transactions]
  );

  const accounts = useMemo(() =>
    Array.from(new Set(transactions.map(t => t.account))).sort(),
    [transactions]
  );

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
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

  // Generate filter chips
  const filterChips = useMemo(() => {
    const chips: Array<{ id: string; label: string; type: 'category' | 'account' | 'amount'; value: string }> = [];

    selectedCategories.forEach(cat => {
      chips.push({
        id: `category-${cat}`,
        label: cat,
        type: 'category',
        value: cat,
      });
    });

    selectedAccounts.forEach(acc => {
      chips.push({
        id: `account-${acc}`,
        label: acc,
        type: 'account',
        value: acc,
      });
    });

    if (amountRange.min || amountRange.max) {
      const label = amountRange.min && amountRange.max
        ? `$${amountRange.min} - $${amountRange.max}`
        : amountRange.min
        ? `≥ $${amountRange.min}`
        : `≤ $${amountRange.max}`;
      chips.push({
        id: 'amount-range',
        label,
        type: 'amount',
        value: 'range',
      });
    }

    return chips;
  }, [selectedCategories, selectedAccounts, amountRange]);

  const removeFilterChip = (chipId: string) => {
    if (chipId.startsWith('category-')) {
      const category = chipId.replace('category-', '');
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else if (chipId.startsWith('account-')) {
      const account = chipId.replace('account-', '');
      setSelectedAccounts(selectedAccounts.filter(a => a !== account));
    } else if (chipId === 'amount-range') {
      setAmountRange({ min: '', max: '' });
    }
  };

  // Multi-select handlers
  const toggleTransactionSelection = (transactionId: string) => {
    const newSelected = new Set(selectedTransactionIds);
    if (newSelected.has(transactionId)) {
      newSelected.delete(transactionId);
    } else {
      newSelected.add(transactionId);
    }
    setSelectedTransactionIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedTransactionIds.size === sortedTransactions.length) {
      setSelectedTransactionIds(new Set());
    } else {
      setSelectedTransactionIds(new Set(sortedTransactions.map(t => t.id)));
    }
  };

  const clearSelection = () => {
    setSelectedTransactionIds(new Set());
  };

  // Bulk action handlers
  const handleBulkCategorize = () => {
    // TODO: Implement bulk categorize modal
    console.log('Bulk categorize:', Array.from(selectedTransactionIds));
    alert(`Categorizing ${selectedTransactionIds.size} transactions (feature coming soon)`);
  };

  const handleBulkDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmBulkDelete = () => {
    performAction(
      'delete',
      transactions.filter(t => !selectedTransactionIds.has(t.id)),
      `Deleted ${selectedTransactionIds.size} transaction${selectedTransactionIds.size !== 1 ? 's' : ''}`
    );
    setSelectedTransactionIds(new Set());
    setShowDeleteConfirm(false);
  };

  const handleBulkMarkReviewed = () => {
    // TODO: Implement mark as reviewed functionality
    console.log('Mark as reviewed:', Array.from(selectedTransactionIds));
    alert(`Marked ${selectedTransactionIds.size} transactions as reviewed (feature coming soon)`);
    setSelectedTransactionIds(new Set());
  };

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const transactionWithId: Transaction = {
      ...newTransaction,
      id,
    };
    performAction(
      'add',
      [transactionWithId, ...transactions],
      `Added transaction: ${newTransaction.merchant}`
    );
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    const oldTransaction = transactions.find(t => t.id === updatedTransaction.id);
    performAction(
      'update',
      transactions.map(t =>
        t.id === updatedTransaction.id ? updatedTransaction : t
      ),
      `Updated transaction: ${oldTransaction?.merchant || 'Unknown'}`
    );
  };

  const selectedTransactionData = transactions.find(t => t.id === selectedTransaction);

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">All transactions</h1>
              <p className="text-gray-400">{filteredTransactions.length} transactions</p>
            </div>
            {filteredTransactions.length > 0 && (
              <div className="flex items-center gap-4">
                {/* Undo/Redo Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={undo}
                    disabled={!canUndo}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    title={canUndo && lastAction ? `Undo: ${lastAction.description}` : 'Nothing to undo (Cmd+Z)'}
                  >
                    <Undo2 className="w-4 h-4" />
                    <span>Undo</span>
                  </button>
                  <button
                    onClick={redo}
                    disabled={!canRedo}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-sm"
                    title="Redo (Cmd+Shift+Z)"
                  >
                    <Redo2 className="w-4 h-4" />
                    <span>Redo</span>
                  </button>
                </div>

                <div className="w-px h-6 bg-gray-700"></div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedTransactionIds.size === sortedTransactions.length && sortedTransactions.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-700 bg-[#0a0e1a] text-blue-600 focus:ring-blue-500 cursor-pointer w-5 h-5"
                  />
                  <span className="text-sm text-gray-400">Select all</span>
                </div>
              </div>
            )}
          </div>
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
              className="flex items-center gap-2 px-4 py-2 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Transaction</span>
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

        {/* Filter Chips */}
        {filterChips.length > 0 && (
          <div className="mb-6">
            <FilterChips
              chips={filterChips}
              onRemove={removeFilterChip}
              onClearAll={clearFilters}
            />
          </div>
        )}

        {/* Transactions List */}
        <div className="space-y-6">
          {Object.entries(groupedTransactions).map(([date, transactions]) => {
            // Calculate totals for this date group
            const total = transactions.reduce((sum, t) => sum + t.amount, 0);
            const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
            const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);

            return (
              <div key={date}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={transactions.every(t => selectedTransactionIds.has(t.id))}
                      onChange={() => {
                        const allSelected = transactions.every(t => selectedTransactionIds.has(t.id));
                        const newSelected = new Set(selectedTransactionIds);
                        transactions.forEach(t => {
                          if (allSelected) {
                            newSelected.delete(t.id);
                          } else {
                            newSelected.add(t.id);
                          }
                        });
                        setSelectedTransactionIds(newSelected);
                      }}
                      className="rounded border-gray-700 bg-[#0a0e1a] text-blue-600 focus:ring-blue-500 cursor-pointer w-5 h-5"
                    />
                    <div className="text-sm text-gray-500 font-semibold uppercase">
                      {getRelativeDateLabel(date)}
                    </div>
                  </div>

                  {/* Date group totals */}
                  <div className="flex items-center gap-4 text-sm">
                    {income > 0 && (
                      <span className="text-green-400 font-medium">
                        +{formatCurrency(income)}
                      </span>
                    )}
                    {expenses < 0 && (
                      <span className="text-red-400 font-medium">
                        {formatCurrency(expenses)}
                      </span>
                    )}
                    {(income > 0 || expenses < 0) && (
                      <span className="text-gray-600">|</span>
                    )}
                    <span className={`font-semibold ${total >= 0 ? 'text-green-400' : 'text-white'}`}>
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              <div className="bg-[#141824] rounded-xl border border-gray-800 overflow-hidden">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className={`flex items-center justify-between p-4 hover:bg-[#1a1f2e] transition-colors ${
                      index !== transactions.length - 1 ? 'border-b border-gray-800' : ''
                    } ${selectedTransaction === transaction.id ? 'bg-[#1a1f2e]' : ''} ${
                      selectedTransactionIds.has(transaction.id) ? 'bg-blue-500/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedTransactionIds.has(transaction.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleTransactionSelection(transaction.id);
                        }}
                        className="rounded border-gray-700 bg-[#0a0e1a] text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0 w-5 h-5"
                      />
                      <div
                        className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 cursor-pointer"
                        onClick={() => setSelectedTransaction(transaction.id)}
                      ></div>
                      <div className="flex-1 cursor-pointer" onClick={() => setSelectedTransaction(transaction.id)}>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{transaction.merchant}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              categoryColors[transaction.category] || 'bg-gray-500'
                            } text-white`}
                          >
                            {transaction.category}
                          </span>
                          <StatusBadge status={transaction.status as TransactionStatus} />
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {transaction.account}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setSelectedTransaction(transaction.id)}>
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
            );
          })}
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
          allTransactions={transactions}
          categories={categories}
          accounts={accounts}
          onClose={() => setSelectedTransaction(null)}
          onUpdate={handleUpdateTransaction}
          onRecurring={(transactionId) => {
            console.log('Mark as recurring:', transactionId);
            // TODO: Implement recurring transaction functionality
          }}
          onMarkReviewed={(transactionId) => {
            const transaction = transactions.find(t => t.id === transactionId);
            if (transaction) {
              handleUpdateTransaction({ ...transaction, status: 'cleared' });
            }
          }}
          onSplitTransaction={(transactionId) => {
            console.log('Split transaction:', transactionId);
            // TODO: Implement split transaction functionality (Phase 3)
          }}
        />
      )}

      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedTransactionIds.size}
        onCategorize={handleBulkCategorize}
        onDelete={handleBulkDelete}
        onMarkReviewed={handleBulkMarkReviewed}
        onClearSelection={clearSelection}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddTransaction}
        categories={categories}
        accounts={accounts}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Transactions"
        message={`Are you sure you want to delete ${selectedTransactionIds.size} transaction${selectedTransactionIds.size !== 1 ? 's' : ''}? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        onConfirm={confirmBulkDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        details={
          <div className="text-sm text-gray-400">
            <p className="font-medium text-gray-300 mb-2">Selected transactions:</p>
            <p>{selectedTransactionIds.size} transaction{selectedTransactionIds.size !== 1 ? 's' : ''} will be permanently deleted</p>
          </div>
        }
      />
    </div>
  );
}
