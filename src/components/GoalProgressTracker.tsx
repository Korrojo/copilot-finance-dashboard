import { useState } from 'react';
import { Target, TrendingUp, Calendar, CheckCircle, Circle } from 'lucide-react';
import { formatCurrency } from '../utils/formatCurrency';

interface Milestone {
  id: string;
  name: string;
  targetAmount: number;
  completed: boolean;
  completedDate?: string;
}

interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'savings' | 'investment' | 'debt-payoff' | 'purchase';
  milestones: Milestone[];
}

const MOCK_GOALS: FinancialGoal[] = [
  {
    id: '1',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 6500,
    deadline: '2025-12-31',
    category: 'savings',
    milestones: [
      { id: '1-1', name: '$2,500 - First Quarter', targetAmount: 2500, completed: true, completedDate: '2025-03-15' },
      { id: '1-2', name: '$5,000 - Halfway There', targetAmount: 5000, completed: true, completedDate: '2025-06-20' },
      { id: '1-3', name: '$7,500 - Final Push', targetAmount: 7500, completed: false },
      { id: '1-4', name: '$10,000 - Goal Reached!', targetAmount: 10000, completed: false },
    ],
  },
  {
    id: '2',
    name: 'Vacation Fund',
    targetAmount: 5000,
    currentAmount: 2800,
    deadline: '2025-08-01',
    category: 'savings',
    milestones: [
      { id: '2-1', name: '$1,500 - Foundation', targetAmount: 1500, completed: true, completedDate: '2025-02-10' },
      { id: '2-2', name: '$3,000 - Over Halfway', targetAmount: 3000, completed: false },
      { id: '2-3', name: '$5,000 - Ready to Travel!', targetAmount: 5000, completed: false },
    ],
  },
  {
    id: '3',
    name: 'Credit Card Payoff',
    targetAmount: 8000,
    currentAmount: 5200,
    deadline: '2025-09-30',
    category: 'debt-payoff',
    milestones: [
      { id: '3-1', name: 'Pay off 25%', targetAmount: 2000, completed: true, completedDate: '2025-01-20' },
      { id: '3-2', name: 'Pay off 50%', targetAmount: 4000, completed: true, completedDate: '2025-04-10' },
      { id: '3-3', name: 'Pay off 75%', targetAmount: 6000, completed: false },
      { id: '3-4', name: 'Debt Free!', targetAmount: 8000, completed: false },
    ],
  },
];

const CATEGORY_COLORS = {
  savings: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  investment: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  'debt-payoff': { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' },
  purchase: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
};

export function GoalProgressTracker() {
  const [goals] = useState<FinancialGoal[]>(MOCK_GOALS);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(goals[0]?.id || null);

  const activeGoal = goals.find(g => g.id === selectedGoal);
  const progress = activeGoal ? (activeGoal.currentAmount / activeGoal.targetAmount) * 100 : 0;
  const daysRemaining = activeGoal ? Math.ceil((new Date(activeGoal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Goal Progress Tracker</h3>
      </div>

      {/* Goal Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {goals.map((goal) => {
          const goalProgress = (goal.currentAmount / goal.targetAmount) * 100;
          const colors = CATEGORY_COLORS[goal.category];

          return (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-lg border transition-all ${
                selectedGoal === goal.id
                  ? `${colors.bg} ${colors.border} ${colors.text}`
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <p className="text-sm font-medium">{goal.name}</p>
              <p className="text-xs mt-1">{goalProgress.toFixed(0)}% complete</p>
            </button>
          );
        })}
      </div>

      {activeGoal && (
        <>
          {/* Progress Overview */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xl font-bold text-white">{activeGoal.name}</h4>
                <p className="text-sm text-gray-400 capitalize">{activeGoal.category.replace('-', ' ')}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(activeGoal.currentAmount)}
                </p>
                <p className="text-sm text-gray-400">
                  of {formatCurrency(activeGoal.targetAmount)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{progress.toFixed(1)}% complete</span>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{daysRemaining} days remaining</span>
              </div>
            </div>
          </div>

          {/* Milestones */}
          <div>
            <h5 className="text-sm font-semibold text-white mb-3">Milestones</h5>
            <div className="space-y-3">
              {activeGoal.milestones.map((milestone, index) => {
                const isCurrent = activeGoal.currentAmount >= activeGoal.milestones[index - 1]?.targetAmount &&
                  activeGoal.currentAmount < milestone.targetAmount;

                return (
                  <div
                    key={milestone.id}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                      milestone.completed
                        ? 'bg-green-500/10 border border-green-500/30'
                        : isCurrent
                        ? 'bg-blue-500/10 border border-blue-500/30'
                        : 'bg-gray-800/50 border border-gray-700'
                    }`}
                  >
                    {milestone.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCurrent ? 'text-blue-400' : 'text-gray-500'}`} />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-medium ${milestone.completed ? 'text-green-400' : isCurrent ? 'text-blue-400' : 'text-white'}`}>
                          {milestone.name}
                        </p>
                        <p className="text-sm text-gray-400">
                          {formatCurrency(milestone.targetAmount)}
                        </p>
                      </div>
                      {milestone.completed && milestone.completedDate && (
                        <p className="text-xs text-gray-500">
                          Completed on {new Date(milestone.completedDate).toLocaleDateString()}
                        </p>
                      )}
                      {isCurrent && (
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                            <span>Progress to this milestone</span>
                            <span>
                              {formatCurrency(activeGoal.currentAmount - (activeGoal.milestones[index - 1]?.targetAmount || 0))} / {formatCurrency(milestone.targetAmount - (activeGoal.milestones[index - 1]?.targetAmount || 0))}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 transition-all"
                              style={{
                                width: `${((activeGoal.currentAmount - (activeGoal.milestones[index - 1]?.targetAmount || 0)) / (milestone.targetAmount - (activeGoal.milestones[index - 1]?.targetAmount || 0))) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Button */}
          <button className="w-full mt-4 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Add Contribution
          </button>
        </>
      )}
    </div>
  );
}
