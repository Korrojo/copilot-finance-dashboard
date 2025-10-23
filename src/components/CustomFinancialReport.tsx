import { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';
import { formatCurrency } from '../utils/formatCurrency';

type ReportType = 'income-expense' | 'category-breakdown' | 'monthly-trends' | 'year-end';
type DateRange = 'last-month' | 'last-quarter' | 'last-year' | 'ytd' | 'custom';

export function CustomFinancialReport() {
  const { data } = useFinancialData();
  const [reportType, setReportType] = useState<ReportType>('income-expense');
  const [dateRange, setDateRange] = useState<DateRange>('last-month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const generateReport = () => {
    const reportData = {
      type: reportType,
      dateRange,
      customDates: dateRange === 'custom' ? { start: customStartDate, end: customEndDate } : null,
      generatedAt: new Date().toISOString(),
      data: getReportData(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-report-${reportType}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generatePDFReport = () => {
    // In a real app, this would generate a PDF
    alert('PDF generation would be implemented with a library like jsPDF or react-pdf');
  };

  const getReportData = () => {
    const totalIncome = data.monthly_spending.reduce((sum, m) => sum + Math.abs(m.total_spent) * 1.5, 0);
    const totalExpenses = data.monthly_spending.reduce((sum, m) => sum + Math.abs(m.total_spent), 0);

    switch (reportType) {
      case 'income-expense':
        return {
          totalIncome,
          totalExpenses,
          netIncome: totalIncome - totalExpenses,
          savingsRate: ((totalIncome - totalExpenses) / totalIncome) * 100,
          monthlyBreakdown: data.monthly_spending.map(m => ({
            month: m.month,
            income: Math.abs(m.total_spent) * 1.5,
            expenses: Math.abs(m.total_spent),
            net: Math.abs(m.total_spent) * 0.5,
          })),
        };

      case 'category-breakdown':
        return {
          categories: data.category_spending.map(c => ({
            name: c.category,
            amount: Math.abs(c.amount),
            percentage: (Math.abs(c.amount) / totalExpenses) * 100,
            budget: c.budget,
            budgetUtilization: c.budget ? (Math.abs(c.amount) / c.budget) * 100 : null,
          })),
          totalSpending: totalExpenses,
        };

      case 'monthly-trends':
        return {
          trends: data.monthly_spending.map((m, i, arr) => ({
            month: m.month,
            spending: Math.abs(m.total_spent),
            change: i > 0 ? ((Math.abs(m.total_spent) - Math.abs(arr[i-1].total_spent)) / Math.abs(arr[i-1].total_spent)) * 100 : 0,
          })),
        };

      case 'year-end':
        return {
          summary: {
            totalIncome,
            totalExpenses,
            netSavings: totalIncome - totalExpenses,
            averageMonthlySpending: totalExpenses / data.monthly_spending.length,
            topCategory: data.category_spending.reduce((max, cat) =>
              Math.abs(cat.amount) > Math.abs(max.amount) ? cat : max
            ).category,
          },
          categories: data.category_spending,
          monthlyData: data.monthly_spending,
        };

      default:
        return {};
    }
  };

  const reportData = getReportData();

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Custom Financial Reports</h3>
      </div>

      {/* Report Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Report Type */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value as ReportType)}
            className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="income-expense">Income vs Expense Report</option>
            <option value="category-breakdown">Category Breakdown</option>
            <option value="monthly-trends">Monthly Trends Analysis</option>
            <option value="year-end">Year-End Summary</option>
          </select>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Date Range</label>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as DateRange)}
            className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="last-month">Last Month</option>
            <option value="last-quarter">Last Quarter</option>
            <option value="last-year">Last Year</option>
            <option value="ytd">Year to Date</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Custom Date Range */}
        {dateRange === 'custom' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Start Date</label>
              <input
                type="date"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">End Date</label>
              <input
                type="date"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      {/* Report Preview */}
      <div className="mb-6 p-4 bg-[#0a0e1a] rounded-lg border border-gray-700">
        <h4 className="text-sm font-semibold text-white mb-3">Report Preview</h4>

        {reportType === 'income-expense' && 'totalIncome' in reportData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500">Total Income</p>
              <p className="text-lg font-semibold text-green-400">{formatCurrency(reportData.totalIncome || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Expenses</p>
              <p className="text-lg font-semibold text-red-400">{formatCurrency(reportData.totalExpenses || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Net Income</p>
              <p className="text-lg font-semibold text-white">{formatCurrency(reportData.netIncome || 0)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Savings Rate</p>
              <p className="text-lg font-semibold text-blue-400">{(reportData.savingsRate || 0).toFixed(1)}%</p>
            </div>
          </div>
        )}

        {reportType === 'category-breakdown' && 'categories' in reportData && reportData.categories && (
          <div className="space-y-2">
            <p className="text-sm text-gray-400 mb-2">Top 5 Categories</p>
            {reportData.categories.slice(0, 5).map((cat: any) => (
              <div key={cat.name} className="flex items-center justify-between">
                <span className="text-sm text-white">{cat.name}</span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{cat.percentage.toFixed(1)}%</span>
                  <span className="text-sm font-semibold text-white">{formatCurrency(cat.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={generateReport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Download className="w-4 h-4" />
          Download JSON
        </button>
        <button
          onClick={generatePDFReport}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <FileText className="w-4 h-4" />
          Generate PDF
        </button>
      </div>
    </div>
  );
}
