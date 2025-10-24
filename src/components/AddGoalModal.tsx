import { useState } from 'react';
import { X, Home, Plane, GraduationCap, PiggyBank, Car } from 'lucide-react';
import type { GoalFormData } from '../types/goal';

interface AddGoalModalProps {
  onClose: () => void;
  onSave: (goalData: GoalFormData) => void;
}

const icons = [
  { value: 'home' as const, Icon: Home, label: 'Home' },
  { value: 'plane' as const, Icon: Plane, label: 'Travel' },
  { value: 'graduation' as const, Icon: GraduationCap, label: 'Education' },
  { value: 'piggybank' as const, Icon: PiggyBank, label: 'Savings' },
  { value: 'car' as const, Icon: Car, label: 'Vehicle' },
];

export function AddGoalModal({ onClose, onSave }: AddGoalModalProps) {
  const [formData, setFormData] = useState<GoalFormData>({
    name: '',
    icon: 'home',
    category: 'Savings',
    target: 10000,
    targetDate: '',
    savingMode: 'target-date',
    monthlyTarget: undefined,
    priority: 'medium',
    linkedAccounts: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1f2e] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Add New Goal</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Goal Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Goal Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="e.g., Emergency Fund"
              required
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Icon
            </label>
            <div className="grid grid-cols-5 gap-3">
              {icons.map(({ value, Icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon: value })}
                  className={`p-4 rounded-lg border transition-colors ${
                    formData.icon === value
                      ? 'bg-blue-500/20 border-blue-500/50'
                      : 'bg-[#0a0e1a] border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-1 ${
                    formData.icon === value ? 'text-blue-400' : 'text-gray-400'
                  }`} />
                  <span className="text-xs text-gray-400">{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Category
            </label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              placeholder="e.g., Savings, Travel, Housing"
            />
          </div>

          {/* Target Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Target Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({ ...formData, target: Number(e.target.value) })}
                className="w-full pl-8 pr-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                placeholder="10000"
                min="1"
                required
              />
            </div>
          </div>

          {/* Saving Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Saving Mode
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, savingMode: 'target-date' })}
                className={`p-3 rounded-lg border transition-colors ${
                  formData.savingMode === 'target-date'
                    ? 'bg-blue-500/20 border-blue-500/50 text-white'
                    : 'bg-[#0a0e1a] border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium">Target Date</div>
                <div className="text-xs text-gray-500 mt-1">Set a deadline</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, savingMode: 'monthly-amount' })}
                className={`p-3 rounded-lg border transition-colors ${
                  formData.savingMode === 'monthly-amount'
                    ? 'bg-blue-500/20 border-blue-500/50 text-white'
                    : 'bg-[#0a0e1a] border-gray-700 text-gray-400 hover:border-gray-600'
                }`}
              >
                <div className="text-sm font-medium">Monthly Amount</div>
                <div className="text-xs text-gray-500 mt-1">Fixed savings</div>
              </button>
            </div>
          </div>

          {/* Target Date or Monthly Amount */}
          {formData.savingMode === 'target-date' ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full px-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Contribution
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <input
                  type="number"
                  value={formData.monthlyTarget || ''}
                  onChange={(e) => setFormData({ ...formData, monthlyTarget: Number(e.target.value) })}
                  className="w-full pl-8 pr-4 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  placeholder="500"
                  min="1"
                  required
                />
              </div>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['high', 'medium', 'low'] as const).map((priority) => (
                <button
                  key={priority}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority })}
                  className={`p-2 rounded-lg border transition-colors capitalize ${
                    formData.priority === priority
                      ? 'bg-blue-500/20 border-blue-500/50 text-white'
                      : 'bg-[#0a0e1a] border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Add Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
