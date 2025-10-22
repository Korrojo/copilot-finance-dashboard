import { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { IncomeBreakdown } from '../components/IncomeBreakdown';
import { SpendingBreakdown } from '../components/SpendingBreakdown';
import { CashFlowForecast } from '../components/CashFlowForecast';

export function CashFlow() {
  const { data } = useFinancialData();
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Calculate net income for each month
  const cashFlowData = data.monthly_spending.map((month) => ({
    month: month.month,
    // Mock income data (in real app, this would come from actual data)
    income: Math.abs(month.total_spent) * 1.5,
    spending: Math.abs(month.total_spent),
    net: Math.abs(month.total_spent) * 0.5,
  }));

  // Calculate totals
  const totalIncome = cashFlowData.reduce((sum, m) => sum + m.income, 0);
  const totalSpending = cashFlowData.reduce((sum, m) => sum + m.spending, 0);
  const netIncome = totalIncome - totalSpending;

  // Mock income sources
  const incomeSources = useMemo(() => [
    { source: 'Salary', amount: totalIncome * 0.75, percentage: 75, change: 2.5 },
    { source: 'Freelance', amount: totalIncome * 0.15, percentage: 15, change: 12.3 },
    { source: 'Investment', amount: totalIncome * 0.08, percentage: 8, change: -3.2 },
    { source: 'Other', amount: totalIncome * 0.02, percentage: 2, change: 0 },
  ], [totalIncome]);

  // Spending by category with colors
  const spendingCategories = useMemo(() => {
    return data.category_spending.map((cat, index) => {
      const colors = [
        'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500',
        'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
      ];
      const amount = Math.abs(cat.amount);
      return {
        category: cat.category,
        amount,
        percentage: (amount / totalSpending) * 100,
        budget: cat.budget,
        color: colors[index % colors.length],
      };
    }).sort((a, b) => b.amount - a.amount).slice(0, 8);
  }, [data.category_spending, totalSpending]);

  // Cash flow forecast data
  const forecastData = useMemo(() => {
    const avgMonthlyNet = netIncome / cashFlowData.length;
    const months = ['Nov 2024', 'Dec 2024', 'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'];

    return months.map((month, index) => {
      if (index < 3) {
        // Past months - actual data
        return {
          month,
          actual: cashFlowData[index]?.net || avgMonthlyNet,
          isProjected: false,
        };
      } else {
        // Future months - projected
        return {
          month,
          projected: avgMonthlyNet * (1 + (Math.random() - 0.5) * 0.2), // ±10% variance
          isProjected: true,
        };
      }
    });
  }, [cashFlowData, netIncome]);

  const savingsRate = (netIncome / totalIncome) * 100;
  const currentBalance = 25000; // Mock current balance

  // Calculate period comparison
  const lastPeriodIncome = totalIncome * 0.92;
  const incomeChange = ((totalIncome - lastPeriodIncome) / lastPeriodIncome) * 100;
  const lastPeriodSpending = totalSpending * 1.05;
  const spendingChange = ((totalSpending - lastPeriodSpending) / lastPeriodSpending) * 100;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Cash flow</h1>
          <p className="text-gray-400">Income and spending analysis</p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-2 bg-[#141824] rounded-lg p-1 border border-gray-800">
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'month'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setPeriod('quarter')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'quarter'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Quarter
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'year'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Net Income</p>
          <h2 className="text-3xl font-bold text-green-400">
            {formatCurrency(netIncome)}
          </h2>
          <div className="flex items-center gap-2 text-sm mt-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">
              {((netIncome / (totalIncome - netIncome)) * 100).toFixed(2)}%
            </span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Income</p>
          <h2 className="text-3xl font-bold text-white">
            {formatCurrency(totalIncome)}
          </h2>
          <div className="flex items-center gap-2 text-sm mt-2">
            {incomeChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={incomeChange >= 0 ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
              {incomeChange >= 0 ? '+' : ''}{incomeChange.toFixed(2)}%
            </span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Spending</p>
          <h2 className="text-3xl font-bold text-white">
            {formatCurrency(totalSpending)}
          </h2>
          <div className="flex items-center gap-2 text-sm mt-2">
            {spendingChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-red-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-green-400" />
            )}
            <span className={spendingChange >= 0 ? 'text-red-400 font-medium' : 'text-green-400 font-medium'}>
              {spendingChange >= 0 ? '+' : ''}{spendingChange.toFixed(2)}%
            </span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>
      </div>

      {/* Breakdown Sections - Income & Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncomeBreakdown sources={incomeSources} totalIncome={totalIncome} />
        <SpendingBreakdown categories={spendingCategories} totalSpending={totalSpending} />
      </div>

      {/* Cash Flow Forecast */}
      <div className="mb-8">
        <CashFlowForecast
          data={forecastData}
          currentBalance={currentBalance}
          savingsRate={savingsRate}
        />
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Income vs Spending Chart */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Income vs Spending</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={cashFlowData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => formatCompactCurrency(value)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="income" fill="#22c55e" name="Income" />
              <Bar dataKey="spending" fill="#ef4444" name="Spending" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Net Income Trend */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <h3 className="text-lg font-semibold text-white mb-4">Net Income Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cashFlowData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="month" stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis stroke="#6b7280" tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(value) => formatCompactCurrency(value)} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff',
                }}
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#9ca3af' }}
              />
              <Bar dataKey="net" fill="#3b82f6" name="Net Income" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
