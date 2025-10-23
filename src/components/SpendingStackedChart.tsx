import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface MonthlySpendingData {
  month: string;
  [category: string]: number | string;
}

interface SpendingStackedChartProps {
  monthlyData: Array<{ month: string; spending: number }>;
  categories: CategoryData[];
  height?: number;
  showLegend?: boolean;
  enableFilter?: boolean;
  onCategoryClick?: (category: string) => void;
}

export function SpendingStackedChart({
  monthlyData,
  categories,
  height = 350,
  showLegend = true,
  enableFilter = false,
  onCategoryClick,
}: SpendingStackedChartProps) {
  // Transform data to include category breakdowns per month
  const stackedData = useMemo<MonthlySpendingData[]>(() => {
    return monthlyData.map((month) => {
      const monthData: MonthlySpendingData = { month: month.month };

      // Distribute spending across categories proportionally
      // In a real app, this would come from actual transaction data
      categories.forEach((cat) => {
        const categoryAmount = (month.spending * (cat.amount / categories.reduce((sum, c) => sum + c.amount, 0)));
        monthData[cat.category] = categoryAmount;
      });

      return monthData;
    });
  }, [monthlyData, categories]);

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    const total = payload.reduce((sum: number, entry: any) => sum + (entry.value || 0), 0);

    return (
      <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-3 shadow-xl max-w-xs">
        <p className="text-gray-300 text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {payload
            .sort((a: any, b: any) => b.value - a.value)
            .map((entry: any) => (
              <div key={entry.dataKey} className="flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-3 h-3 rounded flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-400 truncate">{entry.name}:</span>
                </div>
                <span className="text-white font-medium whitespace-nowrap">
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          <div className="pt-2 mt-2 border-t border-gray-700 flex items-center justify-between">
            <span className="text-gray-400 text-xs font-medium">Total:</span>
            <span className="text-white font-bold text-sm">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    );
  };

  const handleBarClick = (data: any) => {
    if (enableFilter && onCategoryClick) {
      // Get the category from the data key
      const categoryKey = Object.keys(data).find(
        (key) => key !== 'month' && typeof data[key] === 'number'
      );
      if (categoryKey) {
        onCategoryClick(categoryKey);
      }
    }
  };

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Spending by Category</h3>
        <p className="text-sm text-gray-400 mt-1">
          Monthly breakdown across top categories
        </p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={stackedData}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            axisLine={{ stroke: '#374151' }}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(value) => formatCompactCurrency(value)}
            axisLine={{ stroke: '#374151' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
              formatter={(value) => (
                <span className="text-gray-400 text-sm">{value}</span>
              )}
            />
          )}

          {/* Stacked bars for each category */}
          {categories.map((cat) => (
            <Bar
              key={cat.category}
              dataKey={cat.category}
              stackId="spending"
              fill={cat.color}
              onClick={enableFilter ? handleBarClick : undefined}
              cursor={enableFilter ? 'pointer' : 'default'}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>

      {enableFilter && (
        <p className="text-xs text-gray-500 mt-3 text-center">
          Click on any category to filter
        </p>
      )}
    </div>
  );
}
