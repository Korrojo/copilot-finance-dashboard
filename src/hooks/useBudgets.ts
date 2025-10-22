import { useState, useMemo } from 'react';
import type { Budget, BudgetStatus } from '../types/budget';
import { useFinancialData } from './useFinancialData';

// Mock initial budgets (in real app, this would come from API/localStorage)
const INITIAL_BUDGETS: Budget[] = [
  {
    id: '1',
    category: 'Groceries',
    amount: 800,
    period: 'monthly',
    rollover: false,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: '2',
    category: 'Restaurants',
    amount: 400,
    period: 'monthly',
    rollover: false,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: '3',
    category: 'Shopping',
    amount: 300,
    period: 'monthly',
    rollover: true,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
];

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>(INITIAL_BUDGETS);
  const { data } = useFinancialData();

  const budgetStatuses = useMemo<BudgetStatus[]>(() => {
    const categorySpending = new Map(
      data.category_spending.map((cat) => [cat.category, Math.abs(cat.amount)])
    );

    return budgets.map((budget) => {
      const spent = categorySpending.get(budget.category) || 0;
      const remaining = budget.amount - spent;
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      let status: BudgetStatus['status'] = 'under';
      if (percentage >= 100) {
        status = 'over';
      } else if (percentage >= 80) {
        status = 'warning';
      }

      return {
        category: budget.category,
        budget: budget.amount,
        spent,
        remaining,
        percentage,
        status,
      };
    });
  }, [budgets, data.category_spending]);

  const totalBudget = useMemo(
    () => budgets.reduce((sum, budget) => sum + budget.amount, 0),
    [budgets]
  );

  const totalSpent = useMemo(
    () => budgetStatuses.reduce((sum, status) => sum + status.spent, 0),
    [budgetStatuses]
  );

  const updateBudget = (categoryId: string, amount: number) => {
    setBudgets((prev) =>
      prev.map((budget) =>
        budget.category === categoryId
          ? { ...budget, amount, updatedAt: new Date().toISOString() }
          : budget
      )
    );
  };

  const addBudget = (category: string, amount: number) => {
    const newBudget: Budget = {
      id: Date.now().toString(),
      category,
      amount,
      period: 'monthly',
      rollover: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setBudgets((prev) => [...prev, newBudget]);
  };

  const removeBudget = (categoryId: string) => {
    setBudgets((prev) => prev.filter((budget) => budget.category !== categoryId));
  };

  const applyTemplate = (allocations: Record<string, number>, totalAmount: number) => {
    const newBudgets: Budget[] = Object.entries(allocations).map(
      ([category, percentage]) => ({
        id: Date.now().toString() + category,
        category,
        amount: (totalAmount * percentage) / 100,
        period: 'monthly' as const,
        rollover: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    );
    setBudgets(newBudgets);
  };

  return {
    budgets,
    budgetStatuses,
    totalBudget,
    totalSpent,
    updateBudget,
    addBudget,
    removeBudget,
    applyTemplate,
  };
}
