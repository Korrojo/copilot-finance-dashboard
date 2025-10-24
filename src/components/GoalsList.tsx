import { Home, Plane, GraduationCap, PiggyBank, Car, CheckCircle2, AlertCircle } from 'lucide-react';
import type { Goal } from '../types/goal';
import { formatCurrency, formatCompactCurrency } from '../utils/formatCurrency';

interface GoalsListProps {
  goals: Goal[];
  selectedGoalId: string | null;
  onSelectGoal: (goalId: string) => void;
  totalSaved: number;
  totalRemaining: number;
  overallProgress: number;
}

const iconMap = {
  home: Home,
  plane: Plane,
  graduation: GraduationCap,
  piggybank: PiggyBank,
  car: Car,
};

export function GoalsList({
  goals,
  selectedGoalId,
  onSelectGoal,
  totalSaved,
  totalRemaining,
  overallProgress,
}: GoalsListProps) {
  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Total Saved</p>
            <h2 className="text-2xl font-bold text-white">
              {formatCurrency(totalSaved, false)}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              in {goals.length} {goals.length === 1 ? 'goal' : 'goals'}
            </p>
          </div>

          {/* Circular Progress */}
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#1f2937"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#60a5fa"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 36}`}
                strokeDashoffset={`${2 * Math.PI * 36 * (1 - overallProgress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {Math.round(overallProgress)}%
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Remaining</span>
            <span className="font-semibold text-white">
              {formatCompactCurrency(totalRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Your Goals</h3>

        <div className="space-y-3">
          {goals.map((goal) => {
            const Icon = iconMap[goal.icon];
            const isSelected = goal.id === selectedGoalId;

            return (
              <button
                key={goal.id}
                onClick={() => onSelectGoal(goal.id)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-[#0a0e1a] border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-blue-500/20' : 'bg-gray-800'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isSelected ? 'text-blue-400' : 'text-gray-400'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-white truncate">
                        {goal.name}
                      </h4>
                      <div className="flex items-center gap-1 ml-2">
                        {goal.isOnTrack ? (
                          <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            goal.percentage >= 100
                              ? 'bg-green-500'
                              : goal.percentage >= 75
                              ? 'bg-blue-500'
                              : goal.percentage >= 50
                              ? 'bg-yellow-500'
                              : 'bg-orange-500'
                          }`}
                          style={{ width: `${Math.min(goal.percentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        {formatCompactCurrency(goal.current)} of {formatCompactCurrency(goal.target)}
                      </span>
                      <span className="font-medium text-white">
                        {Math.round(goal.percentage)}%
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {goals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No goals yet</p>
            <p className="text-xs mt-1">Add your first goal to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
