import { useMemo } from 'react';
import { useFinancialData } from './useFinancialData';
import type { DateRange } from '../components/DateRangeSelector';
import type { ComparisonPeriod } from '../components/ComparisonSelector';

export interface CashFlowMetrics {
  netIncome: number;
  totalIncome: number;
  totalSpending: number;
  savingsRate: number;
  avgMonthlyIncome: number;
  avgMonthlySpending: number;
  avgMonthlyNet: number;
}

export interface ComparisonMetrics {
  netIncomeChange: number;
  incomeChange: number;
  spendingChange: number;
  savingsRateChange: number;
}

export interface CashFlowData {
  current: CashFlowMetrics;
  comparison?: CashFlowMetrics;
  changes?: ComparisonMetrics;
  monthlyData: Array<{
    month: string;
    income: number;
    spending: number;
    net: number;
  }>;
}

function isDateInRange(date: Date, start: Date, end: Date): boolean {
  return date >= start && date <= end;
}

function calculateMetrics(
  transactions: Array<{ date: string; amount: number; type: string }>,
  start: Date,
  end: Date
): CashFlowMetrics {
  const filtered = transactions.filter((t) => {
    const transDate = new Date(t.date);
    return isDateInRange(transDate, start, end);
  });

  const totalIncome = filtered
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpending = Math.abs(
    filtered
      .filter((t) => t.amount < 0)
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const netIncome = totalIncome - totalSpending;
  const savingsRate = totalIncome > 0 ? (netIncome / totalIncome) * 100 : 0;

  // Calculate monthly averages
  const months = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44);
  const monthsCount = Math.max(1, Math.ceil(months));

  return {
    netIncome,
    totalIncome,
    totalSpending,
    savingsRate,
    avgMonthlyIncome: totalIncome / monthsCount,
    avgMonthlySpending: totalSpending / monthsCount,
    avgMonthlyNet: netIncome / monthsCount,
  };
}

export function useCashFlowData(
  dateRange: DateRange,
  comparison?: ComparisonPeriod
): CashFlowData {
  const { data } = useFinancialData();

  return useMemo(() => {
    // Mock transactions - in real app, use actual transaction data
    // Convert monthly_spending to transaction-like format
    const transactions = data.monthly_spending.flatMap((month) => {
      // Parse YYYY-MM date format and add day
      const monthDate = `${month.date}-15`; // Use middle of month
      const spending = Math.abs(month.total_spent);

      return [
        {
          date: monthDate,
          amount: spending * 1.3, // Mock income (130% of spending)
          type: 'income',
        },
        {
          date: monthDate,
          amount: -spending, // Spending (negative)
          type: 'expense',
        },
      ];
    });

    // Calculate current period metrics
    const current = calculateMetrics(transactions, dateRange.start, dateRange.end);

    // Calculate comparison period metrics if selected
    let comparisonMetrics: CashFlowMetrics | undefined;
    let changes: ComparisonMetrics | undefined;

    if (comparison && comparison.type !== 'none' && comparison.start && comparison.end) {
      comparisonMetrics = calculateMetrics(transactions, comparison.start, comparison.end);

      // Calculate percentage changes
      changes = {
        netIncomeChange:
          comparisonMetrics.netIncome !== 0
            ? ((current.netIncome - comparisonMetrics.netIncome) / Math.abs(comparisonMetrics.netIncome)) * 100
            : 0,
        incomeChange:
          comparisonMetrics.totalIncome !== 0
            ? ((current.totalIncome - comparisonMetrics.totalIncome) / comparisonMetrics.totalIncome) * 100
            : 0,
        spendingChange:
          comparisonMetrics.totalSpending !== 0
            ? ((current.totalSpending - comparisonMetrics.totalSpending) / comparisonMetrics.totalSpending) * 100
            : 0,
        savingsRateChange: current.savingsRate - comparisonMetrics.savingsRate,
      };
    }

    // Generate monthly data for charts
    const monthlyData: Array<{ month: string; income: number; spending: number; net: number }> = [];
    const currentDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    while (currentDate <= endDate) {
      const monthKey = currentDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return isDateInRange(tDate, monthStart, monthEnd);
      });

      const income = monthTransactions
        .filter((t) => t.amount > 0)
        .reduce((sum, t) => sum + t.amount, 0);

      const spending = Math.abs(
        monthTransactions
          .filter((t) => t.amount < 0)
          .reduce((sum, t) => sum + t.amount, 0)
      );

      monthlyData.push({
        month: monthKey,
        income,
        spending,
        net: income - spending,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      current,
      comparison: comparisonMetrics,
      changes,
      monthlyData,
    };
  }, [data, dateRange, comparison]);
}
