export interface RecurringPattern {
  frequency: 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
  interval: number; // e.g., every 2 weeks
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  nextDate: string;
  confidence: number; // 0-1, how confident we are this is recurring
}

export interface Subscription {
  id: string;
  merchantName: string;
  amount: number;
  pattern: RecurringPattern;
  category: string;
  firstDetected: string;
  lastCharged: string;
  status: 'active' | 'cancelled' | 'paused' | 'trial';
  transactionIds: string[]; // IDs of transactions that match this subscription
  averageAmount: number;
  totalSpent: number;
  occurrences: number;
  notes?: string;
  cancellationDate?: string;
  trialEndDate?: string;
  isLowUsage?: boolean; // Flag for potential cancellation
}

export interface UpcomingBill {
  subscription: Subscription;
  dueDate: string;
  estimatedAmount: number;
  daysUntilDue: number;
  isPastDue: boolean;
}

export interface RecurringTransactionGroup {
  merchantName: string;
  category: string;
  pattern: RecurringPattern;
  transactions: Array<{
    id: string;
    date: string;
    amount: number;
    description: string;
  }>;
  averageAmount: number;
  variance: number; // How much the amount varies
  isSubscription: boolean;
}

export const FREQUENCY_LABELS: Record<RecurringPattern['frequency'], string> = {
  daily: 'Daily',
  weekly: 'Weekly',
  biweekly: 'Every 2 weeks',
  monthly: 'Monthly',
  quarterly: 'Quarterly',
  yearly: 'Yearly',
};

export const FREQUENCY_DAYS: Record<RecurringPattern['frequency'], number> = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
  quarterly: 90,
  yearly: 365,
};

export const SUBSCRIPTION_STATUS_COLORS = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  cancelled: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  paused: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  trial: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};
