import { useState } from 'react';
import { Edit2, Trash2, Home, Plane, GraduationCap, PiggyBank, Car } from 'lucide-react';
import type { Goal } from '../types/goal';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { GoalProgressChart } from '../components/GoalProgressChart';
import { MonthlyContributionTracker } from '../components/MonthlyContributionTracker';

interface GoalDetailPanelProps {
  goal: Goal;
  onDelete: (goalId: string) => void;
}

const iconMap = {
  home: Home,
  plane: Plane,
  graduation: GraduationCap,
  piggybank: PiggyBank,
  car: Car,
};

export function GoalDetailPanel({ goal, onDelete }: GoalDetailPanelProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const Icon = iconMap[goal.icon];
  const remaining = goal.target - goal.current;

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Icon className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{goal.name}</h2>
            <p className="text-sm text-gray-400">{goal.category}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            title="Edit goal"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Delete goal"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-3xl font-bold text-white">
            {formatCurrency(goal.current, false)}
          </span>
          <span className="text-gray-500">of</span>
          <span className="text-xl text-gray-400">
            {formatCurrency(goal.target, false)}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                goal.percentage >= 100
                  ? 'bg-gradient-to-r from-green-500 to-green-400'
                  : 'bg-gradient-to-r from-blue-500 to-blue-400'
              }`}
              style={{ width: `${Math.min(goal.percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            {formatCompactCurrency(remaining)} remaining
          </span>
          <span className="font-semibold text-white">
            {Math.round(goal.percentage)}% complete
          </span>
        </div>
      </div>

      {/* Savings Insight */}
      <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p className="text-sm text-blue-400">
          💡 Save <span className="font-semibold">{formatCurrency(goal.requiredMonthlyAmount, false)}</span> per month to reach your goal by {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Progress Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Progress Projection</h3>
        <GoalProgressChart goal={goal} />
      </div>

      {/* Monthly Contributions */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Contributions</h3>
        <MonthlyContributionTracker
          contributions={goal.monthlyContributions}
          targetAmount={goal.requiredMonthlyAmount}
        />
      </div>

      {/* Goal Summary */}
      <div className="mb-6 p-4 bg-[#0a0e1a] rounded-lg border border-gray-800">
        <h3 className="text-sm font-semibold text-white mb-3">Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Target amount</span>
            <span className="text-white font-medium">{formatCurrency(goal.target, false)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Start date</span>
            <span className="text-white">
              {new Date(goal.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Target date</span>
            <span className="text-white">
              {new Date(goal.targetDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Saving mode</span>
            <span className="text-white capitalize">{goal.savingMode.replace('-', ' ')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Priority</span>
            <span className={`capitalize ${
              goal.priority === 'high' ? 'text-red-400' :
              goal.priority === 'medium' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {goal.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Linked Accounts */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Linked Accounts</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300">
            EDIT
          </button>
        </div>
        <div className="space-y-2">
          {goal.linkedAccounts.map((account, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-[#0a0e1a] rounded-lg border border-gray-800"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span className="text-xs text-blue-400">💰</span>
                </div>
                <span className="text-sm text-white">{account}</span>
              </div>
            </div>
          ))}
          {goal.linkedAccounts.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No accounts linked yet
            </p>
          )}
        </div>
      </div>

      {/* Recent Contributions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-white">Recent Contributions</h3>
          <button className="text-xs text-blue-400 hover:text-blue-300">
            ADD
          </button>
        </div>
        <div className="space-y-2">
          {goal.transactions.slice(0, 5).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-3 bg-[#0a0e1a] rounded-lg border border-gray-800"
            >
              <div>
                <p className="text-sm text-white">{transaction.accountName}</p>
                <p className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <span className="text-sm font-semibold text-green-400">
                +{formatCurrency(transaction.amount, false)}
              </span>
            </div>
          ))}
          {goal.transactions.length === 0 && (
            <p className="text-sm text-gray-500 text-center py-4">
              No contributions yet
            </p>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1a1f2e] rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-2">Delete Goal?</h3>
            <p className="text-sm text-gray-400 mb-6">
              Are you sure you want to delete "{goal.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(goal.id);
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
