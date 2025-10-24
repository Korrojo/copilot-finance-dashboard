import { Home, Plane, PiggyBank, GraduationCap, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

interface Goal {
  id: string;
  name: string;
  icon: string;
  current: number;
  target: number;
  percentage: number;
  monthlyChange?: number;
  category?: string;
}

interface GoalsPreviewProps {
  goals: Goal[];
  onViewAll?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  home: <Home className="w-5 h-5" />,
  plane: <Plane className="w-5 h-5" />,
  piggybank: <PiggyBank className="w-5 h-5" />,
  graduation: <GraduationCap className="w-5 h-5" />,
};

export function GoalsPreview({ goals, onViewAll }: GoalsPreviewProps) {
  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-lg font-semibold text-white">Goals</h3>
          <p className="text-sm text-gray-500 mt-0.5">Your top priorities</p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
          >
            View all →
          </button>
        )}
      </div>

      {/* Goals List */}
      <div className="space-y-5">
        {goals.slice(0, 3).map((goal) => {
          const hasMonthlyChange = goal.monthlyChange !== undefined;
          const isPositiveChange = goal.monthlyChange && goal.monthlyChange > 0;

          return (
            <div key={goal.id} className="group">
              {/* Goal Header */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    {iconMap[goal.icon] || <PiggyBank className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white uppercase tracking-wide">
                      {goal.name}
                    </h4>
                    {goal.category && (
                      <p className="text-xs text-gray-500">{goal.category}</p>
                    )}
                  </div>
                </div>

                {/* Monthly Change */}
                {hasMonthlyChange && (
                  <div className={`flex items-center gap-1 text-xs font-medium ${
                    isPositiveChange ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {isPositiveChange ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {isPositiveChange ? '+' : ''}
                      {formatCompactCurrency(Math.abs(goal.monthlyChange!))}
                    </span>
                    <span className="text-gray-500">This month</span>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                  style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                />

                {/* Overflow indicator if over 100% */}
                {goal.percentage > 100 && (
                  <div className="absolute top-0 right-0 h-full w-2 bg-yellow-400 animate-pulse" />
                )}
              </div>

              {/* Goal Progress Text */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">
                  {formatCurrency(goal.current, false)} of {formatCurrency(goal.target, false)}
                </span>
                <span className={`font-medium ${
                  goal.percentage >= 100 ? 'text-green-400' : 'text-blue-400'
                }`}>
                  {goal.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {goals.length === 0 && (
        <div className="text-center py-8">
          <PiggyBank className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-2">No goals yet</p>
          <p className="text-gray-600 text-xs">
            Set financial goals to track your progress
          </p>
        </div>
      )}
    </div>
  );
}
