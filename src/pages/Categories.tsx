import { useState, useMemo } from 'react';
import { AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import { useBudgets } from '../hooks/useBudgets';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { EditBudgetsModal } from '../components/EditBudgetsModal';

export function Categories() {
  const { data } = useFinancialData();
  const { budgets, budgetStatuses, totalBudget, totalSpent, addBudget, removeBudget } = useBudgets();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalCategorySpent = Math.abs(data.category_spending.reduce((sum, cat) => sum + cat.amount, 0));

  // Merge category spending with budget data
  const categoriesWithBudgets = useMemo(() => {
    const budgetMap = new Map(budgetStatuses.map((b) => [b.category, b]));

    return data.category_spending.map((cat) => {
      const budgetStatus = budgetMap.get(cat.category);
      const spent = Math.abs(cat.amount);

      return {
        category: cat.category,
        spent,
        budget: budgetStatus?.budget || 0,
        remaining: budgetStatus?.remaining || 0,
        percentage: budgetStatus?.percentage || 0,
        status: budgetStatus?.status || 'under' as const,
        hasBudget: !!budgetStatus,
      };
    }).sort((a, b) => b.spent - a.spent);
  }, [data.category_spending, budgetStatuses]);

  // Count categories by status
  const statusCounts = useMemo(() => {
    const counts = {
      over: 0,
      warning: 0,
      under: 0,
    };
    categoriesWithBudgets.forEach((cat) => {
      if (cat.hasBudget) {
        counts[cat.status]++;
      }
    });
    return counts;
  }, [categoriesWithBudgets]);

  const handleSaveBudgets = (newBudgets: Array<{ category: string; amount: number }>) => {
    // Remove all existing budgets
    budgets.forEach((b) => removeBudget(b.category));

    // Add new budgets
    newBudgets.forEach((b) => {
      addBudget(b.category, b.amount);
    });
  };

  const getStatusColor = (status: 'under' | 'warning' | 'over') => {
    switch (status) {
      case 'over':
        return 'text-red-400 bg-red-500/20 border-red-500';
      case 'warning':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500';
      default:
        return 'text-green-400 bg-green-500/20 border-green-500';
    }
  };

  const getBarColor = (status: 'under' | 'warning' | 'over', percentage: number) => {
    if (!percentage) return 'bg-gray-600';
    if (status === 'over') return 'bg-red-500';
    if (status === 'warning') return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
          <p className="text-gray-400">Budget tracking by category</p>
        </div>
        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Edit Budgets
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Budgeted</p>
          <h2 className="text-3xl font-bold text-white mb-2">
            {formatCurrency(totalBudget)}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400">Across {budgets.length} categories</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Spent</p>
          <h2 className="text-3xl font-bold text-white mb-2">
            {formatCurrency(totalSpent)}
          </h2>
          <div className="flex items-center gap-2 text-sm">
            {totalSpent > totalBudget ? (
              <>
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-red-400">
                  {formatCompactCurrency(totalSpent - totalBudget)} over budget
                </span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-green-400">
                  {formatCompactCurrency(totalBudget - totalSpent)} under budget
                </span>
              </>
            )}
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Budget Health</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-gray-300">{statusCounts.under}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="text-sm text-gray-300">{statusCounts.warning}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-gray-300">{statusCounts.over}</span>
            </div>
          </div>
          {statusCounts.over > 0 && (
            <div className="flex items-center gap-2 text-sm text-red-400 mt-3">
              <AlertCircle className="w-4 h-4" />
              <span>{statusCounts.over} over budget</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category List - Takes 2 columns */}
        <div className="lg:col-span-2">
          <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-6">All Categories</h3>
            <div className="space-y-4">
              {categoriesWithBudgets.map((category, index) => {
                const colors = [
                  'bg-red-500',
                  'bg-blue-500',
                  'bg-yellow-500',
                  'bg-green-500',
                  'bg-purple-500',
                  'bg-pink-500',
                  'bg-orange-500',
                  'bg-teal-500',
                  'bg-indigo-500',
                  'bg-cyan-500',
                ];

                return (
                  <div
                    key={category.category}
                    className="p-4 hover:bg-[#1a1f2e] rounded-lg transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-1 h-10 ${colors[index % colors.length]} rounded-full`} />
                        <span className="text-white font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-white font-semibold">
                            {formatCompactCurrency(category.spent)}
                          </div>
                          {category.hasBudget && (
                            <div className="text-xs text-gray-500">
                              of {formatCompactCurrency(category.budget)}
                            </div>
                          )}
                        </div>
                        {category.hasBudget && (
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              category.status
                            )}`}
                          >
                            {category.percentage.toFixed(0)}%
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {category.hasBudget ? (
                      <div className="relative w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getBarColor(category.status, category.percentage)} transition-all duration-300`}
                          style={{ width: `${Math.min(category.percentage, 100)}%` }}
                        />
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500 italic">No budget set</div>
                    )}

                    {category.hasBudget && (
                      <div className="flex items-center justify-between mt-2 text-xs">
                        <span className="text-gray-500">
                          {category.remaining > 0
                            ? `${formatCompactCurrency(category.remaining)} remaining`
                            : `${formatCompactCurrency(Math.abs(category.remaining))} over`}
                        </span>
                        {category.status === 'warning' && (
                          <span className="text-yellow-400">Approaching limit</span>
                        )}
                        {category.status === 'over' && (
                          <span className="text-red-400">Over budget!</span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Pie Chart - Takes 1 column */}
        <div className="space-y-6">
          <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Spending Breakdown</h3>
            <CategoryPieChart data={data.category_spending} limit={8} />
          </div>

          {/* Key Metrics */}
          <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Key Metrics</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Categories</span>
                <span className="text-sm font-semibold text-white">
                  {data.category_spending.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">With Budgets</span>
                <span className="text-sm font-semibold text-white">{budgets.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Spending</span>
                <span className="text-sm font-semibold text-white">
                  {formatCompactCurrency(totalCategorySpent)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Avg per Category</span>
                <span className="text-sm font-semibold text-white">
                  {formatCompactCurrency(totalCategorySpent / data.category_spending.length)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Budgets Modal */}
      <EditBudgetsModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveBudgets}
        currentBudgets={budgets.map((b) => ({ category: b.category, amount: b.amount }))}
      />
    </div>
  );
}
