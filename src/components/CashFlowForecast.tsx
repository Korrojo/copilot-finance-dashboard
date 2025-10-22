import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';
import { AlertCircle } from 'lucide-react';

interface ForecastData {
  month: string;
  actual?: number;
  projected?: number;
  isProjected: boolean;
}

interface CashFlowForecastProps {
  data: ForecastData[];
  currentBalance: number;
  savingsRate: number;
}

export function CashFlowForecast({ data, currentBalance, savingsRate }: CashFlowForecastProps) {
  // Calculate runway (months until zero if savings rate goes negative)
  const monthlyNet = data[data.length - 1]?.projected || 0;
  const runway = monthlyNet < 0 ? Math.floor(currentBalance / Math.abs(monthlyNet)) : null;

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Cash Flow Forecast</h3>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500">Savings Rate</p>
            <p className={`text-sm font-semibold ${savingsRate >= 20 ? 'text-green-400' : savingsRate >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
              {savingsRate.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Warning if negative runway */}
      {runway !== null && runway < 12 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-yellow-400 font-medium text-sm">Cash Flow Warning</p>
            <p className="text-gray-300 text-xs mt-1">
              At current rate, {runway} month{runway !== 1 ? 's' : ''} until reserves depleted
            </p>
          </div>
        </div>
      )}

      {/* 30/60/90 Day Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0a0e1a] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">30 Days</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency((data[0]?.projected || 0))}
          </p>
        </div>
        <div className="bg-[#0a0e1a] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">60 Days</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency((data[1]?.projected || 0))}
          </p>
        </div>
        <div className="bg-[#0a0e1a] rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-1">90 Days</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency((data[2]?.projected || 0))}
          </p>
        </div>
      </div>

      {/* Forecast Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              stroke="#9ca3af"
              tick={{ fill: '#9ca3af' }}
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
              formatter={(value: number) => [formatCurrency(value), '']}
            />
            <ReferenceLine y={0} stroke="#6b7280" strokeDasharray="3 3" />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name="Actual"
            />
            <Line
              type="monotone"
              dataKey="projected"
              stroke="#8b5cf6"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ r: 4 }}
              name="Projected"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-blue-500" />
          <span>Actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-purple-500 border-dashed" style={{ borderTop: '2px dashed' }} />
          <span>Projected</span>
        </div>
      </div>
    </div>
  );
}
