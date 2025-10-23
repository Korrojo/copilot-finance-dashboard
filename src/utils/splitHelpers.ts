import type { TransactionSplit } from '../types';

/**
 * Generate a unique ID for a split transaction
 */
export function generateSplitId(): string {
  return `split-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Create a new empty split
 */
export function createEmptySplit(): TransactionSplit {
  return {
    id: generateSplitId(),
    category: '',
    amount: 0,
    notes: '',
  };
}

/**
 * Calculate the total amount from all splits
 */
export function calculateSplitTotal(splits: TransactionSplit[]): number {
  return splits.reduce((sum, split) => sum + (split.amount || 0), 0);
}

/**
 * Calculate the remaining amount to be allocated
 */
export function calculateRemaining(originalAmount: number, splits: TransactionSplit[]): number {
  const total = calculateSplitTotal(splits);
  return Math.abs(originalAmount) - total;
}

/**
 * Validate that splits equal the original amount
 */
export function validateSplits(originalAmount: number, splits: TransactionSplit[]): {
  isValid: boolean;
  error?: string;
} {
  // Check that all splits have categories
  const emptyCategorySplits = splits.filter(s => !s.category.trim());
  if (emptyCategorySplits.length > 0) {
    return {
      isValid: false,
      error: 'All splits must have a category',
    };
  }

  // Check that all splits have positive amounts
  const invalidAmounts = splits.filter(s => s.amount <= 0);
  if (invalidAmounts.length > 0) {
    return {
      isValid: false,
      error: 'All splits must have amounts greater than 0',
    };
  }

  // Check that total equals original amount
  const remaining = calculateRemaining(originalAmount, splits);
  if (Math.abs(remaining) > 0.01) {
    // Allow for small floating point errors
    return {
      isValid: false,
      error: `Splits must equal the original amount. Remaining: $${remaining.toFixed(2)}`,
    };
  }

  return { isValid: true };
}

/**
 * Distribute amount equally among splits
 */
export function distributeSplitsEqually(
  originalAmount: number,
  numberOfSplits: number
): TransactionSplit[] {
  const absAmount = Math.abs(originalAmount);
  const amountPerSplit = absAmount / numberOfSplits;

  const splits: TransactionSplit[] = [];
  for (let i = 0; i < numberOfSplits; i++) {
    splits.push({
      id: generateSplitId(),
      category: '',
      amount: parseFloat(amountPerSplit.toFixed(2)),
      notes: '',
    });
  }

  // Adjust the last split to account for rounding errors
  const total = calculateSplitTotal(splits);
  const diff = absAmount - total;
  if (Math.abs(diff) > 0.01) {
    splits[splits.length - 1].amount += diff;
    splits[splits.length - 1].amount = parseFloat(splits[splits.length - 1].amount.toFixed(2));
  }

  return splits;
}

/**
 * Distribute amount by percentages
 */
export function distributeSplitsByPercentage(
  originalAmount: number,
  percentages: number[]
): TransactionSplit[] {
  const absAmount = Math.abs(originalAmount);

  const splits: TransactionSplit[] = percentages.map((percentage) => ({
    id: generateSplitId(),
    category: '',
    amount: parseFloat(((absAmount * percentage) / 100).toFixed(2)),
    notes: '',
  }));

  // Adjust the last split to account for rounding errors
  const total = calculateSplitTotal(splits);
  const diff = absAmount - total;
  if (Math.abs(diff) > 0.01) {
    splits[splits.length - 1].amount += diff;
    splits[splits.length - 1].amount = parseFloat(splits[splits.length - 1].amount.toFixed(2));
  }

  return splits;
}

/**
 * Auto-fill the remaining amount to the last split
 */
export function autoFillRemaining(
  originalAmount: number,
  splits: TransactionSplit[]
): TransactionSplit[] {
  if (splits.length === 0) return splits;

  const updatedSplits = [...splits];
  const remaining = calculateRemaining(originalAmount, updatedSplits);

  // Find the last split with an empty or zero amount
  const lastEmptyIndex = updatedSplits.findIndex(s => s.amount === 0 || !s.amount);

  if (lastEmptyIndex !== -1 && remaining > 0) {
    updatedSplits[lastEmptyIndex] = {
      ...updatedSplits[lastEmptyIndex],
      amount: parseFloat(remaining.toFixed(2)),
    };
  }

  return updatedSplits;
}
