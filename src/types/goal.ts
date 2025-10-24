export interface Goal {
  id: string;
  name: string;
  icon: 'home' | 'plane' | 'graduation' | 'piggybank' | 'car';
  category: string;

  // Financial
  target: number;
  current: number;
  percentage: number;

  // Timeline
  startDate: string;
  targetDate: string;
  monthlyTarget?: number;

  // Mode
  savingMode: 'target-date' | 'monthly-amount';
  priority: 'high' | 'medium' | 'low';

  // Tracking
  linkedAccounts: string[];
  monthlyContributions: MonthlyContribution[];
  transactions: GoalTransaction[];

  // Projections
  projectedCompletion?: string;
  requiredMonthlyAmount: number;
  isOnTrack: boolean;
}

export interface MonthlyContribution {
  month: string; // 'YYYY-MM'
  amount: number;
  completed: boolean;
  budgeted: number;
}

export interface GoalTransaction {
  id: string;
  date: string;
  amount: number;
  accountId: string;
  accountName: string;
  type: 'contribution' | 'withdrawal' | 'interest';
  note?: string;
}

export interface GoalFormData {
  name: string;
  icon: Goal['icon'];
  category: string;
  target: number;
  targetDate: string;
  savingMode: Goal['savingMode'];
  monthlyTarget?: number;
  priority: Goal['priority'];
  linkedAccounts: string[];
}
