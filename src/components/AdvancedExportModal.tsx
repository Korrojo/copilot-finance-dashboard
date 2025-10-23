import { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, FileJson, Check } from 'lucide-react';
import type { Transaction } from '../types';

interface AdvancedExportModalProps {
  isOpen: boolean;
  transactions: Transaction[];
  onClose: () => void;
}

type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

const EXPORT_FORMATS: { value: ExportFormat; label: string; icon: typeof FileText }[] = [
  { value: 'csv', label: 'CSV', icon: FileText },
  { value: 'json', label: 'JSON', icon: FileJson },
  { value: 'xlsx', label: 'Excel (XLSX)', icon: FileSpreadsheet },
  { value: 'pdf', label: 'PDF', icon: FileText },
];

const COLUMNS = [
  { key: 'date', label: 'Date' },
  { key: 'merchant', label: 'Merchant' },
  { key: 'amount', label: 'Amount' },
  { key: 'category', label: 'Category' },
  { key: 'account', label: 'Account' },
  { key: 'status', label: 'Status' },
  { key: 'type', label: 'Type' },
  { key: 'notes', label: 'Notes' },
  { key: 'tags', label: 'Tags' },
];

export function AdvancedExportModal({
  isOpen,
  transactions,
  onClose,
}: AdvancedExportModalProps) {
  const [format, setFormat] = useState<ExportFormat>('csv');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    COLUMNS.slice(0, 5).map(c => c.key)
  );
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  });
  const [applyFilters, setApplyFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const toggleColumn = (column: string) => {
    setSelectedColumns(prev =>
      prev.includes(column)
        ? prev.filter(c => c !== column)
        : [...prev, column]
    );
  };

  const selectAllColumns = () => {
    setSelectedColumns(COLUMNS.map(c => c.key));
  };

  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };

  const handleExport = async () => {
    setIsExporting(true);

    // Filter transactions by date range if specified
    let filteredTransactions = transactions;
    if (dateRange.start && dateRange.end) {
      filteredTransactions = transactions.filter(t => {
        return t.date >= dateRange.start && t.date <= dateRange.end;
      });
    }

    // Generate export data
    const exportData = filteredTransactions.map(transaction => {
      const row: Record<string, unknown> = {};
      selectedColumns.forEach(col => {
        row[col] = transaction[col as keyof Transaction];
      });
      return row;
    });

    // Export based on format
    switch (format) {
      case 'csv':
        exportToCSV(exportData, selectedColumns);
        break;
      case 'json':
        exportToJSON(exportData);
        break;
      case 'xlsx':
        // In production, use a library like xlsx or exceljs
        alert('Excel export would use a library like xlsx');
        break;
      case 'pdf':
        // In production, use a library like jsPDF
        alert('PDF export would use a library like jsPDF');
        break;
    }

    setIsExporting(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-[#141824] rounded-xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-fade-in-up">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">Export Transactions</h2>
              <p className="text-sm text-gray-400">
                {transactions.length} total transactions available
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {EXPORT_FORMATS.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => setFormat(value)}
                  className={`p-4 rounded-lg border transition-all ${
                    format === value
                      ? 'bg-blue-600/10 border-blue-600'
                      : 'bg-[#0a0e1a] border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        format === value ? 'text-blue-400' : 'text-gray-400'
                      }`}
                    />
                    <span className={format === value ? 'text-white' : 'text-gray-300'}>
                      {label}
                    </span>
                    {format === value && <Check className="w-4 h-4 text-blue-400 ml-auto" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                Select Columns ({selectedColumns.length}/{COLUMNS.length})
              </label>
              <div className="flex gap-2">
                <button
                  onClick={selectAllColumns}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Select All
                </button>
                <span className="text-gray-600">|</span>
                <button
                  onClick={deselectAllColumns}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  Deselect All
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {COLUMNS.map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-3 bg-[#0a0e1a] border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedColumns.includes(key)}
                    onChange={() => toggleColumn(key)}
                    className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                  />
                  <span className="text-sm text-gray-300">{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-sm font-medium text-gray-300 mb-3 block">
              Date Range (Optional)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Start Date</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">End Date</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 bg-[#0a0e1a] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Apply Filters Toggle */}
          <label className="flex items-center gap-3 p-4 bg-[#0a0e1a] border border-gray-700 rounded-lg cursor-pointer hover:border-gray-600 transition-colors">
            <input
              type="checkbox"
              checked={applyFilters}
              onChange={(e) => setApplyFilters(e.target.checked)}
              className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
            />
            <div>
              <p className="text-sm font-medium text-gray-300">Apply current filters</p>
              <p className="text-xs text-gray-500">Export only visible filtered transactions</p>
            </div>
          </label>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-[#0a0e1a] text-gray-300 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedColumns.length === 0}
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isExporting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export {format.toUpperCase()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Helper functions for export
function exportToCSV(data: Record<string, unknown>[], columns: string[]) {
  const headers = columns.join(',');
  const rows = data.map(row =>
    columns.map(col => {
      const value = row[col];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );

  const csv = [headers, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function exportToJSON(data: Record<string, unknown>[]) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
