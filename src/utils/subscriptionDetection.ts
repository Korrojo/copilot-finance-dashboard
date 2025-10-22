import type { Transaction } from '../types';
import type { RecurringPattern, RecurringTransactionGroup } from '../types/subscription';

/**
 * Detect recurring patterns in transactions
 * This algorithm groups transactions by merchant and analyzes temporal patterns
 */
export function detectRecurringTransactions(
  transactions: Transaction[]
): RecurringTransactionGroup[] {
  // Group transactions by merchant
  const merchantGroups = groupTransactionsByMerchant(transactions);

  const recurringGroups: RecurringTransactionGroup[] = [];

  for (const [merchantName, txs] of Object.entries(merchantGroups)) {
    // Need at least 2 transactions to detect a pattern
    if (txs.length < 2) continue;

    // Sort by date
    const sortedTxs = [...txs].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Analyze temporal pattern
    const pattern = analyzeTemporalPattern(sortedTxs);

    if (pattern && pattern.confidence > 0.6) {
      // Calculate statistics
      const amounts = sortedTxs.map(tx => Math.abs(tx.amount));
      const averageAmount = amounts.reduce((a, b) => a + b, 0) / amounts.length;
      const variance = calculateVariance(amounts);

      // Low variance suggests a subscription
      const isSubscription = variance < 0.15 && pattern.confidence > 0.75;

      recurringGroups.push({
        merchantName,
        category: sortedTxs[0].category,
        pattern,
        transactions: sortedTxs.map(tx => ({
          id: tx.id,
          date: tx.date,
          amount: tx.amount,
          description: tx.merchant,
        })),
        averageAmount,
        variance,
        isSubscription,
      });
    }
  }

  return recurringGroups.sort((a, b) => b.pattern.confidence - a.pattern.confidence);
}

function groupTransactionsByMerchant(
  transactions: Transaction[]
): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};

  for (const tx of transactions) {
    const merchant = normalizeMerchantName(tx.merchant);
    if (!groups[merchant]) {
      groups[merchant] = [];
    }
    groups[merchant].push(tx);
  }

  return groups;
}

function normalizeMerchantName(merchant: string): string {
  // Remove common suffixes and normalize
  return merchant
    .toLowerCase()
    .replace(/\s*(inc|llc|corp|ltd)\.?$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function analyzeTemporalPattern(transactions: Transaction[]): RecurringPattern | null {
  if (transactions.length < 2) return null;

  // Calculate intervals between transactions (in days)
  const intervals: number[] = [];
  for (let i = 1; i < transactions.length; i++) {
    const daysDiff = daysBetween(transactions[i - 1].date, transactions[i].date);
    intervals.push(daysDiff);
  }

  // Calculate average interval
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;

  // Calculate consistency (lower standard deviation = more consistent)
  const stdDev = Math.sqrt(
    intervals.reduce((sum, interval) => sum + Math.pow(interval - avgInterval, 2), 0) /
      intervals.length
  );

  // Confidence decreases with higher standard deviation
  const confidence = Math.max(0, 1 - stdDev / avgInterval);

  // Determine frequency based on average interval
  let frequency: RecurringPattern['frequency'];
  let interval = 1;

  if (avgInterval <= 2) {
    frequency = 'daily';
  } else if (avgInterval >= 6 && avgInterval <= 8) {
    frequency = 'weekly';
  } else if (avgInterval >= 13 && avgInterval <= 15) {
    frequency = 'biweekly';
  } else if (avgInterval >= 28 && avgInterval <= 32) {
    frequency = 'monthly';
  } else if (avgInterval >= 88 && avgInterval <= 95) {
    frequency = 'quarterly';
  } else if (avgInterval >= 360 && avgInterval <= 370) {
    frequency = 'yearly';
  } else {
    // Not a standard recurring pattern
    return null;
  }

  // Calculate next expected date
  const lastDate = new Date(transactions[transactions.length - 1].date);
  const nextDate = new Date(lastDate);
  nextDate.setDate(nextDate.getDate() + Math.round(avgInterval));

  return {
    frequency,
    interval,
    nextDate: nextDate.toISOString().split('T')[0],
    confidence: Math.min(confidence, 1),
  };
}

function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateVariance(amounts: number[]): number {
  if (amounts.length === 0) return 0;

  const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length;
  const variance = amounts.reduce((sum, amount) => {
    return sum + Math.pow(Math.abs(amount - avg) / avg, 2);
  }, 0) / amounts.length;

  return Math.sqrt(variance);
}

/**
 * Calculate days until next occurrence
 */
export function daysUntilDate(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format next billing date with relative time
 */
export function formatNextBillingDate(dateStr: string): string {
  const days = daysUntilDate(dateStr);

  if (days < 0) return 'Overdue';
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days <= 7) return `In ${days} days`;
  if (days <= 30) return `In ${Math.ceil(days / 7)} weeks`;

  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: new Date(dateStr).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  });
}
