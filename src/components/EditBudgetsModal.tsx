import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { BUDGET_TEMPLATES } from '../types/budget';
import { useFinancialData } from '../hooks/useFinancialData';

interface EditBudgetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (budgets: Array<{ category: string; amount: number }>) => void;
  currentBudgets: Array<{ category: string; amount: number }>;
}

export function EditBudgetsModal({
  isOpen,
  onClose,
  onSave,
  currentBudgets,
}: EditBudgetsModalProps) {
  const { data } = useFinancialData();
  const [budgets, setBudgets] = useState(currentBudgets);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [totalIncome, setTotalIncome] = useState('5000');

  // Get all available categories
  const availableCategories = Array.from(
    new Set(data.category_spending.map((cat) => cat.category))
  );

  if (!isOpen) return null;

  const handleAddBudget = () => {
    const unusedCategory = availableCategories.find(
      (cat) => !budgets.some((b) => b.category === cat)
    );
    if (unusedCategory) {
      setBudgets([...budgets, { category: unusedCategory, amount: 0 }]);
    }
  };

  const handleRemoveBudget = (index: number) => {
    setBudgets(budgets.filter((_, i) => i !== index));
  };

  const handleUpdateBudget = (index: number, field: 'category' | 'amount', value: string | number) => {
    const updated = [...budgets];
    if (field === 'amount') {
      updated[index].amount = typeof value === 'string' ? parseFloat(value) || 0 : value;
    } else {
      updated[index].category = value as string;
    }
    setBudgets(updated);
  };

  const handleApplyTemplate = () => {
    const template = BUDGET_TEMPLATES.find((t) => t.id === selectedTemplate);
    if (!template) return;

    const income = parseFloat(totalIncome) || 5000;
    const newBudgets = Object.entries(template.allocations).map(([category, percentage]) => ({
      category,
      amount: (income * percentage) / 100,
    }));
    setBudgets(newBudgets);
  };

  const handleSave = () => {
    onSave(budgets.filter((b) => b.amount > 0));
    onClose();
  };

  const totalBudgeted = budgets.reduce((sum, b) => sum + b.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-[#0a0e1a] rounded-xl border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">Edit Budgets</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Budget Template Selector */}
          <div className="mb-6 p-4 bg-[#141824] rounded-lg border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Start with Template</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Select Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="w-full bg-[#0a0e1a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                >
                  <option value="">Choose a template...</option>
                  {BUDGET_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Monthly Income</label>
                <input
                  type="number"
                  value={totalIncome}
                  onChange={(e) => setTotalIncome(e.target.value)}
                  className="w-full bg-[#0a0e1a] text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  placeholder="5000"
                />
              </div>
            </div>
            {selectedTemplate && (
              <div className="mb-4">
                <p className="text-sm text-gray-400">
                  {BUDGET_TEMPLATES.find((t) => t.id === selectedTemplate)?.description}
                </p>
              </div>
            )}
            <button
              onClick={handleApplyTemplate}
              disabled={!selectedTemplate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Apply Template
            </button>
          </div>

          {/* Budget List */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Category Budgets</h3>
              <button
                onClick={handleAddBudget}
                className="flex items-center gap-2 px-4 py-2 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-3">
              {budgets.map((budget, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-[#141824] rounded-lg border border-gray-800"
                >
                  <select
                    value={budget.category}
                    onChange={(e) => handleUpdateBudget(index, 'category', e.target.value)}
                    className="flex-1 bg-[#0a0e1a] text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                  >
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      value={budget.amount}
                      onChange={(e) => handleUpdateBudget(index, 'amount', e.target.value)}
                      className="w-32 bg-[#0a0e1a] text-white pl-7 pr-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveBudget(index)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-[#141824] rounded-lg border border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Budgeted</span>
              <span className="text-2xl font-bold text-white">
                ${totalBudgeted.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#141824] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Budgets
          </button>
        </div>
      </div>
    </div>
  );
}
