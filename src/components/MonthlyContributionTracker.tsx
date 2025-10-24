import { useState } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import type { MonthlyContribution } from '../types/goal';
import { formatCompactCurrency } from '../utils/formatCurrency';

interface MonthlyContributionTrackerProps {
  contributions: MonthlyContribution[];
  targetAmount: number;
}

export function MonthlyContributionTracker({
  contributions,
  targetAmount,
}: MonthlyContributionTrackerProps) {
  const [year, setYear] = useState(2025);

  // Filter contributions for selected year
  const yearContributions = contributions.filter((c) =>
    c.month.startsWith(year.toString())
  );

  // Generate all 12 months for the year
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = `${year}-${String(i + 1).padStart(2, '0')}`;
    const contribution = yearContributions.find((c) => c.month === month);
    return {
      month,
      monthName: new Date(year, i, 1).toLocaleDateString('en-US', {
        month: 'short',
      }),
      ...contribution,
      amount: contribution?.amount || 0,
      completed: contribution?.completed || false,
      budgeted: contribution?.budgeted || targetAmount,
    };
  });

  const completedCount = months.filter((m) => m.completed).length;
  const totalContributed = months.reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-800">
      {/* Year Selector */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setYear(year - 1)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h4 className="text-lg font-semibold text-white">{year}</h4>
          <p className="text-xs text-gray-500">
            {completedCount} of 12 months • {formatCompactCurrency(totalContributed)} saved
          </p>
        </div>
        <button
          onClick={() => setYear(year + 1)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Monthly Grid */}
      <div className="grid grid-cols-6 gap-3">
        {months.map((month) => {
          const percentage = month.budgeted > 0
            ? (month.amount / month.budgeted) * 100
            : 0;

          return (
            <div
              key={month.month}
              className="relative"
              title={`${month.monthName}: ${formatCompactCurrency(month.amount)} of ${formatCompactCurrency(month.budgeted)}`}
            >
              {/* Month Label */}
              <div className="text-center mb-1">
                <span className="text-xs text-gray-400">{month.monthName}</span>
              </div>

              {/* Progress Bar */}
              <div className="h-12 bg-gray-800 rounded-lg overflow-hidden relative">
                <div
                  className={`absolute bottom-0 left-0 right-0 transition-all duration-500 ${
                    month.completed
                      ? 'bg-green-500'
                      : month.amount > 0
                      ? 'bg-yellow-500'
                      : 'bg-gray-700'
                  }`}
                  style={{ height: `${Math.min(percentage, 100)}%` }}
                />

                {/* Checkmark */}
                {month.completed && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>

              {/* Amount */}
              {month.amount > 0 && (
                <div className="text-center mt-1">
                  <span className="text-xs font-medium text-white">
                    ${Math.round(month.amount)}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-xs text-gray-400">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-xs text-gray-400">Partial</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-700" />
          <span className="text-xs text-gray-400">Pending</span>
        </div>
      </div>
    </div>
  );
}
