import { useMemo } from 'react';
import financialDataRaw from '../data/financial_data.json';
import { FinancialData } from '../types';

export function useFinancialData() {
  const data = useMemo(() => financialDataRaw as FinancialData, []);

  // Calculate total spending
  const totalSpent = useMemo(() => {
    return data.monthly_spending.reduce((sum, month) => sum + Math.abs(month.total_spent), 0);
  }, [data]);

  // Calculate total transactions
  const totalTransactions = useMemo(() => {
    return data.monthly_spending.reduce((sum, month) => sum + month.transaction_count, 0);
  }, [data]);

  // Calculate average transaction
  const avgTransaction = useMemo(() => {
    return totalTransactions > 0 ? totalSpent / totalTransactions : 0;
  }, [totalSpent, totalTransactions]);

  // Get top merchant
  const topMerchant = useMemo(() => {
    if (data.merchant_spending && data.merchant_spending.length > 0) {
      return data.merchant_spending[0].merchant;
    }
    return 'N/A';
  }, [data]);

  // Get primary account
  const primaryAccount = useMemo(() => {
    if (data.account_spending && data.account_spending.length > 0) {
      return data.account_spending[0].account;
    }
    return 'N/A';
  }, [data]);

  // Get latest month spending
  const latestMonthSpending = useMemo(() => {
    if (data.monthly_spending && data.monthly_spending.length > 0) {
      const latest = data.monthly_spending[data.monthly_spending.length - 1];
      return Math.abs(latest.total_spent);
    }
    return 0;
  }, [data]);

  // Top 5 categories
  const topCategories = useMemo(() => {
    return data.category_spending.slice(0, 5);
  }, [data]);

  return {
    data,
    totalSpent,
    totalTransactions,
    avgTransaction,
    topMerchant,
    primaryAccount,
    latestMonthSpending,
    topCategories,
  };
}
