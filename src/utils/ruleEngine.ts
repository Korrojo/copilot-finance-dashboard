import type { Transaction } from '../types';
import type {
  TransactionRule,
  RuleCondition,
  RuleAction,
  RuleConditionOperator,
} from '../types/rules';

/**
 * Evaluate a single condition against a transaction
 */
function evaluateCondition(transaction: Transaction, condition: RuleCondition): boolean {
  const fieldValue = transaction[condition.field as keyof Transaction];
  const conditionValue = condition.value;

  switch (condition.operator) {
    case 'equals':
      return fieldValue === conditionValue;

    case 'notEquals':
      return fieldValue !== conditionValue;

    case 'contains':
      if (typeof fieldValue === 'string' && typeof conditionValue === 'string') {
        return fieldValue.toLowerCase().includes(conditionValue.toLowerCase());
      }
      return false;

    case 'notContains':
      if (typeof fieldValue === 'string' && typeof conditionValue === 'string') {
        return !fieldValue.toLowerCase().includes(conditionValue.toLowerCase());
      }
      return false;

    case 'greaterThan':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue > conditionValue;
      }
      return false;

    case 'lessThan':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue < conditionValue;
      }
      return false;

    case 'greaterThanOrEqual':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue >= conditionValue;
      }
      return false;

    case 'lessThanOrEqual':
      if (typeof fieldValue === 'number' && typeof conditionValue === 'number') {
        return fieldValue <= conditionValue;
      }
      return false;

    default:
      return false;
  }
}

/**
 * Check if a transaction matches a rule's conditions
 */
export function matchesRule(transaction: Transaction, rule: TransactionRule): boolean {
  if (!rule.enabled) return false;
  if (rule.conditions.length === 0) return false;

  if (rule.logic === 'and') {
    // All conditions must be true
    return rule.conditions.every(condition => evaluateCondition(transaction, condition));
  } else {
    // At least one condition must be true
    return rule.conditions.some(condition => evaluateCondition(transaction, condition));
  }
}

/**
 * Apply a rule's actions to a transaction
 */
export function applyRule(transaction: Transaction, rule: TransactionRule): Transaction {
  if (!matchesRule(transaction, rule)) {
    return transaction;
  }

  let updatedTransaction = { ...transaction };

  rule.actions.forEach(action => {
    updatedTransaction = applyAction(updatedTransaction, action);
  });

  return updatedTransaction;
}

/**
 * Apply a single action to a transaction
 */
function applyAction(transaction: Transaction, action: RuleAction): Transaction {
  const updated = { ...transaction };

  switch (action.type) {
    case 'setCategory':
      updated.category = action.value;
      break;

    case 'addTag':
      if (!updated.tags) {
        updated.tags = [];
      }
      if (!updated.tags.includes(action.value)) {
        updated.tags = [...updated.tags, action.value];
      }
      break;

    case 'setStatus':
      updated.status = action.value as Transaction['status'];
      break;

    case 'assignGoal':
      updated.goalId = action.value;
      break;

    case 'markRecurring':
      updated.isRecurring = true;
      updated.recurringId = action.value;
      break;
  }

  return updated;
}

/**
 * Apply all enabled rules to a transaction
 */
export function applyRules(transaction: Transaction, rules: TransactionRule[]): Transaction {
  let updatedTransaction = transaction;

  // Sort rules by priority (can be extended later)
  const enabledRules = rules.filter(rule => rule.enabled);

  for (const rule of enabledRules) {
    updatedTransaction = applyRule(updatedTransaction, rule);
  }

  return updatedTransaction;
}

/**
 * Apply rules to multiple transactions
 */
export function applyRulesToTransactions(
  transactions: Transaction[],
  rules: TransactionRule[]
): Transaction[] {
  return transactions.map(transaction => applyRules(transaction, rules));
}

/**
 * Find all rules that match a transaction
 */
export function findMatchingRules(
  transaction: Transaction,
  rules: TransactionRule[]
): TransactionRule[] {
  return rules.filter(rule => matchesRule(transaction, rule));
}

/**
 * Validate a rule's conditions
 */
export function validateRule(rule: TransactionRule): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!rule.name || rule.name.trim().length === 0) {
    errors.push('Rule name is required');
  }

  if (rule.conditions.length === 0) {
    errors.push('At least one condition is required');
  }

  rule.conditions.forEach((condition, index) => {
    if (!condition.field) {
      errors.push(`Condition ${index + 1}: Field is required`);
    }
    if (!condition.operator) {
      errors.push(`Condition ${index + 1}: Operator is required`);
    }
    if (condition.value === undefined || condition.value === '') {
      errors.push(`Condition ${index + 1}: Value is required`);
    }
  });

  if (rule.actions.length === 0) {
    errors.push('At least one action is required');
  }

  rule.actions.forEach((action, index) => {
    if (!action.type) {
      errors.push(`Action ${index + 1}: Type is required`);
    }
    if (!action.value || action.value.trim().length === 0) {
      errors.push(`Action ${index + 1}: Value is required`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Get human-readable description of a condition
 */
export function formatCondition(condition: RuleCondition): string {
  const operatorLabels: Record<RuleConditionOperator, string> = {
    equals: 'equals',
    notEquals: 'does not equal',
    contains: 'contains',
    notContains: 'does not contain',
    greaterThan: 'is greater than',
    lessThan: 'is less than',
    greaterThanOrEqual: 'is greater than or equal to',
    lessThanOrEqual: 'is less than or equal to',
  };

  return `${condition.field} ${operatorLabels[condition.operator]} "${condition.value}"`;
}

/**
 * Get human-readable description of an action
 */
export function formatAction(action: RuleAction): string {
  const actionLabels: Record<RuleAction['type'], string> = {
    setCategory: 'Set category to',
    addTag: 'Add tag',
    setStatus: 'Set status to',
    assignGoal: 'Assign to goal',
    markRecurring: 'Mark as recurring',
  };

  return `${actionLabels[action.type]} "${action.value}"`;
}
