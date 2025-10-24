import { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

interface NetWorthDataPoint {
  date: string;
  value: number;
}

interface NetWorthCardProps {
  netWorth: number;
  change: number;
  changePercentage: number;
  history: NetWorthDataPoint[];
}

export function NetWorthCard({ netWorth, change, changePercentage, history }: NetWorthCardProps) {
  const [timePeriod, setTimePeriod] = useState('1 month');
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const periods = ['1 month', '3 months', '6 months', '1 year', 'All time'];

  const isPositiveChange = change >= 0;

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400 mb-1">Net worth</p>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositiveChange ? 'text-green-400' : 'text-red-400'
            }`}>
              {isPositiveChange ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>{isPositiveChange ? '+' : ''}{formatCompactCurrency(Math.abs(change))}</span>
              <span className="text-gray-500">({Math.abs(changePercentage).toFixed(1)}%)</span>
            </div>
          </div>
        </div>

        {/* Time Period Selector */}
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu(!showPeriodMenu)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0a0e1a] rounded-lg text-sm text-gray-300 hover:bg-[#1a1f2e] transition-colors"
          >
            {timePeriod}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showPeriodMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-[#1a1f2e] border border-gray-700 rounded-lg shadow-lg z-10">
              {periods.map((period) => (
                <button
                  key={period}
                  onClick={() => {
                    setTimePeriod(period);
                    setShowPeriodMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    period === timePeriod
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:bg-[#0a0e1a]'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Net Worth Value */}
      <div className="mb-6">
        <h2 className="text-4xl font-bold text-white">
          {formatCurrency(netWorth, false)}
        </h2>
      </div>

      {/* Area Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="#374151"
              style={{ fontSize: '11px' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#374151"
              style={{ fontSize: '11px' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCompactCurrency(value)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1f2e',
                border: '1px solid #374151',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: '#9ca3af' }}
              itemStyle={{ color: '#60a5fa' }}
              formatter={(value: number) => formatCurrency(value, false)}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#netWorthGradient)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
