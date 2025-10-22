import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { CategorySpending } from '../../types';
import { formatCompactCurrency } from '../../utils/formatCurrency';

interface CategoryPieChartProps {
  data: CategorySpending[];
  limit?: number;
}

const COLORS = [
  '#ef4444', // red
  '#3b82f6', // blue
  '#eab308', // yellow
  '#22c55e', // green
  '#a855f7', // purple
  '#ec4899', // pink
  '#f97316', // orange
  '#14b8a6', // teal
  '#6366f1', // indigo
  '#84cc16', // lime
];

export function CategoryPieChart({ data, limit = 10 }: CategoryPieChartProps) {
  // Get top categories
  const topCategories = data.slice(0, limit);

  const chartData = topCategories.map((item) => ({
    name: item.category,
    value: item.amount,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '8px',
            color: '#fff',
          }}
          formatter={(value: number) => formatCompactCurrency(value)}
        />
        <Legend
          wrapperStyle={{ color: '#9ca3af', fontSize: '12px' }}
          formatter={(value) => <span style={{ color: '#9ca3af' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
