import { useState, useMemo } from 'react';
import type { Goal, GoalFormData } from '../types/goal';

// Mock data for goals
const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    icon: 'home',
    category: 'Savings',
    target: 15000,
    current: 7500,
    percentage: 50,
    startDate: '2025-01-01',
    targetDate: '2026-12-31',
    savingMode: 'target-date',
    priority: 'high',
    linkedAccounts: ['Bet.Saving'],
    requiredMonthlyAmount: 500,
    isOnTrack: true,
    monthlyContributions: [
      { month: '2025-01', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-02', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-03', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-04', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-05', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-06', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-07', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-08', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-09', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-10', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-11', amount: 0, completed: false, budgeted: 500 },
      { month: '2025-12', amount: 0, completed: false, budgeted: 500 },
    ],
    transactions: [
      {
        id: 'txn-1',
        date: '2025-10-15',
        amount: 500,
        accountId: 'acc-1',
        accountName: 'Bet.Saving',
        type: 'contribution',
      },
      {
        id: 'txn-2',
        date: '2025-09-15',
        amount: 500,
        accountId: 'acc-1',
        accountName: 'Bet.Saving',
        type: 'contribution',
      },
      {
        id: 'txn-3',
        date: '2025-08-15',
        amount: 500,
        accountId: 'acc-1',
        accountName: 'Bet.Saving',
        type: 'contribution',
      },
    ],
  },
  {
    id: 'goal-2',
    name: 'Vacation Fund',
    icon: 'plane',
    category: 'Travel',
    target: 5000,
    current: 2400,
    percentage: 48,
    startDate: '2025-01-01',
    targetDate: '2025-12-31',
    savingMode: 'monthly-amount',
    monthlyTarget: 400,
    priority: 'medium',
    linkedAccounts: ['Bus.Checking'],
    requiredMonthlyAmount: 400,
    isOnTrack: false,
    monthlyContributions: [
      { month: '2025-01', amount: 400, completed: true, budgeted: 400 },
      { month: '2025-02', amount: 400, completed: true, budgeted: 400 },
      { month: '2025-03', amount: 400, completed: true, budgeted: 400 },
      { month: '2025-04', amount: 400, completed: true, budgeted: 400 },
      { month: '2025-05', amount: 400, completed: true, budgeted: 400 },
      { month: '2025-06', amount: 400, completed: true, budgeted: 400 },
      { month: '2025-07', amount: 0, completed: false, budgeted: 400 },
      { month: '2025-08', amount: 0, completed: false, budgeted: 400 },
      { month: '2025-09', amount: 0, completed: false, budgeted: 400 },
      { month: '2025-10', amount: 0, completed: false, budgeted: 400 },
      { month: '2025-11', amount: 0, completed: false, budgeted: 400 },
      { month: '2025-12', amount: 0, completed: false, budgeted: 400 },
    ],
    transactions: [
      {
        id: 'txn-4',
        date: '2025-06-01',
        amount: 400,
        accountId: 'acc-2',
        accountName: 'Bus.Checking',
        type: 'contribution',
      },
    ],
  },
  {
    id: 'goal-3',
    name: 'Down Payment',
    icon: 'home',
    category: 'Housing',
    target: 60000,
    current: 45000,
    percentage: 75,
    startDate: '2024-01-01',
    targetDate: '2026-06-30',
    savingMode: 'target-date',
    priority: 'high',
    linkedAccounts: ['Bet.Saving', 'Bus.Checking'],
    requiredMonthlyAmount: 2000,
    isOnTrack: true,
    monthlyContributions: [
      { month: '2025-01', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-02', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-03', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-04', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-05', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-06', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-07', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-08', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-09', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-10', amount: 2000, completed: true, budgeted: 2000 },
      { month: '2025-11', amount: 0, completed: false, budgeted: 2000 },
      { month: '2025-12', amount: 0, completed: false, budgeted: 2000 },
    ],
    transactions: [
      {
        id: 'txn-5',
        date: '2025-10-01',
        amount: 2000,
        accountId: 'acc-1',
        accountName: 'Bet.Saving',
        type: 'contribution',
      },
    ],
  },
];

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(
    goals.length > 0 ? goals[0].id : null
  );

  // Calculate totals
  const totalSaved = useMemo(() => {
    return goals.reduce((sum, goal) => sum + goal.current, 0);
  }, [goals]);

  const totalTarget = useMemo(() => {
    return goals.reduce((sum, goal) => sum + goal.target, 0);
  }, [goals]);

  const totalRemaining = totalTarget - totalSaved;
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const selectedGoal = useMemo(() => {
    return goals.find((g) => g.id === selectedGoalId) || goals[0] || null;
  }, [goals, selectedGoalId]);

  // Add goal
  const addGoal = (formData: GoalFormData) => {
    const newGoal: Goal = {
      id: `goal-${Date.now()}`,
      ...formData,
      current: 0,
      percentage: 0,
      startDate: new Date().toISOString().split('T')[0],
      requiredMonthlyAmount: 0,
      isOnTrack: true,
      monthlyContributions: [],
      transactions: [],
    };

    // Calculate required monthly amount
    const monthsToTarget = calculateMonthsToTarget(
      newGoal.startDate,
      newGoal.targetDate
    );
    newGoal.requiredMonthlyAmount = newGoal.target / monthsToTarget;

    setGoals([...goals, newGoal]);
    setSelectedGoalId(newGoal.id);
  };

  // Update goal
  const updateGoal = (goalId: string, updates: Partial<Goal>) => {
    setGoals(
      goals.map((goal) =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    );
  };

  // Delete goal
  const deleteGoal = (goalId: string) => {
    const newGoals = goals.filter((g) => g.id !== goalId);
    setGoals(newGoals);
    if (selectedGoalId === goalId) {
      setSelectedGoalId(newGoals.length > 0 ? newGoals[0].id : null);
    }
  };

  // Add contribution
  const addContribution = (
    goalId: string,
    amount: number,
    accountId: string,
    accountName: string
  ) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) return;

    const newTransaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      amount,
      accountId,
      accountName,
      type: 'contribution' as const,
    };

    const newCurrent = goal.current + amount;
    const newPercentage = (newCurrent / goal.target) * 100;

    updateGoal(goalId, {
      current: newCurrent,
      percentage: newPercentage,
      transactions: [newTransaction, ...goal.transactions],
    });
  };

  return {
    goals,
    selectedGoal,
    selectedGoalId,
    totalSaved,
    totalTarget,
    totalRemaining,
    overallProgress,
    setSelectedGoalId,
    addGoal,
    updateGoal,
    deleteGoal,
    addContribution,
  };
}

// Helper function
function calculateMonthsToTarget(startDate: string, targetDate: string): number {
  const start = new Date(startDate);
  const target = new Date(targetDate);
  const months =
    (target.getFullYear() - start.getFullYear()) * 12 +
    (target.getMonth() - start.getMonth());
  return Math.max(months, 1);
}
