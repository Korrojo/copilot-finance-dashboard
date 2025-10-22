import { useState, useEffect } from 'react';
import { X, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

interface CategoryBudget {
  category: string;
  currentBudget: number;
  currentSpending: number;
  suggestedBudget: number;
  averageSpending: number;
}

interface RebalanceBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budgets: Array<{ category: string; amount: number }>) => void;
  categories: CategoryBudget[];
  totalBudget: number;
}

export function RebalanceBudgetModal({
  isOpen,
  onClose,
  onSave,
  categories,
  totalBudget,
}: RebalanceBudgetModalProps) {
  const [adjustedBudgets, setAdjustedBudgets] = useState<Record<string, number>>({});
  const [useAverages, setUseAverages] = useState(true);

  useEffect(() => {
    if (isOpen) {
      // Initialize with suggested budgets
      const initial: Record<string, number> = {};
      categories.forEach((cat) => {
        initial[cat.category] = useAverages ? cat.averageSpending : cat.currentSpending;
      });
      setAdjustedBudgets(initial);
    }
  }, [isOpen, categories, useAverages]);

  if (!isOpen) return null;

  const totalAdjusted = Object.values(adjustedBudgets).reduce((sum, amount) => sum + amount, 0);
  const difference = totalAdjusted - totalBudget;

  const handleSave = () => {
    const budgets = Object.entries(adjustedBudgets).map(([category, amount]) => ({
      category,
      amount,
    }));
    onSave(budgets);
    onClose();
  };

  const handleAutoBalance = () => {
    // Distribute total budget proportionally based on average spending
    const totalAvg = categories.reduce((sum, cat) => sum + cat.averageSpending, 0);
    const balanced: Record<string, number> = {};

    categories.forEach((cat) => {
      const proportion = cat.averageSpending / totalAvg;
      balanced[cat.category] = Math.round(totalBudget * proportion);
    });

    setAdjustedBudgets(balanced);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#0f1218] rounded-xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-[#0f1218] border-b border-gray-700 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Rebalance Budget</h2>
            <p className="text-sm text-gray-400">
              Adjust your category budgets based on spending patterns
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Options */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={useAverages}
                onChange={(e) => setUseAverages(e.target.checked)}
                className="rounded border-gray-700 bg-[#141824] text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-white">Use 3-month average spending</span>
            </label>
            <button
              onClick={handleAutoBalance}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              Auto-Balance
            </button>
          </div>

          {/* Total Summary */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-[#141824] rounded-lg">
            <div>
              <p className="text-xs text-gray-500 mb-1">Current Total</p>
              <p className="text-sm font-semibold text-white">
                {formatCurrency(totalBudget)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">New Total</p>
              <p className="text-sm font-semibold text-white">
                {formatCurrency(totalAdjusted)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Difference</p>
              <p className={`text-sm font-semibold ${
                difference > 0 ? 'text-red-400' : difference < 0 ? 'text-green-400' : 'text-white'
              }`}>
                {difference > 0 ? '+' : ''}{formatCurrency(difference, false)}
              </p>
            </div>
          </div>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {categories.map((category) => {
              const currentBudget = adjustedBudgets[category.category] || 0;
              const change = currentBudget - category.currentBudget;
              const percentChange = category.currentBudget > 0
                ? ((change / category.currentBudget) * 100)
                : 0;

              return (
                <div
                  key={category.category}
                  className="bg-[#141824] rounded-lg p-4 border border-gray-800"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-white font-medium mb-1">{category.category}</h4>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Avg: {formatCompactCurrency(category.averageSpending)}/mo</span>
                        <span>Current: {formatCompactCurrency(category.currentSpending)}</span>
                      </div>
                    </div>
                    {Math.abs(percentChange) > 5 && (
                      <div className={`flex items-center gap-1 text-xs ${
                        percentChange > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        <TrendingUp className={`w-3 h-3 ${
                          percentChange < 0 ? 'rotate-180' : ''
                        }`} />
                        <span>{Math.abs(percentChange).toFixed(0)}%</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={category.averageSpending * 2}
                        step="50"
                        value={currentBudget}
                        onChange={(e) => {
                          setAdjustedBudgets({
                            ...adjustedBudgets,
                            [category.category]: parseFloat(e.target.value),
                          });
                        }}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                    <input
                      type="number"
                      value={currentBudget}
                      onChange={(e) => {
                        setAdjustedBudgets({
                          ...adjustedBudgets,
                          [category.category]: parseFloat(e.target.value) || 0,
                        });
                      }}
                      className="w-28 px-3 py-2 bg-[#0a0e1a] text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
                    />
                  </div>

                  {currentBudget < category.averageSpending && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-yellow-400">
                      <AlertCircle className="w-3 h-3" />
                      <span>Below average spending</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#0f1218] border-t border-gray-700 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={Math.abs(difference) > 100}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Changes
          </button>
        </div>
      </div>

      <style>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
