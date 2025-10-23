import { Target, X, TrendingUp } from 'lucide-react';
import type { Goal } from '../types';

interface GoalSelectorProps {
  selectedGoalId?: string;
  goals: Goal[];
  onSelect: (goalId: string | undefined) => void;
  transactionAmount?: number;
}

export function GoalSelector({
  selectedGoalId,
  goals,
  onSelect,
  transactionAmount,
}: GoalSelectorProps) {
  const selectedGoal = goals.find(g => g.id === selectedGoalId);

  // Calculate impact of transaction on goal
  const calculateImpact = (goal: Goal): number => {
    if (!transactionAmount) return 0;
    const newCurrent = goal.current + Math.abs(transactionAmount);
    const newProgress = (newCurrent / goal.target) * 100;
    const oldProgress = (goal.current / goal.target) * 100;
    return newProgress - oldProgress;
  };

  return (
    <div className="space-y-3">
      {/* Current Selection */}
      {selectedGoal ? (
        <div
          className="p-3 rounded-lg border flex items-center justify-between"
          style={{
            backgroundColor: `${selectedGoal.color || '#3B82F6'}20`,
            borderColor: `${selectedGoal.color || '#3B82F6'}50`,
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: `${selectedGoal.color || '#3B82F6'}30`,
              }}
            >
              <Target
                className="w-5 h-5"
                style={{ color: selectedGoal.color || '#3B82F6' }}
              />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{selectedGoal.name}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>
                  ${selectedGoal.current.toFixed(0)} / ${selectedGoal.target.toFixed(0)}
                </span>
                <span>•</span>
                <span>{((selectedGoal.current / selectedGoal.target) * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onSelect(undefined)}
            className="p-1.5 hover:bg-black/20 rounded-lg transition-colors"
            aria-label="Remove goal"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      ) : (
        <div className="text-sm text-gray-400 italic">No goal assigned</div>
      )}

      {/* Goal Selection Dropdown */}
      {!selectedGoal && goals.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Assign to Goal</label>
          <select
            value={selectedGoalId || ''}
            onChange={(e) => onSelect(e.target.value || undefined)}
            className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a goal...</option>
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.name} ({((goal.current / goal.target) * 100).toFixed(0)}%)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Goal Impact Preview */}
      {selectedGoal && transactionAmount && transactionAmount > 0 && (
        <div className="p-3 bg-green-600/10 border border-green-600/20 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 font-medium">
              +{calculateImpact(selectedGoal).toFixed(1)}% progress toward goal
            </span>
          </div>
        </div>
      )}

      {/* No Goals Message */}
      {goals.length === 0 && (
        <div className="p-4 bg-[#0a0e1a] border border-gray-700 rounded-lg text-center">
          <Target className="w-8 h-8 text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-400">No goals created yet</p>
          <p className="text-xs text-gray-500 mt-1">Create goals to track your progress</p>
        </div>
      )}
    </div>
  );
}
