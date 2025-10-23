import { useFinancialData } from './useFinancialData';

export function useDataExport() {
  const { data } = useFinancialData();

  const exportToJSON = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      data: {
        transactions: data.transactions,
        monthlySpending: data.monthly_spending,
        categorySpending: data.category_spending,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `financial-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    // Convert transactions to CSV
    const headers = ['Date', 'Merchant', 'Amount', 'Category', 'Account', 'Status', 'Type'];
    const rows = (data.transactions || []).map(t => [
      t.date,
      t.merchant,
      t.amount.toString(),
      t.category,
      t.account,
      t.status || '',
      t.type,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importFromJSON = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const imported = JSON.parse(content);
          resolve(imported);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const importFromCSV = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const lines = content.split('\n');
          const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

          const transactions = lines.slice(1).filter(line => line.trim()).map(line => {
            const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/"/g, '').trim()) || [];
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header.toLowerCase()] = values[index];
            });
            return obj;
          });

          resolve(transactions);
        } catch (error) {
          reject(new Error('Invalid CSV file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  return {
    exportToJSON,
    exportToCSV,
    importFromJSON,
    importFromCSV,
  };
}
