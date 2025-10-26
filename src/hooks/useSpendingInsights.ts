import { useMemo } from 'react';
import { useFinancialData } from './useFinancialData';
import { mockTransactions } from '../utils/mockTransactions';

export interface SpendingInsight {
  id: string;
  type: 'warning' | 'success' | 'info' | 'tip';
  title: string;
  description: string;
  action?: string;
  impact?: 'high' | 'medium' | 'low';
}

export function useSpendingInsights() {
  const { data } = useFinancialData();

  const insights = useMemo(() => {
    const results: SpendingInsight[] = [];

    // Analyze category spending patterns
    const categoryData = data.category_spending;

    // Check for high spending categories
    const totalSpending = categoryData.reduce((sum, cat) => sum + Math.abs(cat.amount), 0);
    categoryData.forEach((cat) => {
      const percentage = (Math.abs(cat.amount) / totalSpending) * 100;

      if (percentage > 30) {
        results.push({
          id: `high-category-${cat.category}`,
          type: 'warning',
          title: `High ${cat.category} Spending`,
          description: `${cat.category} represents ${percentage.toFixed(1)}% of your total spending. Consider reviewing subscriptions or finding alternatives.`,
          action: 'Review expenses',
          impact: 'high',
        });
      }

      // Check budget overruns
      if (cat.budget && Math.abs(cat.amount) > cat.budget) {
        const overrun = ((Math.abs(cat.amount) - cat.budget) / cat.budget) * 100;
        results.push({
          id: `budget-overrun-${cat.category}`,
          type: 'warning',
          title: `${cat.category} Budget Exceeded`,
          description: `You've exceeded your ${cat.category} budget by ${overrun.toFixed(1)}%. Consider adjusting your budget or reducing spending.`,
          action: 'Adjust budget',
          impact: 'high',
        });
      }
    });

    // Analyze transaction patterns using mockTransactions
    const transactions = mockTransactions;
    const merchantFrequency: Record<string, number> = {};
    const merchantSpending: Record<string, number> = {};

    transactions.forEach((t) => {
      merchantFrequency[t.merchant] = (merchantFrequency[t.merchant] || 0) + 1;
      merchantSpending[t.merchant] = (merchantSpending[t.merchant] || 0) + Math.abs(t.amount);
    });

    // Find frequent small purchases
    Object.entries(merchantFrequency).forEach(([merchant, count]) => {
      if (count >= 10) {
        const avgAmount = merchantSpending[merchant] / count;
        if (avgAmount < 10) {
          results.push({
            id: `frequent-small-${merchant}`,
            type: 'tip',
            title: `Frequent Small Purchases at ${merchant}`,
            description: `You've made ${count} purchases at ${merchant} averaging $${avgAmount.toFixed(2)}. These add up to $${merchantSpending[merchant].toFixed(2)}.`,
            action: 'Consider reducing frequency',
            impact: 'medium',
          });
        }
      }
    });

    // Analyze monthly trends
    const monthlyData = data.monthly_spending;
    if (monthlyData.length >= 2) {
      const lastMonth = Math.abs(monthlyData[monthlyData.length - 1].total_spent);
      const prevMonth = Math.abs(monthlyData[monthlyData.length - 2].total_spent);
      const change = ((lastMonth - prevMonth) / prevMonth) * 100;

      if (change > 20) {
        results.push({
          id: 'spending-spike',
          type: 'warning',
          title: 'Spending Spike Detected',
          description: `Your spending increased by ${change.toFixed(1)}% compared to last month. Review recent purchases to identify the cause.`,
          action: 'Review transactions',
          impact: 'high',
        });
      } else if (change < -15) {
        results.push({
          id: 'spending-decrease',
          type: 'success',
          title: 'Great Progress!',
          description: `You reduced your spending by ${Math.abs(change).toFixed(1)}% compared to last month. Keep up the good work!`,
          impact: 'high',
        });
      }
    }

    // Check for potential savings
    const diningSpending = categoryData.find(c => c.category === 'Dining')?.amount || 0;
    if (Math.abs(diningSpending) > 500) {
      results.push({
        id: 'dining-savings',
        type: 'tip',
        title: 'Dining Out Opportunity',
        description: `You spent $${Math.abs(diningSpending).toFixed(2)} on dining. Cooking at home more often could save you $${(Math.abs(diningSpending) * 0.5).toFixed(2)}/month.`,
        action: 'Plan home meals',
        impact: 'medium',
      });
    }

    // Check for subscription optimization
    const subscriptionSpending = categoryData.find(c => c.category === 'Subscriptions')?.amount || 0;
    if (Math.abs(subscriptionSpending) > 100) {
      results.push({
        id: 'subscription-audit',
        type: 'tip',
        title: 'Subscription Audit Recommended',
        description: `You're spending $${Math.abs(subscriptionSpending).toFixed(2)}/month on subscriptions. Review and cancel unused services.`,
        action: 'Audit subscriptions',
        impact: 'medium',
      });
    }

    // Positive reinforcement for good behavior
    const savingsRate = ((totalSpending * 0.5) / (totalSpending * 1.5)) * 100;
    if (savingsRate >= 20) {
      results.push({
        id: 'savings-rate-good',
        type: 'success',
        title: 'Excellent Savings Rate',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. You're on track to meet your financial goals!`,
        impact: 'high',
      });
    }

    return results;
  }, [data]);

  return insights;
}
