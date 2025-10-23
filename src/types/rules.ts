// Rule types for transaction automation

export type RuleConditionField =
  | 'merchant'
  | 'category'
  | 'amount'
  | 'account'
  | 'type'
  | 'status';

export type RuleConditionOperator =
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'notContains'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual';

export interface RuleCondition {
  id: string;
  field: RuleConditionField;
  operator: RuleConditionOperator;
  value: string | number;
}

export type RuleActionType =
  | 'setCategory'
  | 'addTag'
  | 'setStatus'
  | 'assignGoal'
  | 'markRecurring';

export interface RuleAction {
  id: string;
  type: RuleActionType;
  value: string;
}

export type RuleLogic = 'and' | 'or';

export interface TransactionRule {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  logic: RuleLogic; // How to combine multiple conditions
  conditions: RuleCondition[];
  actions: RuleAction[];
  createdAt: string;
  updatedAt: string;
}
