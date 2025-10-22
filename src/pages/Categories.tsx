import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';

export function Categories() {
  const { data } = useFinancialData();

  const totalSpent = data.category_spending.reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
        <p className="text-gray-400">Budget tracking by category</p>
      </div>

      {/* Summary */}
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-400 text-sm mb-1">Total Spending</p>
            <h2 className="text-4xl font-bold text-white">
              {formatCurrency(totalSpent)}
            </h2>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Edit Budgets
          </button>
        </div>
      </div>

      {/* Chart and List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Spending Breakdown</h3>
          <CategoryPieChart data={data.category_spending} limit={8} />
        </div>

        {/* Category List */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">All Categories</h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {data.category_spending.map((category, index) => {
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
                'bg-lime-500',
              ];
              const percentage = (category.amount / totalSpent) * 100;

              return (
                <div
                  key={category.category}
                  className="flex items-center gap-4 p-3 hover:bg-[#1a1f2e] rounded-lg transition-colors cursor-pointer"
                >
                  <div className={`w-1 h-12 ${colors[index % colors.length]} rounded-full`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white font-medium">{category.category}</span>
                      <span className="text-white font-semibold">
                        {formatCompactCurrency(category.amount)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colors[index % colors.length]}`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
                      <span>{percentage.toFixed(1)}% of total</span>
                      {category.budget && (
                        <span>Budget: {formatCurrency(category.budget, false)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
