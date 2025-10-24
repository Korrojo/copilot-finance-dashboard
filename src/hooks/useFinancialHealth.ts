import { useMemo } from 'react';
import { useFinancialData } from './useFinancialData';
import { mockTransactions } from '../utils/mockTransactions';
import { useAccounts } from './useAccounts';

export interface FinancialHealthData {
  // Emergency Fund
  emergencyFund: number;
  monthlyExpenses: number;
  emergencyFundMonths: number;

  // Debt
  totalDebt: number;
  totalCreditCardDebt: number;

  // Credit Utilization
  totalCreditLimit: number;
  totalCreditUsed: number;
  creditUtilization: number;

  // Income & Savings
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  savingsRate: number;

  // Payment History
  totalPayments: number;
  onTimePayments: number;
  onTimePaymentRate: number;
}

export function useFinancialHealth(): FinancialHealthData {
  const { data } = useFinancialData();
  const { accounts } = useAccounts();

  return useMemo(() => {
    // Calculate total income and expenses from monthly data
    const totalIncome = data.monthly_spending.reduce((sum, m) => {
      // Positive amounts are income, negative are expenses
      const monthIncome = m.total_spent > 0 ? m.total_spent : 0;
      return sum + monthIncome;
    }, 0);

    const totalExpenses = data.monthly_spending.reduce((sum, m) => {
      // Negative amounts are expenses
      const monthExpense = m.total_spent < 0 ? Math.abs(m.total_spent) : 0;
      return sum + monthExpense;
    }, 0);

    // If we have no income data, estimate based on expenses (income should be higher)
    const estimatedIncome = totalIncome > 0 ? totalIncome : totalExpenses * 1.5;
    const netIncome = estimatedIncome - totalExpenses;
    const savingsRate = estimatedIncome > 0 ? (netIncome / estimatedIncome) * 100 : 0;

    // Calculate monthly average expenses
    const monthlyExpenses = totalExpenses / Math.max(data.monthly_spending.length, 1);

    // Calculate emergency fund from savings accounts
    const savingsAccounts = accounts.filter(acc =>
      acc.type === 'depository' &&
      (acc.name.toLowerCase().includes('saving') || acc.name.toLowerCase().includes('emergency'))
    );
    const emergencyFund = savingsAccounts.reduce((sum, acc) => sum + acc.balance, 0);
    const emergencyFundMonths = monthlyExpenses > 0 ? emergencyFund / monthlyExpenses : 0;

    // Calculate total debt from credit accounts
    const creditAccounts = accounts.filter(acc => acc.type === 'credit');
    const totalCreditCardDebt = creditAccounts.reduce((sum, acc) => {
      // Credit card balances are typically negative (what you owe)
      return sum + Math.abs(acc.balance);
    }, 0);

    // Add any loan accounts (if they exist in the future)
    const totalDebt = totalCreditCardDebt;

    // Calculate credit utilization
    const totalCreditLimit = creditAccounts.reduce((sum, acc) => {
      // Assuming credit limit is 3x the current balance (adjust as needed)
      // In real implementation, this would come from account metadata
      return sum + Math.abs(acc.balance) * 3;
    }, 0);

    const totalCreditUsed = totalCreditCardDebt;
    const creditUtilization = totalCreditLimit > 0
      ? (totalCreditUsed / totalCreditLimit) * 100
      : 0;

    // Calculate payment history from transactions
    // Count transactions that look like bill payments or recurring charges
    const paymentTransactions = mockTransactions.filter(t =>
      t.status === 'posted' || t.status === 'cleared'
    );

    const totalPayments = paymentTransactions.length;
    const onTimePayments = paymentTransactions.filter(t =>
      t.status === 'posted' || t.status === 'cleared'
    ).length;

    // Assume 98% on-time rate if we have limited data
    const onTimePaymentRate = totalPayments > 0
      ? (onTimePayments / totalPayments) * 100
      : 98;

    return {
      emergencyFund,
      monthlyExpenses,
      emergencyFundMonths,
      totalDebt,
      totalCreditCardDebt,
      totalCreditLimit,
      totalCreditUsed,
      creditUtilization,
      totalIncome: estimatedIncome,
      totalExpenses,
      netIncome,
      savingsRate,
      totalPayments,
      onTimePayments,
      onTimePaymentRate,
    };
  }, [data, accounts]);
}
