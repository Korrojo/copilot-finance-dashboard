import { useMemo } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import { useSubscriptions } from '../hooks/useSubscriptions';
import { useAccounts } from '../hooks/useAccounts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { MonthlySpendingChart } from '../components/charts/MonthlySpendingChart';
import { Sparkline } from '../components/charts/Sparkline';
import { UpcomingBills } from '../components/UpcomingBills';
import { TransactionsToReview } from '../components/TransactionsToReview';
import { NextTwoWeeksPreview } from '../components/NextTwoWeeksPreview';
import { NetWorthCard } from '../components/NetWorthCard';
import { BudgetBreakdownCard } from '../components/BudgetBreakdownCard';
import { SpendingComparisonCard } from '../components/SpendingComparisonCard';
import { GoalsPreview } from '../components/GoalsPreview';
import { mockTransactions } from '../utils/mockTransactions';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();

  const {
    data,
    totalSpent,
    avgTransaction,
    latestMonthSpending,
    topCategories,
  } = useFinancialData();

  const { upcomingBills } = useSubscriptions();
  const { netWorth } = useAccounts();

  // Generate upcoming items for next two weeks preview
  const upcomingItems = upcomingBills.slice(0, 10).map(bill => ({
    id: bill.subscription.id,
    date: bill.dueDate,
    name: bill.subscription.merchantName,
    amount: -bill.estimatedAmount,
    type: 'bill' as const,
    category: bill.subscription.category,
  }));

  // Mock data for Net Worth Card
  const netWorthHistory = useMemo(() => {
    const months = ['Feb 28', 'Mar 3', 'Mar 6', 'Mar 9', 'Mar 12', 'Mar 15', 'Mar 18', 'Mar 21', 'Mar 24', 'Mar 27', 'Mar 28'];
    const baseNetWorth = 250000;
    return months.map((month, index) => ({
      date: month,
      value: baseNetWorth + (index * 5000) + (Math.random() * 10000 - 5000),
    }));
  }, []);

  const netWorthChange = netWorthHistory[netWorthHistory.length - 1].value - netWorthHistory[0].value;
  const netWorthChangePercentage = (netWorthChange / netWorthHistory[0].value) * 100;

  // Mock data for Budget Breakdown
  const budgetCategories = useMemo(() => [
    {
      name: 'Fixed' as const,
      budget: 8000,
      spent: 7200,
      remaining: 800,
      percentage: 90,
      status: 'under' as const,
    },
    {
      name: 'Flexible' as const,
      budget: 6000,
      spent: 6500,
      remaining: -500,
      percentage: 108,
      status: 'over' as const,
    },
    {
      name: 'Non-Monthly' as const,
      budget: 4000,
      spent: 4200,
      remaining: -200,
      percentage: 105,
      status: 'over' as const,
    },
  ], []);

  // Mock data for Spending Comparison
  const spendingComparisonData = useMemo(() => {
    const days = ['Day 3', 'Day 6', 'Day 9', 'Day 12', 'Day 15', 'Day 18', 'Day 21', 'Day 24', 'Day 27', 'Day 31'];
    return days.map((day, index) => ({
      day,
      date: day,
      thisYear: 2000 + (index * 500) + (Math.random() * 1000),
      lastYear: 1500 + (index * 450) + (Math.random() * 800),
    }));
  }, []);

  // Mock data for Goals
  const mockGoals = useMemo(() => [
    {
      id: 'goal-1',
      name: 'Emergency Fund',
      icon: 'home',
      current: 7500,
      target: 15000,
      percentage: 50,
      monthlyChange: 500,
      category: 'Savings',
    },
    {
      id: 'goal-2',
      name: 'Vacation Fund',
      icon: 'plane',
      current: 2400,
      target: 5000,
      percentage: 48,
      monthlyChange: -150,
      category: 'Travel',
    },
    {
      id: 'goal-3',
      name: 'Down Payment',
      icon: 'home',
      current: 45000,
      target: 60000,
      percentage: 75,
      monthlyChange: 2000,
      category: 'Housing',
    },
  ], []);

  // Mock sparkline data (in real app, this would come from API based on timeRange)
  const totalSpentSparkline = [45000, 48000, 46000, 50000, 52000, 49000, totalSpent];
  const avgTransactionSparkline = [150, 155, 148, 160, 158, 155, avgTransaction];

  // Calculate budget-related values (using latest month spending as reference)
  const budgetAmount = 55000; // Realistic monthly budget based on spending patterns
  const budgetUsed = latestMonthSpending;
  const budgetLeft = budgetAmount - budgetUsed;
  const budgetPercentage = Math.min((budgetUsed / budgetAmount) * 100, 100);

  // Comparative metrics
  const totalSpentChange = 5.2; // +5.2% vs last period
  const avgTransactionChange = -2.1; // -2.1% vs last period

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

      {/* Budget & Net Worth Row - Monarch Money Style */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <BudgetBreakdownCard
          categories={budgetCategories}
          month="March 2025"
        />
        <NetWorthCard
          netWorth={netWorth}
          change={netWorthChange}
          changePercentage={netWorthChangePercentage}
          history={netWorthHistory}
        />
      </div>

      {/* Spending Comparison & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SpendingComparisonCard
          data={spendingComparisonData}
          title="Spending"
        />
        <GoalsPreview
          goals={mockGoals}
          onViewAll={() => navigate('/goals')}
        />
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

      {/* Transactions to Review & Next Two Weeks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TransactionsToReview
          transactions={mockTransactions}
          maxItems={5}
          onViewAll={() => navigate('/transactions')}
          onSelectTransaction={(transaction) => {
            console.log('Selected transaction:', transaction);
            navigate('/transactions');
          }}
        />
        <NextTwoWeeksPreview upcomingItems={upcomingItems} />
      </div>

      {/* Upcoming Bills */}
      <UpcomingBills bills={upcomingBills} maxItems={5} />
    </div>
  );
}
