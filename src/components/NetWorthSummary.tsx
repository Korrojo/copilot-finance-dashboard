import { useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { TrendingUp, TrendingDown } from 'lucide-react';

type TimeRange = '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL';

interface NetWorthSummaryProps {
  netWorth: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorthChange: number;
  assetsChange: number;
  liabilitiesChange: number;
  showBalances: boolean;
}

export function NetWorthSummary({
  netWorth,
  totalAssets,
  totalLiabilities,
  netWorthChange,
  assetsChange,
  liabilitiesChange,
  showBalances,
}: NetWorthSummaryProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>('YTD');

  // Generate mock historical data (in real app, this would come from API)
  const getHistoricalData = () => {
    const months = timeRange === '1W' ? 1 : timeRange === '1M' ? 1 : timeRange === '3M' ? 3 : timeRange === 'YTD' ? 10 : timeRange === '1Y' ? 12 : 24;
    const dataPoints = timeRange === '1W' ? 7 : months * 4; // weekly points or ~4 per month

    return Array.from({ length: dataPoints }, (_, i) => {
      const date = new Date();
      if (timeRange === '1W') {
        date.setDate(date.getDate() - (dataPoints - 1 - i));
      } else {
        date.setMonth(date.getMonth() - (dataPoints - 1 - i));
      }

      const progress = i / (dataPoints - 1);
      const assetsGrowth = totalAssets * (1 - assetsChange / 100 + (assetsChange / 100) * progress);
      const liabilitiesGrowth = totalLiabilities * (1 + Math.abs(liabilitiesChange) / 100 - (Math.abs(liabilitiesChange) / 100) * progress);

      return {
        month: date.toLocaleDateString('en-US', timeRange === '1W' ? { month: 'short', day: 'numeric' } : { month: 'short', year: '2-digit' }),
        assets: assetsGrowth,
        liabilities: liabilitiesGrowth,
        netWorth: assetsGrowth - liabilitiesGrowth,
      };
    });
  };

  const historicalData = getHistoricalData();

  const timeRanges: TimeRange[] = ['1W', '1M', '3M', 'YTD', '1Y', 'ALL'];

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
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800 mb-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-gray-400 text-sm mb-2">Net Worth</p>
          <h2 className="text-4xl font-bold text-blue-400">
            {showBalances ? formatCurrency(netWorth) : '••••••'}
          </h2>
          <div className="flex items-center gap-2 text-sm mt-2">
            {netWorthChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={`font-medium ${netWorthChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {netWorthChange >= 0 ? '+' : ''}{netWorthChange.toFixed(2)}%
            </span>
            <span className="text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-[#0a0e1a] rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#0a0e1a] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs mb-1">Assets</p>
              <p className="text-2xl font-bold text-white">
                {showBalances ? formatCompactCurrency(totalAssets) : '••••••'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs font-medium">
                  +{assetsChange.toFixed(2)}%
                </span>
              </div>
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
        </div>

        <div className="bg-[#0a0e1a] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs mb-1">Liabilities</p>
              <p className="text-2xl font-bold text-white">
                {showBalances ? formatCompactCurrency(totalLiabilities) : '••••••'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingDown className="w-3 h-3 text-green-400" />
                <span className="text-green-400 text-xs font-medium">
                  {liabilitiesChange.toFixed(2)}%
                </span>
              </div>
            </div>
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={historicalData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              axisLine={{ stroke: '#374151' }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fill: '#9ca3af', fontSize: 11 }}
              tickFormatter={(value) => formatCompactCurrency(value)}
              axisLine={{ stroke: '#374151' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              iconType="line"
              formatter={(value) => (
                <span className="text-gray-400 text-xs">{value}</span>
              )}
            />

            {/* Assets Area */}
            <Area
              type="monotone"
              dataKey="assets"
              fill="rgba(34, 197, 94, 0.1)"
              stroke="#22c55e"
              strokeWidth={2}
              name="Assets"
            />

            {/* Liabilities Area */}
            <Area
              type="monotone"
              dataKey="liabilities"
              fill="rgba(239, 68, 68, 0.1)"
              stroke="#ef4444"
              strokeWidth={2}
              name="Debt"
            />

            {/* Net Worth Line */}
            <Line
              type="monotone"
              dataKey="netWorth"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ fill: '#3b82f6', r: 3 }}
              activeDot={{ r: 5 }}
              name="Net Worth"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
