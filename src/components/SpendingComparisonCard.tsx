import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCompactCurrency } from '../utils/formatCurrency';
import { ChevronDown } from 'lucide-react';

interface SpendingDataPoint {
  date: string;
  thisYear: number;
  lastYear: number;
  day: string;
}

interface SpendingComparisonCardProps {
  data: SpendingDataPoint[];
  title?: string;
}

export function SpendingComparisonCard({ data, title = 'Spending' }: SpendingComparisonCardProps) {
  const [comparison, setComparison] = useState('this month vs. last year');
  const [showComparisonMenu, setShowComparisonMenu] = useState(false);

  const comparisonOptions = [
    'this month vs. last year',
    'this month vs. last month',
    'this year vs. last year',
  ];

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>

        {/* Comparison Selector */}
        <div className="relative">
          <button
            onClick={() => setShowComparisonMenu(!showComparisonMenu)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#0a0e1a] rounded-lg text-sm text-gray-300 hover:bg-[#1a1f2e] transition-colors"
          >
            {comparison}
            <ChevronDown className="w-4 h-4" />
          </button>

          {showComparisonMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#1a1f2e] border border-gray-700 rounded-lg shadow-lg z-10">
              {comparisonOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setComparison(option);
                    setShowComparisonMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                    option === comparison
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:bg-[#0a0e1a]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="thisYearGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lastYearGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6b7280" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6b7280" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="day"
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
              formatter={(value: number) => formatCompactCurrency(value)}
            />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              iconType="line"
              formatter={(value) => {
                const labels = {
                  'this month vs. last year': { thisYear: 'This month', lastYear: 'Last year' },
                  'this month vs. last month': { thisYear: 'This month', lastYear: 'Last month' },
                  'this year vs. last year': { thisYear: 'This year', lastYear: 'Last year' },
                };
                const label = labels[comparison as keyof typeof labels] || labels['this month vs. last year'];
                return (
                  <span className="text-gray-400">
                    {value === 'thisYear' ? label.thisYear : label.lastYear}
                  </span>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="lastYear"
              stroke="#6b7280"
              strokeWidth={2}
              fill="url(#lastYearGradient)"
              animationDuration={500}
            />
            <Area
              type="monotone"
              dataKey="thisYear"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#thisYearGradient)"
              animationDuration={500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
