import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../utils/formatCurrency';

interface BalanceDataPoint {
  date: string;
  balance: number;
}

interface AccountBalanceChartProps {
  data: BalanceDataPoint[];
  color?: string;
  type?: 'credit' | 'debit' | 'investment';
}

const TIME_RANGES = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'ALL', days: Infinity },
];

export function AccountBalanceChart({ data, color = '#3b82f6', type = 'debit' }: AccountBalanceChartProps) {
  const [timeRange, setTimeRange] = useState('3M');

  // Filter data based on selected time range
  const selectedRange = TIME_RANGES.find(r => r.label === timeRange);
  const cutoffDate = selectedRange && selectedRange.days !== Infinity
    ? new Date(Date.now() - selectedRange.days * 24 * 60 * 60 * 1000)
    : new Date(0);

  const filteredData = data.filter(d => new Date(d.date) >= cutoffDate);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-lg">
          <p className="text-xs text-gray-400 mb-1">
            {new Date(data.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
          <p className="text-sm font-bold text-white">
            {formatCurrency(Math.abs(data.balance))}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      {/* Time Range Selector */}
      <div className="flex justify-end gap-1 mb-4">
        {TIME_RANGES.map(range => (
          <button
            key={range.label}
            onClick={() => setTimeRange(range.label)}
            className={`px-3 py-1 text-xs rounded transition-colors ${
              timeRange === range.label
                ? 'bg-blue-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
              }}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => {
                const absValue = Math.abs(value);
                if (absValue >= 1000000) return `$${(absValue / 1000000).toFixed(1)}M`;
                if (absValue >= 1000) return `$${(absValue / 1000).toFixed(1)}K`;
                return `$${absValue}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="balance"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${type})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
