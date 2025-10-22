import { TrendingUp, Briefcase, DollarSign, Gift } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface IncomeSource {
  source: string;
  amount: number;
  percentage: number;
  change: number;
  icon?: string;
}

interface IncomeBreakdownProps {
  sources: IncomeSource[];
  totalIncome: number;
}

const INCOME_ICONS: Record<string, React.ReactNode> = {
  Salary: <Briefcase className="w-5 h-5" />,
  Freelance: <DollarSign className="w-5 h-5" />,
  Investment: <TrendingUp className="w-5 h-5" />,
  Other: <Gift className="w-5 h-5" />,
};

const INCOME_COLORS: Record<string, string> = {
  Salary: 'bg-green-500',
  Freelance: 'bg-blue-500',
  Investment: 'bg-purple-500',
  Other: 'bg-gray-500',
};

export function IncomeBreakdown({ sources, totalIncome }: IncomeBreakdownProps) {
  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Income Breakdown</h3>
        <span className="text-sm text-gray-400">{formatCurrency(totalIncome)} total</span>
      </div>

      <div className="space-y-4">
        {sources.map((source) => (
          <div key={source.source} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${INCOME_COLORS[source.source] || 'bg-gray-500'} bg-opacity-20`}>
                  {INCOME_ICONS[source.source] || INCOME_ICONS.Other}
                </div>
                <div>
                  <p className="text-white font-medium">{source.source}</p>
                  <p className="text-xs text-gray-500">{source.percentage.toFixed(1)}% of income</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{formatCurrency(source.amount)}</p>
                <div className={`text-xs ${source.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {source.change >= 0 ? '+' : ''}{source.change.toFixed(1)}%
                </div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${INCOME_COLORS[source.source] || 'bg-gray-500'} transition-all`}
                style={{ width: `${source.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
