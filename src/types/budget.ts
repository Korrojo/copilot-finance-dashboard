export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  rollover: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  allocations: Record<string, number>; // category -> percentage
}

export interface BudgetStatus {
  category: string;
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'under' | 'warning' | 'over'; // under budget, approaching limit (80-100%), over budget
}

export const BUDGET_TEMPLATES: BudgetTemplate[] = [
  {
    id: '50-30-20',
    name: '50/30/20 Rule',
    description: '50% Needs, 30% Wants, 20% Savings',
    allocations: {
      Groceries: 20,
      Utilities: 10,
      Transportation: 10,
      Housing: 10,
      Restaurants: 15,
      Entertainment: 10,
      Shopping: 5,
      Savings: 20,
    },
  },
  {
    id: 'zero-based',
    name: 'Zero-Based Budget',
    description: 'Every dollar has a purpose',
    allocations: {
      Groceries: 15,
      Utilities: 8,
      Transportation: 12,
      Housing: 25,
      Restaurants: 8,
      Entertainment: 7,
      Shopping: 5,
      Savings: 15,
      Miscellaneous: 5,
    },
  },
  {
    id: 'custom',
    name: 'Custom Budget',
    description: 'Set your own allocations',
    allocations: {},
  },
];
