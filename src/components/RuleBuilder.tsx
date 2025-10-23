import { useState } from 'react';
import { Plus, Trash2, Save, X } from 'lucide-react';
import type { TransactionRule, RuleCondition, RuleAction } from '../types/rules';
import { validateRule } from '../utils/ruleEngine';

interface RuleBuilderProps {
  rule?: TransactionRule;
  onSave: (rule: TransactionRule) => void;
  onCancel: () => void;
}

const FIELD_OPTIONS = [
  { value: 'merchant', label: 'Merchant' },
  { value: 'category', label: 'Category' },
  { value: 'amount', label: 'Amount' },
  { value: 'account', label: 'Account' },
  { value: 'type', label: 'Type' },
  { value: 'status', label: 'Status' },
];

const OPERATOR_OPTIONS = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
  { value: 'notContains', label: 'Does not contain' },
  { value: 'greaterThan', label: 'Greater than' },
  { value: 'lessThan', label: 'Less than' },
];

const ACTION_OPTIONS = [
  { value: 'setCategory', label: 'Set category' },
  { value: 'addTag', label: 'Add tag' },
  { value: 'setStatus', label: 'Set status' },
  { value: 'assignGoal', label: 'Assign to goal' },
  { value: 'markRecurring', label: 'Mark as recurring' },
];

export function RuleBuilder({ rule, onSave, onCancel }: RuleBuilderProps) {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [logic, setLogic] = useState<'and' | 'or'>(rule?.logic || 'and');
  const [conditions, setConditions] = useState<RuleCondition[]>(
    rule?.conditions || [
      { id: '1', field: 'merchant', operator: 'contains', value: '' },
    ]
  );
  const [actions, setActions] = useState<RuleAction[]>(
    rule?.actions || [{ id: '1', type: 'setCategory', value: '' }]
  );
  const [errors, setErrors] = useState<string[]>([]);

  const addCondition = () => {
    setConditions([
      ...conditions,
      {
        id: Date.now().toString(),
        field: 'merchant',
        operator: 'contains',
        value: '',
      },
    ]);
  };

  const removeCondition = (id: string) => {
    if (conditions.length > 1) {
      setConditions(conditions.filter(c => c.id !== id));
    }
  };

  const updateCondition = (id: string, updates: Partial<RuleCondition>) => {
    setConditions(conditions.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const addAction = () => {
    setActions([
      ...actions,
      { id: Date.now().toString(), type: 'setCategory', value: '' },
    ]);
  };

  const removeAction = (id: string) => {
    if (actions.length > 1) {
      setActions(actions.filter(a => a.id !== id));
    }
  };

  const updateAction = (id: string, updates: Partial<RuleAction>) => {
    setActions(actions.map(a => (a.id === id ? { ...a, ...updates } : a)));
  };

  const handleSave = () => {
    const newRule: TransactionRule = {
      id: rule?.id || `rule-${Date.now()}`,
      name,
      description,
      enabled: true,
      logic,
      conditions,
      actions,
      createdAt: rule?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const validation = validateRule(newRule);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors([]);
    onSave(newRule);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Rule Name & Description */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Rule Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Auto-categorize Amazon purchases"
            className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-300 mb-2 block">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what this rule does..."
            rows={2}
            className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>
      </div>

      {/* Conditions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-gray-300">
            Conditions ({conditions.length})
          </label>
          <div className="flex items-center gap-2">
            <select
              value={logic}
              onChange={(e) => setLogic(e.target.value as 'and' | 'or')}
              className="px-2 py-1 bg-[#0a0e1a] border border-gray-700 rounded text-white text-xs focus:outline-none focus:border-blue-500"
            >
              <option value="and">Match ALL</option>
              <option value="or">Match ANY</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {conditions.map((condition) => (
            <div key={condition.id} className="flex items-center gap-2">
              <select
                value={condition.field}
                onChange={(e) =>
                  updateCondition(condition.id, {
                    field: e.target.value as RuleCondition['field'],
                  })
                }
                className="px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {FIELD_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={condition.operator}
                onChange={(e) =>
                  updateCondition(condition.id, {
                    operator: e.target.value as RuleCondition['operator'],
                  })
                }
                className="px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {OPERATOR_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={condition.value}
                onChange={(e) => updateCondition(condition.id, { value: e.target.value })}
                placeholder="Value..."
                className="flex-1 px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />

              <button
                onClick={() => removeCondition(condition.id)}
                disabled={conditions.length === 1}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addCondition}
          className="mt-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Condition
        </button>
      </div>

      {/* Actions */}
      <div>
        <label className="text-sm font-medium text-gray-300 mb-3 block">
          Actions ({actions.length})
        </label>

        <div className="space-y-2">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center gap-2">
              <select
                value={action.type}
                onChange={(e) =>
                  updateAction(action.id, {
                    type: e.target.value as RuleAction['type'],
                  })
                }
                className="px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              >
                {ACTION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={action.value}
                onChange={(e) => updateAction(action.id, { value: e.target.value })}
                placeholder="Value..."
                className="flex-1 px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
              />

              <button
                onClick={() => removeAction(action.id)}
                disabled={actions.length === 1}
                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={addAction}
          className="mt-2 px-3 py-2 text-sm text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Action
        </button>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm font-medium text-red-400 mb-2">Please fix the following errors:</p>
          <ul className="text-sm text-red-400 space-y-1 list-disc list-inside">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-800">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2.5 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Rule
        </button>
      </div>
    </div>
  );
}
