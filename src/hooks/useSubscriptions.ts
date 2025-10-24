import { useState, useMemo } from 'react';
import type { Subscription, UpcomingBill } from '../types/subscription';
import { daysUntilDate } from '../utils/subscriptionDetection';

// Mock subscription data - in real app, this would come from transaction analysis
const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    merchantName: 'Netflix',
    amount: 15.99,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 28,
      nextDate: '2025-10-28',
      confidence: 0.95,
    },
    category: 'Entertainment',
    firstDetected: '2024-01-15',
    lastCharged: '2025-09-28',
    status: 'active',
    transactionIds: ['tx-1', 'tx-2', 'tx-3'],
    averageAmount: 15.99,
    totalSpent: 175.89,
    occurrences: 11,
  },
  {
    id: 'sub-2',
    merchantName: 'Spotify',
    amount: 10.99,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 25,
      nextDate: '2025-10-25',
      confidence: 0.98,
    },
    category: 'Entertainment',
    firstDetected: '2023-06-05',
    lastCharged: '2025-09-25',
    status: 'active',
    transactionIds: ['tx-4', 'tx-5'],
    averageAmount: 10.99,
    totalSpent: 285.74,
    occurrences: 26,
  },
  {
    id: 'sub-3',
    merchantName: 'Adobe Creative Cloud',
    amount: 54.99,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 1,
      nextDate: '2025-11-01',
      confidence: 1.0,
    },
    category: 'Software',
    firstDetected: '2024-03-01',
    lastCharged: '2025-10-01',
    status: 'active',
    transactionIds: ['tx-6'],
    averageAmount: 54.99,
    totalSpent: 439.92,
    occurrences: 8,
  },
  {
    id: 'sub-4',
    merchantName: 'Amazon Prime',
    amount: 14.99,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 30,
      nextDate: '2025-10-30',
      confidence: 0.92,
    },
    category: 'Shopping',
    firstDetected: '2023-01-20',
    lastCharged: '2025-09-30',
    status: 'active',
    transactionIds: ['tx-7', 'tx-8'],
    averageAmount: 14.99,
    totalSpent: 509.66,
    occurrences: 34,
  },
  {
    id: 'sub-5',
    merchantName: 'GitHub Pro',
    amount: 4.00,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 26,
      nextDate: '2025-10-26',
      confidence: 1.0,
    },
    category: 'Software',
    firstDetected: '2024-01-10',
    lastCharged: '2025-09-26',
    status: 'active',
    transactionIds: ['tx-9'],
    averageAmount: 4.00,
    totalSpent: 44.00,
    occurrences: 11,
  },
  {
    id: 'sub-6',
    merchantName: 'Apple iCloud+',
    amount: 2.99,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 27,
      nextDate: '2025-10-27',
      confidence: 0.95,
    },
    category: 'Software',
    firstDetected: '2023-08-12',
    lastCharged: '2025-09-27',
    status: 'active',
    transactionIds: ['tx-10'],
    averageAmount: 2.99,
    totalSpent: 80.73,
    occurrences: 27,
  },
  {
    id: 'sub-7',
    merchantName: 'New York Times',
    amount: 17.00,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 29,
      nextDate: '2025-10-29',
      confidence: 0.89,
    },
    category: 'News',
    firstDetected: '2024-05-08',
    lastCharged: '2025-09-29',
    status: 'active',
    transactionIds: ['tx-11'],
    averageAmount: 17.00,
    totalSpent: 102.00,
    occurrences: 6,
    isLowUsage: true,
  },
  {
    id: 'sub-8',
    merchantName: 'ChatGPT Plus',
    amount: 20.00,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 3,
      nextDate: '2025-11-03',
      confidence: 1.0,
    },
    category: 'Software',
    firstDetected: '2024-06-03',
    lastCharged: '2025-10-03',
    status: 'active',
    transactionIds: ['tx-12'],
    averageAmount: 20.00,
    totalSpent: 100.00,
    occurrences: 5,
  },
  {
    id: 'sub-9',
    merchantName: 'Planet Fitness',
    amount: 24.99,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 1,
      nextDate: '2025-11-01',
      confidence: 0.97,
    },
    category: 'Health & Fitness',
    firstDetected: '2024-01-01',
    lastCharged: '2025-10-01',
    status: 'active',
    transactionIds: ['tx-13'],
    averageAmount: 24.99,
    totalSpent: 274.89,
    occurrences: 11,
    isLowUsage: true,
  },
  {
    id: 'sub-10',
    merchantName: 'Hulu',
    amount: 7.99,
    pattern: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 25,
      nextDate: '2025-10-25',
      confidence: 0.85,
    },
    category: 'Entertainment',
    firstDetected: '2024-07-25',
    lastCharged: '2025-09-25',
    status: 'cancelled',
    transactionIds: ['tx-14'],
    averageAmount: 7.99,
    totalSpent: 23.97,
    occurrences: 3,
    cancellationDate: '2025-09-25',
  },
];

