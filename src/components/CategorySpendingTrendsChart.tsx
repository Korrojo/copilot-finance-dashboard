import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCompactCurrency } from '../utils/formatCurrency';

interface CategoryTrendData {
  month: string;
  [category: string]: number | string;
}

interface CategorySpendingTrendsChartProps {
  data: CategoryTrendData[];
  categories: string[];
}

const CATEGORY_COLORS: Record<string, string> = {
  Shopping: '#ec4899',
  Restaurants: '#10b981',
  Groceries: '#3b82f6',
  'Auto Misc': '#06b6d4',
  Utility: '#f59e0b',
  Entertainment: '#8b5cf6',
  'Food & Drink': '#f97316',
  Transportation: '#6366f1',
  Healthcare: '#ef4444',
  Other: '#6b7280',
};

export function CategorySpendingTrendsChart({
  data,
  categories,
}: CategorySpendingTrendsChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="month"
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => {
              const [month, year] = value.split(' ');
              return `${month} '${year}`;
            }}
          />
          <YAxis
            stroke="#9ca3af"
            tick={{ fill: '#9ca3af' }}
            tickFormatter={(value) => formatCompactCurrency(value)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff',
            }}
            formatter={(value: number) => [formatCompactCurrency(value), '']}
            labelFormatter={(label) => label}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
            formatter={(value) => (
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>{value}</span>
            )}
          />
          {categories.slice(0, 5).map((category, index) => {
            const color = CATEGORY_COLORS[category] || `hsl(${index * 60}, 70%, 50%)`;
            return (
              <Line
                key={category}
                type="monotone"
                dataKey={category}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
