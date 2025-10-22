import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MonthlySpending } from '../../types';
import { formatCompactCurrency } from '../../utils/formatCurrency';

interface MonthlySpendingChartProps {
  data: MonthlySpending[];
}

export function MonthlySpendingChart({ data }: MonthlySpendingChartProps) {
  // Transform data for the chart
  const chartData = data.map((item) => ({
    month: item.month,
    amount: Math.abs(item.total_spent),
    transactions: item.transaction_count,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          dataKey="month"
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
        />
        <YAxis
          stroke="#6b7280"
          tick={{ fill: '#9ca3af', fontSize: 12 }}
          tickFormatter={(value) => formatCompactCurrency(value)}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value: number) => [formatCompactCurrency(value), 'Spent']}
          labelStyle={{ color: '#9ca3af' }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