export function useSubscriptions() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(INITIAL_SUBSCRIPTIONS);

  // Calculate active subscriptions
  const activeSubscriptions = useMemo(
    () => subscriptions.filter(sub => sub.status === 'active'),
    [subscriptions]
  );

  // Calculate total monthly cost
  const totalMonthlyCost = useMemo(() => {
    return activeSubscriptions.reduce((sum, sub) => {
      // Convert to monthly equivalent
      const monthlyAmount =
        sub.pattern.frequency === 'monthly'
          ? sub.amount
          : sub.pattern.frequency === 'yearly'
          ? sub.amount / 12
          : sub.pattern.frequency === 'quarterly'
          ? sub.amount / 3
          : sub.pattern.frequency === 'weekly'
          ? sub.amount * 4
          : sub.pattern.frequency === 'biweekly'
          ? sub.amount * 2
          : sub.amount * 30;

      return sum + monthlyAmount;
    }, 0);
  }, [activeSubscriptions]);

  // Calculate yearly projection
  const yearlyProjection = useMemo(() => totalMonthlyCost * 12, [totalMonthlyCost]);

  // Get upcoming bills (next 30 days)
  const upcomingBills = useMemo<UpcomingBill[]>(() => {
    const bills: UpcomingBill[] = [];

    for (const subscription of activeSubscriptions) {
      const daysUntil = daysUntilDate(subscription.pattern.nextDate);

      // Only include bills in the next 30 days
      if (daysUntil <= 30) {
        bills.push({
          subscription,
          dueDate: subscription.pattern.nextDate,
          estimatedAmount: subscription.averageAmount,
          daysUntilDue: daysUntil,
          isPastDue: daysUntil < 0,
        });
      }
    }

    // Sort by due date
    return bills.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
  }, [activeSubscriptions]);

  // Get subscriptions to review (low usage or expensive)
  const subscriptionsToReview = useMemo(() => {
    return activeSubscriptions.filter(
      sub => sub.isLowUsage || sub.amount > 50
    );
  }, [activeSubscriptions]);

  // Subscriptions by category
  const subscriptionsByCategory = useMemo(() => {
    const categories: Record<string, Subscription[]> = {};

    for (const sub of activeSubscriptions) {
      if (!categories[sub.category]) {
        categories[sub.category] = [];
      }
      categories[sub.category].push(sub);
    }

    return categories;
  }, [activeSubscriptions]);

  // Category spending breakdown
  const categorySpending = useMemo(() => {
    const spending: Record<string, number> = {};

    for (const sub of activeSubscriptions) {
      const monthlyAmount =
        sub.pattern.frequency === 'monthly'
          ? sub.amount
          : sub.pattern.frequency === 'yearly'
          ? sub.amount / 12
          : sub.pattern.frequency === 'quarterly'
          ? sub.amount / 3
          : sub.amount;

      spending[sub.category] = (spending[sub.category] || 0) + monthlyAmount;
    }

    return Object.entries(spending)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [activeSubscriptions]);

  // Update subscription
  const updateSubscription = (id: string, updates: Partial<Subscription>) => {
    setSubscriptions(subs =>
      subs.map(sub => (sub.id === id ? { ...sub, ...updates } : sub))
    );
  };

  // Cancel subscription
  const cancelSubscription = (id: string) => {
    updateSubscription(id, {
      status: 'cancelled',
      cancellationDate: new Date().toISOString().split('T')[0],
    });
  };

  // Pause subscription
  const pauseSubscription = (id: string) => {
    updateSubscription(id, { status: 'paused' });
  };

  // Resume subscription
  const resumeSubscription = (id: string) => {
    updateSubscription(id, { status: 'active' });
  };

  // Add note
  const addNote = (id: string, note: string) => {
    updateSubscription(id, { notes: note });
  };

  return {
    subscriptions,
    activeSubscriptions,
    totalMonthlyCost,
    yearlyProjection,
    upcomingBills,
    subscriptionsToReview,
    subscriptionsByCategory,
    categorySpending,
    updateSubscription,
    cancelSubscription,
    pauseSubscription,
    resumeSubscription,
    addNote,
  };
}
