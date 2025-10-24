import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useGoals } from '../hooks/useGoals';
import { GoalsList } from '../components/GoalsList';
import { GoalDetailPanel } from '../components/GoalDetailPanel';
import { AddGoalModal } from '../components/AddGoalModal';

export function Goals() {
  const {
    goals,
    selectedGoal,
    selectedGoalId,
    totalSaved,
    totalRemaining,
    overallProgress,
    setSelectedGoalId,
    addGoal,
    deleteGoal,
  } = useGoals();

  const [showAddGoalModal, setShowAddGoalModal] = useState(false);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Goals</h1>
          <p className="text-gray-400">Track and achieve your financial goals</p>
        </div>
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Goal
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Goals List */}
        <div className="lg:col-span-1">
          <GoalsList
            goals={goals}
            selectedGoalId={selectedGoalId}
            onSelectGoal={setSelectedGoalId}
            totalSaved={totalSaved}
            totalRemaining={totalRemaining}
            overallProgress={overallProgress}
          />
        </div>

        {/* Right Panel - Goal Details */}
        <div className="lg:col-span-2">
          {selectedGoal ? (
            <GoalDetailPanel
              goal={selectedGoal}
              onDelete={deleteGoal}
            />
          ) : (
            <div className="bg-[#141824] rounded-xl p-12 border border-gray-800 flex flex-col items-center justify-center min-h-[600px]">
              <div className="text-gray-500 text-center">
                <p className="text-lg mb-4">No goals yet</p>
                <p className="text-sm mb-6">
                  Create your first goal to start tracking your progress
                </p>
                <button
                  onClick={() => setShowAddGoalModal(true)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Add Your First Goal
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Goal Modal */}
      {showAddGoalModal && (
        <AddGoalModal
          onClose={() => setShowAddGoalModal(false)}
          onSave={(goalData) => {
            addGoal(goalData);
            setShowAddGoalModal(false);
          }}
        />
      )}
    </div>
  );
}
