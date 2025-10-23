import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

interface ChartDataPoint {
  month: string;
  income: number;
  spending: number;
  net: number;
}

interface CashFlowComboChartProps {
  data: ChartDataPoint[];
  height?: number;
  showLegend?: boolean;
}

export function CashFlowComboChart({
  data,
  height = 350,
  showLegend = true,
}: CashFlowComboChartProps) {
  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="bg-[#1f2937] border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-gray-300 text-sm font-medium mb-2">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-gray-400">{entry.name}:</span>
              </div>
              <span className="text-white font-medium">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white">Cash Flow Overview</h3>
        <p className="text-sm text-gray-400 mt-1">
          Income vs Spending with Net Income Trend
        </p>
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart
          data={data}
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
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="rect"
              formatter={(value) => (
                <span className="text-gray-400 text-sm">{value}</span>
              )}
            />
          )}

          {/* Income Bars (Green) */}
          <Bar
            dataKey="income"
            fill="#22c55e"
            name="Income"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />

          {/* Spending Bars (Red) */}
          <Bar
            dataKey="spending"
            fill="#ef4444"
            name="Spending"
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />

          {/* Net Income Trend Line (Black/White) */}
          <Line
            type="monotone"
            dataKey="net"
            stroke="#ffffff"
            strokeWidth={3}
            dot={{
              fill: '#ffffff',
              stroke: '#141824',
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              fill: '#3b82f6',
              stroke: '#ffffff',
              strokeWidth: 2,
              r: 6,
            }}
            name="Net Income"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
