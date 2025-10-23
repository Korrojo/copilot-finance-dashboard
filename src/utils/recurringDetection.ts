import type { Transaction } from '../types';

export interface RecurringPattern {
  id: string;
  merchant: string;
  averageAmount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
  confidence: number; // 0-100
  transactions: string[]; // Transaction IDs
  nextExpectedDate?: string;
  dayOfMonth?: number; // For monthly patterns
  dayOfWeek?: number; // For weekly patterns (0-6)
}

/**
 * Calculate the number of days between two dates
 */
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Check if two amounts are similar (within 10% tolerance)
 */
function amountsSimilar(amount1: number, amount2: number, tolerance: number = 0.1): boolean {
  const diff = Math.abs(amount1 - amount2);
  const avg = (Math.abs(amount1) + Math.abs(amount2)) / 2;
  return diff / avg <= tolerance;
}

/**
 * Detect frequency pattern from intervals
 */
function detectFrequency(intervals: number[]): {
  frequency: RecurringPattern['frequency'];
  confidence: number;
} | null {
  if (intervals.length === 0) return null;

  const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
  const variance = intervals.reduce((sum, val) => sum + Math.pow(val - avgInterval, 2), 0) / intervals.length;
  const stdDev = Math.sqrt(variance);

  // Low confidence if intervals vary too much
  const consistencyScore = Math.max(0, 100 - (stdDev / avgInterval) * 100);

  // Detect frequency based on average interval
  let frequency: RecurringPattern['frequency'];
  let frequencyMatch = 0;

  if (avgInterval >= 6 && avgInterval <= 8) {
    frequency = 'weekly';
    frequencyMatch = 100 - Math.abs(avgInterval - 7) * 10;
  } else if (avgInterval >= 13 && avgInterval <= 15) {
    frequency = 'biweekly';
    frequencyMatch = 100 - Math.abs(avgInterval - 14) * 7;
  } else if (avgInterval >= 28 && avgInterval <= 32) {
    frequency = 'monthly';
    frequencyMatch = 100 - Math.abs(avgInterval - 30) * 3;
  } else if (avgInterval >= 88 && avgInterval <= 95) {
    frequency = 'quarterly';
    frequencyMatch = 100 - Math.abs(avgInterval - 91) * 1;
  } else if (avgInterval >= 360 && avgInterval <= 370) {
    frequency = 'annually';
    frequencyMatch = 100 - Math.abs(avgInterval - 365) * 0.5;
  } else {
    return null; // No clear pattern
  }

  const confidence = Math.min(100, (consistencyScore + frequencyMatch) / 2);

  return { frequency, confidence };
}

/**
 * Calculate next expected date based on frequency
 */
function calculateNextExpectedDate(
  lastDate: string,
  frequency: RecurringPattern['frequency']
): string {
  const date = new Date(lastDate);

  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'annually':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date.toISOString().split('T')[0];
}

/**
 * Get day of month from a date string
 */
function getDayOfMonth(dateStr: string): number {
  return new Date(dateStr).getDate();
}

/**
 * Get day of week from a date string (0 = Sunday, 6 = Saturday)
 */
function getDayOfWeek(dateStr: string): number {
  return new Date(dateStr).getDay();
}

/**
 * Generate unique ID for recurring pattern
 */
