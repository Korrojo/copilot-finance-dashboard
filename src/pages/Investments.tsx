import { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, PieChart, RefreshCw } from 'lucide-react';
import { useInvestments } from '../hooks/useInvestments';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { Sparkline } from '../components/charts/Sparkline';
import { INVESTMENT_TYPE_COLORS } from '../types/investment';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type TimeRange = '1W' | '1M' | '3M' | 'YTD' | '1Y' | 'ALL';

export function Investments() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const { accounts, positions, portfolioSummary, topMovers, generatePerformanceHistory } = useInvestments();

  const timeRangeDays: Record<TimeRange, number> = {
    '1W': 7,
    '1M': 30,
    '3M': 90,
    'YTD': 180, // Mock
    '1Y': 365,
    'ALL': 730,
  };

  const performanceData = generatePerformanceHistory(timeRangeDays[timeRange]);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Investments</h1>
          <p className="text-gray-400">Track your portfolio performance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors">
          <RefreshCw className="w-4 h-4" />
          <span>Sync Accounts</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Balance</p>
              <h2 className="text-3xl font-bold text-white">
                {formatCurrency(portfolioSummary.totalValue)}
              </h2>
            </div>
            <DollarSign className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Invested:</span>
            <span className="text-white font-medium">
              {formatCurrency(portfolioSummary.investedAmount)}
            </span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Return</p>
              <h2 className={`text-3xl font-bold ${
                portfolioSummary.totalGain >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioSummary.totalGain >= 0 ? '+' : ''}
                {formatCurrency(portfolioSummary.totalGain, false)}
              </h2>
            </div>
            <TrendingUp className={`w-6 h-6 ${
              portfolioSummary.totalGain >= 0 ? 'text-green-400' : 'text-red-400'
            }`} />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${
              portfolioSummary.totalGain >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioSummary.totalGain >= 0 ? '+' : ''}
              {portfolioSummary.totalGainPercent.toFixed(2)}%
            </span>
            <span className="text-gray-500">all time</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Today's Change</p>
              <h2 className={`text-3xl font-bold ${
                portfolioSummary.dayGain >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {portfolioSummary.dayGain >= 0 ? '+' : ''}
                {formatCurrency(portfolioSummary.dayGain, false)}
              </h2>
            </div>
            {portfolioSummary.dayGain >= 0 ? (
              <TrendingUp className="w-6 h-6 text-green-400" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className={`font-medium ${
              portfolioSummary.dayGain >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioSummary.dayGain >= 0 ? '+' : ''}
              {portfolioSummary.dayGainPercent.toFixed(2)}%
            </span>
            <span className="text-gray-500">today</span>
          </div>
        </div>

        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Cash Balance</p>
              <h2 className="text-3xl font-bold text-white">
                {formatCurrency(portfolioSummary.cashBalance)}
              </h2>
            </div>
            <PieChart className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">
              {((portfolioSummary.cashBalance / portfolioSummary.totalValue) * 100).toFixed(1)}% of portfolio
            </span>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Performance</h3>
          <div className="flex gap-2">
            {(['1W', '1M', '3M', 'YTD', '1Y', 'ALL'] as TimeRange[]).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#0a0e1a] text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
                formatter={(value: number) => [formatCurrency(value), 'Value']}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Movers */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Top Movers Today</h3>
          </div>
          <div className="space-y-3">
            {topMovers.map(({ position, change, changePercent, direction }) => (
              <div
                key={position.id}
                className="flex items-center justify-between p-3 bg-[#0a0e1a] rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: position.color || INVESTMENT_TYPE_COLORS[position.type] }}
                  >
                    {position.symbol.slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{position.symbol}</p>
                    <p className="text-xs text-gray-500 truncate">{position.name}</p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <p className={`text-sm font-semibold ${
                    direction === 'up' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {direction === 'up' ? '+' : ''}{formatCurrency(change, false)}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    {direction === 'up' ? (
                      <TrendingUp className="w-3 h-3 text-green-400" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-400" />
                    )}
                    <span className={`text-xs ${
                      direction === 'up' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {Math.abs(changePercent).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Accounts */}
        <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Accounts</h3>
          </div>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 bg-[#0a0e1a] rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
              >
                <div className="flex-1">
                  <p className="text-white font-medium">{account.name}</p>
                  <p className="text-xs text-gray-500">{account.institution}</p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm font-semibold text-white">
                    {formatCurrency(account.totalValue)}
                  </p>
                  <p className={`text-xs ${
                    account.totalGain >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {account.totalGain >= 0 ? '+' : ''}
                    {account.totalGainPercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">Holdings</h3>
          <span className="text-sm text-gray-400">{positions.length} positions</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {positions.map((position) => {
            const sparklineData = Array.from({ length: 30 }, (_, i) => {
              const trend = position.totalGainPercent / 100;
              const noise = (Math.random() - 0.5) * 0.02;
              return position.currentPrice * (1 - trend + (trend * i / 29) + noise);
            });

            return (
              <div
                key={position.id}
                className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-800 hover:border-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: position.color || INVESTMENT_TYPE_COLORS[position.type] }}
                    >
                      {position.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{position.symbol}</p>
                      <p className="text-xs text-gray-500">{position.shares} shares</p>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-2xl font-bold text-white">
                    {formatCurrency(position.currentValue)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    @ {formatCurrency(position.currentPrice, false)}/share
                  </p>
                </div>

                {/* Sparkline */}
                <div className="mb-3">
                  <Sparkline
                    data={sparklineData}
                    width={200}
                    height={40}
                    color={position.totalGain >= 0 ? '#10b981' : '#ef4444'}
                    fillColor={position.totalGain >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-semibold ${
                      position.totalGain >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.totalGain >= 0 ? '+' : ''}{formatCurrency(position.totalGain, false)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {position.totalGain >= 0 ? '+' : ''}{position.totalGainPercent.toFixed(2)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${
                      position.dayGain >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {position.dayGain >= 0 ? '+' : ''}{formatCurrency(position.dayGain, false)}
                    </p>
                    <p className="text-xs text-gray-500">today</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
