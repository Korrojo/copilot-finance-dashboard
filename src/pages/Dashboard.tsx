import { useState } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { MonthlySpendingChart } from '../components/charts/MonthlySpendingChart';
import { Sparkline } from '../components/charts/Sparkline';
import { TimeRangeSelector } from '../components/TimeRangeSelector';

export function Dashboard() {
  const [timeRange, setTimeRange] = useState('1M');

  const {
    data,
    totalSpent,
    avgTransaction,
    topMerchant,
    primaryAccount,
    latestMonthSpending,
    topCategories,
  } = useFinancialData();

  // Mock sparkline data (in real app, this would come from API based on timeRange)
  const totalSpentSparkline = [45000, 48000, 46000, 50000, 52000, 49000, totalSpent];
  const avgTransactionSparkline = [150, 155, 148, 160, 158, 155, avgTransaction];

  // Calculate budget-related values (using latest month spending as reference)
  const budgetAmount = 8000; // TODO: Make this configurable
  const budgetUsed = latestMonthSpending;
  const budgetLeft = budgetAmount - budgetUsed;
  const budgetPercentage = Math.min((budgetUsed / budgetAmount) * 100, 100);

  // Comparative metrics
  const totalSpentChange = 5.2; // +5.2% vs last period
  const avgTransactionChange = -2.1; // -2.1% vs last period

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Your financial overview</p>
        </div>
        <TimeRangeSelector selectedRange={timeRange} onRangeChange={setTimeRange} />
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
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-1">Total Spent</p>
              <h2 className="text-3xl font-bold text-white">
                {formatCurrency(totalSpent)}
              </h2>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm">
              {totalSpentChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-400" />
              )}
              <span className={totalSpentChange > 0 ? 'text-red-400' : 'text-green-400'}>
                {Math.abs(totalSpentChange)}%
              </span>
              <span className="text-gray-500">vs last period</span>
            </div>
          </div>
          <Sparkline
            data={totalSpentSparkline}
            width={200}
            height={40}
            color={totalSpentChange > 0 ? '#f87171' : '#34d399'}
            fillColor={totalSpentChange > 0 ? 'rgba(248, 113, 113, 0.1)' : 'rgba(52, 211, 153, 0.1)'}
          />
        </div>

        {/* Average Transaction Card */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <p className="text-gray-400 text-sm mb-1">Avg Transaction</p>
              <h2 className="text-3xl font-bold text-white">
                {formatCurrency(avgTransaction)}
              </h2>
            </div>
            <button className="text-gray-400 hover:text-white">
              <ArrowUpRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm">
              {avgTransactionChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-400" />
              )}
              <span className={avgTransactionChange > 0 ? 'text-red-400' : 'text-green-400'}>
                {Math.abs(avgTransactionChange)}%
              </span>
              <span className="text-gray-500">vs last period</span>
            </div>
          </div>
          <Sparkline
            data={avgTransactionSparkline}
            width={200}
            height={40}
            color={avgTransactionChange > 0 ? '#f87171' : '#34d399'}
            fillColor={avgTransactionChange > 0 ? 'rgba(248, 113, 113, 0.1)' : 'rgba(52, 211, 153, 0.1)'}
          />
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
          <div className="space-y-4">
            {topCategories.map((category, index) => {
              const colors = [
                { bg: 'bg-red-500', border: 'border-red-500' },
                { bg: 'bg-blue-500', border: 'border-blue-500' },
                { bg: 'bg-yellow-500', border: 'border-yellow-500' },
                { bg: 'bg-green-500', border: 'border-green-500' },
                { bg: 'bg-purple-500', border: 'border-purple-500' },
              ];
              // Mock budget for visualization (in real app, this comes from data)
              const mockBudget = category.amount * 1.2;
              const percentage = Math.min((Math.abs(category.amount) / mockBudget) * 100, 100);

              return (
                <div key={category.category}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white font-medium">{category.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">
                        {formatCompactCurrency(Math.abs(category.amount))}
                      </span>
                      <span className="text-xs text-gray-500">
                        of {formatCompactCurrency(mockBudget)}
                      </span>
                    </div>
                  </div>
                  {/* Visual progress bar */}
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[index].bg} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
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
