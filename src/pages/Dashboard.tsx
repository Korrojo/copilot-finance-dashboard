import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency, formatNumber, formatCompactCurrency } from '../utils/formatCurrency';
import { MonthlySpendingChart } from '../components/charts/MonthlySpendingChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';

export function Dashboard() {
  const {
    data,
    totalSpent,
    totalTransactions,
    avgTransaction,
    topMerchant,
    primaryAccount,
    latestMonthSpending,
    topCategories,
  } = useFinancialData();

  // Calculate budget-related values (using latest month spending as reference)
  const budgetAmount = 8000; // TODO: Make this configurable
  const budgetUsed = latestMonthSpending;
  const budgetLeft = budgetAmount - budgetUsed;
  const budgetPercentage = Math.min((budgetUsed / budgetAmount) * 100, 100);

  // Mock assets and debt (these would come from actual account balances in real app)
  const assets = 1430545;
  const debt = 283756;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Your financial overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Monthly Spending Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Monthly spending</p>
              <h2 className="text-3xl font-bold text-white">
                {formatCompactCurrency(budgetLeft)} left
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                out of {formatCurrency(budgetAmount, false)} budgeted
              </p>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  budgetPercentage > 90
                    ? 'bg-red-500'
                    : budgetPercentage > 75
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
                style={{ width: `${budgetPercentage}%` }}
              />
            </div>
            <span
              className={`text-xs font-medium ${
                budgetLeft > 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              {budgetLeft > 0
                ? `${formatCompactCurrency(budgetLeft)} under`
                : `${formatCompactCurrency(Math.abs(budgetLeft))} over`}
            </span>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Spent</p>
              <h2 className="text-3xl font-bold text-white">
                {formatCurrency(totalSpent)}
              </h2>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">{formatNumber(totalTransactions)} transactions</span>
          </div>
        </div>

        {/* Average Transaction Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Avg Transaction</p>
              <h2 className="text-3xl font-bold text-white">
                {formatCurrency(avgTransaction)}
              </h2>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Per transaction</span>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Top Merchant Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Top Merchant</p>
              <h3 className="text-2xl font-bold text-white">{topMerchant}</h3>
              <p className="text-sm text-gray-500 mt-1">Most frequent</p>
            </div>
          </div>
        </div>

        {/* Primary Account Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Primary Account</p>
              <h3 className="text-2xl font-bold text-white">{primaryAccount}</h3>
              <p className="text-sm text-gray-500 mt-1">Most used</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Monthly Spending Chart */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">
              Monthly spending
            </h3>
            <button className="text-blue-400 text-sm hover:text-blue-300">
              TRANSACTIONS →
            </button>
          </div>
          <MonthlySpendingChart data={data.monthly_spending} />
        </div>

        {/* Top Categories */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Top categories</h3>
            <button className="text-blue-400 text-sm hover:text-blue-300">
              VIEW ALL →
            </button>
          </div>
          <div className="space-y-3">
            {topCategories.map((category, index) => {
              const colors = [
                'bg-red-500',
                'bg-blue-500',
                'bg-yellow-500',
                'bg-green-500',
                'bg-purple-500',
              ];
              return (
                <div key={category.category} className="flex items-center gap-3">
                  <div className={`w-1 h-8 ${colors[index]} rounded-full`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white">{category.category}</span>
                      <span className="text-sm font-semibold text-white">
                        {formatCompactCurrency(category.amount)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                      <span>
                        {category.budget ? `Budget: ${formatCurrency(category.budget, false)}` : 'No budget set'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Transactions to Review */}
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Transactions to review
          </h3>
          <button className="text-blue-400 text-sm hover:text-blue-300">
            VIEW ALL →
          </button>
        </div>
        <div className="text-center py-12 text-gray-500">
          No transactions to review
        </div>
      </div>
    </div>
  );
}
