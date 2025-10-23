import { useState, useEffect } from 'react';
import { X, Plus, Trash2, DollarSign } from 'lucide-react';
import type { Transaction, TransactionSplit } from '../types';
import {
  createEmptySplit,
  calculateRemaining,
  validateSplits,
  distributeSplitsEqually,
  autoFillRemaining,
} from '../utils/splitHelpers';

interface SplitTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction;
  onClose: () => void;
  onSave: (splits: TransactionSplit[]) => void;
}

const CATEGORIES = [
  'Shopping',
  'Groceries',
  'Restaurants',
  'Auto Misc',
  'Utility',
  'Transportation',
  'Healthcare',
  'Entertainment',
  'Travel',
  'Bills',
  'Other',
];

export function SplitTransactionModal({
  isOpen,
  transaction,
  onClose,
  onSave,
}: SplitTransactionModalProps) {
  const [splits, setSplits] = useState<TransactionSplit[]>([]);
  const [error, setError] = useState<string>('');

  const originalAmount = Math.abs(transaction.amount);
  const remaining = calculateRemaining(transaction.amount, splits);

  // Initialize with existing splits or create two empty ones
  useEffect(() => {
    if (isOpen) {
      if (transaction.splitTransactions && transaction.splitTransactions.length > 0) {
        setSplits(transaction.splitTransactions);
      } else {
        setSplits([createEmptySplit(), createEmptySplit()]);
      }
      setError('');
    }
  }, [isOpen, transaction]);

  const addSplit = () => {
    setSplits([...splits, createEmptySplit()]);
    setError('');
  };

  const removeSplit = (id: string) => {
    if (splits.length <= 2) {
      setError('Must have at least 2 splits');
      return;
    }
    setSplits(splits.filter(s => s.id !== id));
    setError('');
  };

  const updateSplit = (id: string, field: keyof TransactionSplit, value: string | number) => {
    setSplits(
      splits.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
    setError('');
  };

  const handleEqualSplit = () => {
    const equalSplits = distributeSplitsEqually(transaction.amount, splits.length);
    setSplits(
      splits.map((split, index) => ({
        ...split,
        amount: equalSplits[index].amount,
      }))
    );
    setError('');
  };

  const handleAutoFill = () => {
    const updated = autoFillRemaining(transaction.amount, splits);
    setSplits(updated);
    setError('');
  };

  const handleSave = () => {
    const validation = validateSplits(transaction.amount, splits);
    if (!validation.isValid) {
      setError(validation.error || 'Invalid splits');
      return;
    }

    onSave(splits);
    onClose();
  };

  const handleClose = () => {
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#141824] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Split Transaction</h2>
              <p className="text-sm text-gray-400">
                {transaction.merchant} • ${originalAmount.toFixed(2)}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Original Amount Display */}
          <div className="mb-6 p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Original Amount</p>
                <p className="text-2xl font-bold text-white">${originalAmount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Remaining</p>
                <p
                  className={`text-2xl font-bold ${
                    Math.abs(remaining) < 0.01
                      ? 'text-green-400'
                      : remaining > 0
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  ${remaining.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleEqualSplit}
                className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
              >
                Split Equally
              </button>
              <button
                onClick={handleAutoFill}
                className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm hover:bg-blue-600/30 transition-colors"
              >
                Auto-Fill Remaining
              </button>
            </div>
          </div>

          {/* Splits List */}
          <div className="space-y-3">
            {splits.map((split, index) => (
              <div
                key={split.id}
                className="p-4 bg-[#0a0e1a] border border-gray-700 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1 space-y-3">
                    {/* Split Number & Category */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-400">
                          {index + 1}
                        </span>
                      </div>
                      <select
                        value={split.category}
                        onChange={(e) => updateSplit(split.id, 'category', e.target.value)}
                        className="flex-1 px-3 py-2 bg-[#141824] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select category...</option>
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Amount */}
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          max={originalAmount}
                          value={split.amount || ''}
                          onChange={(e) =>
                            updateSplit(split.id, 'amount', parseFloat(e.target.value) || 0)
                          }
                          placeholder="0.00"
                          className="w-full pl-9 pr-3 py-2 bg-[#141824] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      {splits.length > 2 && (
                        <button
                          onClick={() => removeSplit(split.id)}
                          className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                          aria-label="Remove split"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Notes (Optional) */}
                    <input
                      type="text"
                      value={split.notes || ''}
                      onChange={(e) => updateSplit(split.id, 'notes', e.target.value)}
                      placeholder="Notes (optional)"
                      className="w-full px-3 py-2 bg-[#141824] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Split Button */}
          <button
            onClick={addSplit}
            className="w-full mt-3 px-4 py-3 bg-[#0a0e1a] border border-gray-700 rounded-lg text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">Add Another Split</span>
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2.5 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Save Splits
          </button>
        </div>
      </div>
    </div>
  );
}
