import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { TrendingUp } from 'lucide-react';

export function CashFlow() {
  const { data } = useFinancialData();

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

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Cash flow</h1>
        <p className="text-gray-400">Income and spending analysis</p>
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
            <span className="text-green-400 font-medium">22.82%</span>
            <span className="text-gray-500">vs last period</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Income</p>
          <h2 className="text-3xl font-bold text-white">
            {formatCurrency(totalIncome)}
          </h2>
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className="text-gray-500">All sources</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <p className="text-gray-400 text-sm mb-1">Total Spending</p>
          <h2 className="text-3xl font-bold text-white">
            {formatCurrency(totalSpending)}
          </h2>
          <div className="flex items-center gap-2 text-sm mt-2">
            <span className="text-gray-500">All categories</span>
          </div>
        </div>
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
