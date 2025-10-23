import { useState } from 'react';
import { FileText, Download, Tag } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency } from '../utils/formatCurrency';

type TaxCategory = 'business-expense' | 'charitable' | 'medical' | 'home-office' | 'education' | 'investment';

interface TaxCategoryData {
  category: TaxCategory;
  label: string;
  description: string;
  total: number;
  transactions: number;
  deductible: number;
  color: string;
}

const TAX_CATEGORIES: Record<TaxCategory, { label: string; description: string; deductionRate: number; color: string }> = {
  'business-expense': {
    label: 'Business Expenses',
    description: 'Meals, travel, supplies, software',
    deductionRate: 1.0,
    color: 'bg-blue-500',
  },
  'charitable': {
    label: 'Charitable Donations',
    description: 'Non-profit contributions',
    deductionRate: 1.0,
    color: 'bg-green-500',
  },
  'medical': {
    label: 'Medical Expenses',
    description: 'Healthcare costs above 7.5% AGI',
    deductionRate: 0.5, // Simplified
    color: 'bg-red-500',
  },
  'home-office': {
    label: 'Home Office',
    description: 'Utilities, internet, rent portion',
    deductionRate: 0.3, // Simplified
    color: 'bg-purple-500',
  },
  'education': {
    label: 'Education',
    description: 'Courses, books, training',
    deductionRate: 1.0,
    color: 'bg-yellow-500',
  },
  'investment': {
    label: 'Investment Fees',
    description: 'Advisory fees, trading costs',
    deductionRate: 1.0,
    color: 'bg-pink-500',
  },
};

export function TaxCategoryTracker() {
  const { data } = useFinancialData();
  const [selectedYear] = useState(2025);

  // Mock tax categorization of transactions
  const taxData: TaxCategoryData[] = Object.entries(TAX_CATEGORIES).map(([key, config]) => {
    // In a real app, transactions would be tagged with tax categories
    const mockTotal = Math.random() * 5000 + 500;
    const mockTransactions = Math.floor(Math.random() * 20 + 5);

    return {
      category: key as TaxCategory,
      label: config.label,
      description: config.description,
      total: mockTotal,
      transactions: mockTransactions,
      deductible: mockTotal * config.deductionRate,
      color: config.color,
    };
  });

  const totalDeductible = taxData.reduce((sum, cat) => sum + cat.deductible, 0);
  const totalTracked = taxData.reduce((sum, cat) => sum + cat.total, 0);
  const estimatedTaxSavings = totalDeductible * 0.22; // Assuming 22% tax bracket

  const exportTaxReport = () => {
    const report = {
      year: selectedYear,
      generatedAt: new Date().toISOString(),
      summary: {
        totalDeductible,
        totalTracked,
        estimatedTaxSavings,
      },
      categories: taxData,
      transactions: (data.transactions || []).slice(0, 50).map(t => ({
        ...t,
        taxCategory: 'business-expense', // Mock
        deductible: true,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tax-report-${selectedYear}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Tax Category Tracker</h3>
        </div>
        <select
          value={selectedYear}
          className="px-3 py-1.5 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
          <option value={2023}>2023</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-500 mb-1">Total Deductible</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalDeductible)}</p>
          <p className="text-xs text-gray-500 mt-1">From {taxData.length} categories</p>
        </div>
        <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-500 mb-1">Estimated Tax Savings</p>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(estimatedTaxSavings)}</p>
          <p className="text-xs text-gray-500 mt-1">At 22% tax bracket</p>
        </div>
        <div className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-500 mb-1">Total Tracked</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalTracked)}</p>
          <p className="text-xs text-gray-500 mt-1">
            {taxData.reduce((sum, cat) => sum + cat.transactions, 0)} transactions
          </p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="space-y-3 mb-6">
        {taxData.map((cat) => {
          const deductionPercentage = (cat.deductible / cat.total) * 100;

          return (
            <div key={cat.category} className="bg-[#0a0e1a] rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-1 h-12 rounded-full ${cat.color}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-white">{cat.label}</h4>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-white">{formatCurrency(cat.total)}</p>
                      <p className="text-xs text-gray-500">{cat.transactions} transactions</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">{cat.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-400">Deductible Amount</span>
                <span className="font-semibold text-green-400">{formatCurrency(cat.deductible)}</span>
              </div>

              <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${cat.color} transition-all`}
                  style={{ width: `${deductionPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{deductionPercentage.toFixed(0)}% deductible</p>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={exportTaxReport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Export Tax Report
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors">
          <Tag className="w-4 h-4" />
          Tag Transactions
        </button>
      </div>

      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-xs text-yellow-400">
          <strong>Disclaimer:</strong> This is for informational purposes only. Consult a tax professional for accurate tax advice.
        </p>
      </div>
    </div>
  );
}