function generateRecurringId(): string {
  return `recurring-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Detect recurring transaction patterns
 * Requires minimum 3 occurrences to establish a pattern
 */
export function detectRecurringPatterns(
  transactions: Transaction[],
  minOccurrences: number = 3
): RecurringPattern[] {
  const patterns: RecurringPattern[] = [];

  // Group transactions by merchant
  const transactionsByMerchant = new Map<string, Transaction[]>();

  transactions.forEach(transaction => {
    const merchant = transaction.merchant.toLowerCase().trim();
    if (!transactionsByMerchant.has(merchant)) {
      transactionsByMerchant.set(merchant, []);
    }
    transactionsByMerchant.get(merchant)!.push(transaction);
  });

  // Analyze each merchant's transactions
  transactionsByMerchant.forEach((merchantTransactions) => {
    // Need at least minOccurrences
    if (merchantTransactions.length < minOccurrences) return;

    // Sort by date (newest first)
    const sorted = [...merchantTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Check for similar amounts
    const amounts = sorted.map(t => t.amount);
    const avgAmount = amounts.reduce((sum, a) => sum + a, 0) / amounts.length;

    // Filter to transactions with similar amounts (within 10% of average)
    const similarAmountTransactions = sorted.filter(t =>
      amountsSimilar(t.amount, avgAmount, 0.1)
    );

    if (similarAmountTransactions.length < minOccurrences) return;

    // Calculate intervals between transactions
    const intervals: number[] = [];
    for (let i = 0; i < similarAmountTransactions.length - 1; i++) {
      const interval = daysBetween(
        similarAmountTransactions[i + 1].date,
        similarAmountTransactions[i].date
      );
      intervals.push(interval);
    }

    // Detect frequency pattern
    const frequencyResult = detectFrequency(intervals);
    if (!frequencyResult || frequencyResult.confidence < 50) return;

    const { frequency, confidence } = frequencyResult;

    // Calculate next expected date
    const lastTransaction = similarAmountTransactions[0];
    const nextExpectedDate = calculateNextExpectedDate(lastTransaction.date, frequency);

    // Determine day of month or week
    const dayOfMonth =
      frequency === 'monthly' || frequency === 'quarterly' || frequency === 'annually'
        ? getDayOfMonth(lastTransaction.date)
        : undefined;

    const dayOfWeek =
      frequency === 'weekly' || frequency === 'biweekly'
        ? getDayOfWeek(lastTransaction.date)
        : undefined;

    patterns.push({
      id: generateRecurringId(),
      merchant: merchantTransactions[0].merchant, // Use original casing
      averageAmount: avgAmount,
      frequency,
      confidence: Math.round(confidence),
      transactions: similarAmountTransactions.map(t => t.id),
      nextExpectedDate,
      dayOfMonth,
      dayOfWeek,
    });
  });

  // Sort by confidence (highest first)
  return patterns.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Check if a transaction matches a recurring pattern
 */
export function matchesRecurringPattern(
  transaction: Transaction,
  pattern: RecurringPattern
): boolean {
  // Check merchant
  if (transaction.merchant.toLowerCase() !== pattern.merchant.toLowerCase()) {
    return false;
  }

  // Check amount similarity
  if (!amountsSimilar(transaction.amount, pattern.averageAmount, 0.1)) {
    return false;
  }

  return true;
}

/**
 * Get recurring pattern for a transaction
 */
export function getRecurringPatternForTransaction(
  transaction: Transaction,
  patterns: RecurringPattern[]
): RecurringPattern | null {
  return patterns.find(pattern => pattern.transactions.includes(transaction.id)) || null;
}

/**
 * Format frequency for display
 */
export function formatFrequency(frequency: RecurringPattern['frequency']): string {
  const map = {
    weekly: 'Weekly',
    biweekly: 'Every 2 weeks',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    annually: 'Annually',
  };
  return map[frequency];
}

/**
 * Get confidence level description
 */
export function getConfidenceLevel(confidence: number): {
  level: 'low' | 'medium' | 'high' | 'very_high';
  label: string;
  color: string;
} {
  if (confidence >= 90) {
    return { level: 'very_high', label: 'Very High', color: '#10B981' };
  } else if (confidence >= 75) {
    return { level: 'high', label: 'High', color: '#3B82F6' };
  } else if (confidence >= 60) {
    return { level: 'medium', label: 'Medium', color: '#F59E0B' };
  } else {
    return { level: 'low', label: 'Low', color: '#EF4444' };
  }
}
