import { useState } from 'react';
import { Upload, FileJson, FileSpreadsheet } from 'lucide-react';
import { useDataExport } from '../hooks/useDataExport';

export function DataExportImport() {
  const { exportToJSON, exportToCSV, importFromJSON, importFromCSV } = useDataExport();
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>, type: 'json' | 'csv') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus(null);

    try {
      if (type === 'json') {
        const data = await importFromJSON(file);
        setImportStatus({ type: 'success', message: `Successfully imported ${data.data?.transactions?.length || 0} transactions` });
      } else {
        const transactions = await importFromCSV(file);
        setImportStatus({ type: 'success', message: `Successfully imported ${transactions.length} transactions` });
      }
    } catch (error) {
      setImportStatus({ type: 'error', message: error instanceof Error ? error.message : 'Import failed' });
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-[#141824] rounded-xl p-6 border border-gray-800">
      <h3 className="text-lg font-semibold text-white mb-4">Data Export & Import</h3>

      {/* Export Section */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-3">Export your financial data</p>
        <div className="flex gap-3">
          <button
            onClick={exportToJSON}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <FileJson className="w-5 h-5" />
            Export as JSON
          </button>
          <button
            onClick={exportToCSV}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <FileSpreadsheet className="w-5 h-5" />
            Export as CSV
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div>
        <p className="text-sm text-gray-400 mb-3">Import financial data</p>
        <div className="flex gap-3">
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            Import JSON
            <input
              type="file"
              accept=".json"
              onChange={(e) => handleImport(e, 'json')}
              className="hidden"
              disabled={importing}
            />
          </label>
          <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors cursor-pointer">
            <Upload className="w-5 h-5" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={(e) => handleImport(e, 'csv')}
              className="hidden"
              disabled={importing}
            />
          </label>
        </div>
      </div>

      {/* Status Message */}
      {importStatus && (
        <div className={`mt-4 p-3 rounded-lg ${importStatus.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <p className={`text-sm ${importStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {importStatus.message}
          </p>
        </div>
      )}
    </div>
  );
}
