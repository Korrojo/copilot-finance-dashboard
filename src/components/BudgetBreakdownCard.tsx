import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface BudgetCategory {
  name: 'Fixed' | 'Flexible' | 'Non-Monthly';
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'under' | 'on-track' | 'over';
}

interface BudgetBreakdownCardProps {
  categories: BudgetCategory[];
  month: string;
}

export function BudgetBreakdownCard({ categories, month }: BudgetBreakdownCardProps) {
  const [viewType, setViewType] = useState('Expenses');
  const [showViewMenu, setShowViewMenu] = useState(false);

  const viewTypes = ['Expenses', 'Income', 'All'];

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Budget</h3>
          <p className="text-sm text-gray-500 mt-0.5">{month}</p>
        </div>

        {/* View Type Selector */}
        <div className="relative">
          <button
            onClick={() => setShowViewMenu(!showViewMenu)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0a0e1a] rounded-lg text-sm text-gray-300 hover:bg-[#1a1f2e] transition-colors"
          >
            {viewType}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showViewMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-[#1a1f2e] border border-gray-700 rounded-lg shadow-lg z-10">
              {viewTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setViewType(type);
                    setShowViewMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    type === viewType
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:bg-[#0a0e1a]'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Budget Categories */}
      <div className="space-y-6">
        {categories.map((category) => {
          const isOverBudget = category.status === 'over';
          const barColor = isOverBudget ? 'bg-red-500' : 'bg-green-500';

          return (
            <div key={category.name}>
              {/* Category Name */}
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-white">{category.name}</h4>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-gray-500">budget</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-8 bg-gray-800 rounded-lg overflow-hidden mb-2">
                {/* Spent portion */}
                <div
                  className={`absolute top-0 left-0 h-full ${barColor} transition-all duration-500`}
                  style={{ width: `${Math.min(category.percentage, 100)}%` }}
                />

                {/* Remaining portion (if over budget, show overage) */}
                {isOverBudget && category.percentage > 100 && (
                  <div
                    className="absolute top-0 left-0 h-full bg-red-500/40"
                    style={{ width: `${category.percentage}%` }}
                  />
                )}

                {/* Labels inside bar */}
                <div className="absolute inset-0 flex items-center justify-between px-3">
                  <span className="text-xs font-medium text-white">
                    {formatCompactCurrency(category.spent)} spent
                  </span>
                  <span className={`text-xs font-medium ${
                    isOverBudget ? 'text-red-300' : 'text-gray-400'
                  }`}>
                    {isOverBudget
                      ? `${formatCompactCurrency(Math.abs(category.remaining))} over`
                      : `${formatCompactCurrency(category.remaining)} remaining`
                    }
                  </span>
                </div>
              </div>

              {/* Budget Amount */}
              <div className="flex items-center justify-end">
                <span className="text-xs text-gray-500">
                  {formatCurrency(category.budget, false)} budgeted
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
