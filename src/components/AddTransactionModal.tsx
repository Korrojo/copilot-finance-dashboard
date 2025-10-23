import { useState } from 'react';
import { X, Calendar, DollarSign, Tag, Building2, CreditCard } from 'lucide-react';
import type { Transaction } from '../types';
import type { TransactionStatus } from './StatusBadge';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (transaction: Omit<Transaction, 'id'>) => void;
  categories: string[];
  accounts: string[];
}

export function AddTransactionModal({
  isOpen,
  onClose,
  onAdd,
  categories,
  accounts,
}: AddTransactionModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    amount: '',
    category: '',
    account: '',
    status: 'pending' as TransactionStatus,
    type: 'debit' as 'debit' | 'credit',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.merchant.trim()) {
      newErrors.merchant = 'Merchant name is required';
    }

    if (!formData.amount || parseFloat(formData.amount) === 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (isNaN(parseFloat(formData.amount))) {
      newErrors.amount = 'Amount must be a valid number';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.account) {
      newErrors.account = 'Account is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const amount = parseFloat(formData.amount);
    const finalAmount = formData.type === 'debit' ? -Math.abs(amount) : Math.abs(amount);

    const newTransaction: Omit<Transaction, 'id'> = {
      date: formData.date,
      merchant: formData.merchant.trim(),
      amount: finalAmount,
      category: formData.category,
      account: formData.account,
      status: formData.status,
      type: formData.type,
    };

    onAdd(newTransaction);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      amount: '',
      category: '',
      account: '',
      status: 'pending',
      type: 'debit',
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141824] rounded-xl border border-gray-800 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-[#141824] border-b border-gray-800 p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Add Transaction</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date
              </div>
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            {errors.date && (
              <p className="text-red-400 text-xs mt-1">{errors.date}</p>
            )}
          </div>

          {/* Merchant */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Merchant
              </div>
            </label>
            <input
              type="text"
              value={formData.merchant}
              onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
              placeholder="Enter merchant name"
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
            {errors.merchant && (
              <p className="text-red-400 text-xs mt-1">{errors.merchant}</p>
            )}
          </div>

          {/* Type & Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'debit' | 'credit' })}
                className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="debit">Expense</option>
                <option value="credit">Income</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Amount
                </div>
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
              {errors.amount && (
                <p className="text-red-400 text-xs mt-1">{errors.amount}</p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Category
              </div>
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-400 text-xs mt-1">{errors.category}</p>
            )}
          </div>

          {/* Account */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Account
              </div>
            </label>
            <select
              value={formData.account}
              onChange={(e) => setFormData({ ...formData, account: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">Select account</option>
              {accounts.map((account) => (
                <option key={account} value={account}>
                  {account}
                </option>
              ))}
            </select>
            {errors.account && (
              <p className="text-red-400 text-xs mt-1">{errors.account}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as TransactionStatus })}
              className="w-full px-4 py-2.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="pending">Pending</option>
              <option value="posted">Posted</option>
              <option value="cleared">Cleared</option>
              <option value="to_review">To Review</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
