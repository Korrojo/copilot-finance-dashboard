import { formatCurrency } from '../utils/formatCurrency';

interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  budget?: number;
  color: string;
}

interface SpendingBreakdownProps {
  categories: SpendingCategory[];
  totalSpending: number;
}

export function SpendingBreakdown({ categories, totalSpending }: SpendingBreakdownProps) {
  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Spending Breakdown</h3>
        <span className="text-sm text-gray-400">{formatCurrency(totalSpending)} total</span>
      </div>

      <div className="space-y-4">
        {categories.map((cat) => {
          const overBudget = cat.budget && cat.amount > cat.budget;
          const budgetPercentage = cat.budget ? (cat.amount / cat.budget) * 100 : 0;

          return (
            <div key={cat.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-1 h-10 rounded-full ${cat.color}`} />
                  <div>
                    <p className="text-white font-medium">{cat.category}</p>
                    <p className="text-xs text-gray-500">
                      {cat.percentage.toFixed(1)}% of spending
                      {cat.budget && (
                        <span className={overBudget ? 'text-red-400 ml-2' : 'text-green-400 ml-2'}>
                          • {budgetPercentage.toFixed(0)}% of budget
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{formatCurrency(cat.amount)}</p>
                  {cat.budget && (
                    <p className="text-xs text-gray-500">of {formatCurrency(cat.budget, false)}</p>
                  )}
                </div>
              </div>
              <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} transition-all`}
                  style={{ width: `${cat.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
