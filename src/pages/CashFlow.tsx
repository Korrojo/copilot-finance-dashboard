import { useState, useMemo } from 'react';
import { formatCurrency } from '../utils/formatCurrency';
import { IncomeBreakdown } from '../components/IncomeBreakdown';
import { SpendingBreakdown } from '../components/SpendingBreakdown';
import { CashFlowForecast } from '../components/CashFlowForecast';
import { DateRangeSelector, getDateRangeFromPreset, type DateRange } from '../components/DateRangeSelector';
import { ComparisonSelector, getComparisonPeriod, type ComparisonPeriod } from '../components/ComparisonSelector';
import { CashFlowSummaryCard } from '../components/CashFlowSummaryCard';
import { SavingsRateCard } from '../components/SavingsRateCard';
import { CashFlowComboChart } from '../components/CashFlowComboChart';
import { SpendingStackedChart } from '../components/SpendingStackedChart';
import { GranularitySelector, type TimeGranularity } from '../components/GranularitySelector';
import { useCashFlowData } from '../hooks/useCashFlowData';
import { useFinancialData } from '../hooks/useFinancialData';

export function CashFlow() {
  const { data } = useFinancialData();
  const [dateRange, setDateRange] = useState<DateRange>(() => getDateRangeFromPreset('last_3_months'));
  const [comparison, setComparison] = useState<ComparisonPeriod>(() =>
    getComparisonPeriod('previous_period', getDateRangeFromPreset('last_3_months'))
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [granularity, setGranularity] = useState<TimeGranularity>('monthly');

  const cashFlowData = useCashFlowData(dateRange, comparison);

  // Format date range for display
  const dateRangeText = `${dateRange.start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })} - ${dateRange.end.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;

  // Mock income sources based on total
  const incomeSources = useMemo(() => [
    { source: 'Salary', amount: cashFlowData.current.totalIncome * 0.75, percentage: 75, change: 2.5 },
    { source: 'Freelance', amount: cashFlowData.current.totalIncome * 0.15, percentage: 15, change: 12.3 },
    { source: 'Investment', amount: cashFlowData.current.totalIncome * 0.08, percentage: 8, change: -3.2 },
    { source: 'Other', amount: cashFlowData.current.totalIncome * 0.02, percentage: 2, change: 0 },
  ], [cashFlowData.current.totalIncome]);

  // Spending by category with colors
  const spendingCategories = useMemo(() => {
    const hexColors = [
      '#ef4444', '#3b82f6', '#eab308', '#22c55e',
      '#a855f7', '#ec4899', '#f97316', '#14b8a6',
    ];
    return data.category_spending.map((cat, index) => {
      const bgColors = [
        'bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500',
        'bg-purple-500', 'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
      ];
      const amount = Math.abs(cat.amount);
      return {
        category: cat.category,
        amount,
        percentage: (amount / cashFlowData.current.totalSpending) * 100,
        budget: cat.budget,
        color: bgColors[index % bgColors.length],
        hexColor: hexColors[index % hexColors.length],
      };
    }).sort((a, b) => b.amount - a.amount).slice(0, 8);
  }, [data.category_spending, cashFlowData.current.totalSpending]);

  // Format categories for stacked chart (needs hex colors and simplified structure)
  const stackedChartCategories = useMemo(() => {
    const allCategories = spendingCategories.map(cat => ({
      category: cat.category,
      amount: cat.amount,
      color: cat.hexColor,
    }));

    // If a category is selected, filter to show only that category
    if (selectedCategory) {
      return allCategories.filter(cat => cat.category === selectedCategory);
    }

    return allCategories;
  }, [spendingCategories, selectedCategory]);

  // Handle category filter toggle
  const handleCategoryClick = (category: string) => {
    // Toggle: if clicking the same category, clear filter; otherwise set new filter
    setSelectedCategory(prev => prev === category ? null : category);
  };

  // Calculate effective granularity based on date range
  const effectiveGranularity = useMemo(() => {
    const daysDiff = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));

    // Auto-adjust granularity based on date range
    if (granularity === 'daily' && daysDiff > 60) {
      // If daily selected but range > 2 months, use weekly instead
      return 'weekly';
    } else if (granularity === 'daily' && daysDiff > 31) {
      // If daily selected but range > 1 month, limit to last 31 days only
      return 'daily-limited';
    } else if (granularity === 'weekly' && daysDiff > 365) {
      // If weekly selected but range > 1 year, use monthly instead
      return 'monthly';
    }

    return granularity;
  }, [granularity, dateRange]);

  // Transform data based on effective granularity
  const granularData = useMemo(() => {
    if (effectiveGranularity === 'monthly') {
      return cashFlowData.monthlyData;
    }

    // For daily/weekly, we'll simulate by splitting monthly data
    // In a real app, this would aggregate from transaction-level data
    const result: Array<{ month: string; income: number; spending: number; net: number }> = [];

    // For daily-limited, only use last month of data
    const monthsToProcess = effectiveGranularity === 'daily-limited'
      ? cashFlowData.monthlyData.slice(-1)
      : cashFlowData.monthlyData;

    monthsToProcess.forEach((monthData) => {
      if (effectiveGranularity === 'weekly') {
        // Split each month into ~4 weeks
        const weeksInMonth = 4;
        for (let week = 1; week <= weeksInMonth; week++) {
          result.push({
            month: `${monthData.month} W${week}`,
            income: monthData.income / weeksInMonth,
            spending: monthData.spending / weeksInMonth,
            net: monthData.net / weeksInMonth,
          });
        }
      } else if (effectiveGranularity === 'daily' || effectiveGranularity === 'daily-limited') {
        // Split month into daily values
        const daysInMonth = 30;
        for (let day = 1; day <= daysInMonth; day++) {
          result.push({
            month: `${monthData.month} Day ${day}`,
            income: monthData.income / daysInMonth,
            spending: monthData.spending / daysInMonth,
            net: monthData.net / daysInMonth,
          });
        }
      }
    });

    return result;
  }, [cashFlowData.monthlyData, effectiveGranularity]);

  // Cash flow forecast data
  const forecastData = useMemo(() => {
    const avgMonthlyNet = cashFlowData.current.avgMonthlyNet;
    const result = [];

    // Show last 3 months of actual data
    const actualMonths = cashFlowData.monthlyData.slice(-3);
    actualMonths.forEach((monthData) => {
      result.push({
        month: monthData.month,
        actual: monthData.net,
        isProjected: false,
      });
    });

    // Project next 3 months
    const lastDate = new Date(dateRange.end);
    for (let i = 1; i <= 3; i++) {
      const futureDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + i, 1);
      const monthLabel = futureDate.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });

      result.push({
        month: monthLabel,
        projected: avgMonthlyNet * (1 + (Math.random() - 0.5) * 0.15),
        isProjected: true,
      });
    }

    return result;
  }, [cashFlowData, dateRange]);

  const currentBalance = 25000;

  // Handle date range change and update comparison accordingly
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
    // Auto-update comparison to match new range
    if (comparison.type !== 'none') {
      setComparison(getComparisonPeriod(comparison.type, newRange));
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Cash flow</h1>
            <p className="text-gray-400">{dateRangeText}</p>
          </div>

          {/* Date Range & Comparison Selectors */}
          <div className="flex items-center gap-3">
            <DateRangeSelector value={dateRange} onChange={handleDateRangeChange} />
            <ComparisonSelector
              value={comparison}
              currentRange={dateRange}
              onChange={setComparison}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Net Income Card - Enhanced */}
        <CashFlowSummaryCard
          title="Net Income"
          value={cashFlowData.current.netIncome}
          change={cashFlowData.changes?.netIncomeChange}
          changeLabel={comparison.type !== 'none' ? `vs ${comparison.label.toLowerCase()}` : undefined}
          variant="success"
          sparklineData={cashFlowData.monthlyData.map(m => m.net)}
          stats={[
            { label: 'Avg/Month', value: formatCurrency(cashFlowData.current.avgMonthlyNet) },
          ]}
        />

        {/* Total Income Card - Enhanced */}
        <CashFlowSummaryCard
          title="Total Income"
          value={cashFlowData.current.totalIncome}
          change={cashFlowData.changes?.incomeChange}
          changeLabel={comparison.type !== 'none' ? `vs ${comparison.label.toLowerCase()}` : undefined}
          variant="neutral"
          sparklineData={cashFlowData.monthlyData.map(m => m.income)}
          stats={[
            { label: 'Avg/Month', value: formatCurrency(cashFlowData.current.avgMonthlyIncome) },
            { label: 'Highest', value: formatCurrency(Math.max(...cashFlowData.monthlyData.map(m => m.income))) },
          ]}
        />

        {/* Total Spending Card - Enhanced */}
        <CashFlowSummaryCard
          title="Total Spending"
          value={cashFlowData.current.totalSpending}
          change={cashFlowData.changes?.spendingChange}
          changeLabel={comparison.type !== 'none' ? `vs ${comparison.label.toLowerCase()}` : undefined}
          variant="danger"
          sparklineData={cashFlowData.monthlyData.map(m => m.spending)}
          stats={[
            { label: 'Avg/Month', value: formatCurrency(cashFlowData.current.avgMonthlySpending) },
            { label: 'Highest', value: formatCurrency(Math.max(...cashFlowData.monthlyData.map(m => m.spending))) },
          ]}
        />

        {/* Savings Rate Card */}
        <SavingsRateCard
          savingsRate={cashFlowData.current.savingsRate}
          change={cashFlowData.changes?.savingsRateChange}
          changeLabel={comparison.type !== 'none' ? `vs ${comparison.label.toLowerCase()}` : undefined}
          targetRate={20}
        />
      </div>

      {/* Breakdown Sections - Income & Spending */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <IncomeBreakdown sources={incomeSources} totalIncome={cashFlowData.current.totalIncome} />
        <SpendingBreakdown categories={spendingCategories} totalSpending={cashFlowData.current.totalSpending} />
      </div>

      {/* Cash Flow Forecast */}
      <div className="mb-8">
        <CashFlowForecast
          data={forecastData}
          currentBalance={currentBalance}
          savingsRate={cashFlowData.current.savingsRate}
        />
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Chart Controls */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Charts & Analytics</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Time Period:</span>
            <GranularitySelector value={granularity} onChange={setGranularity} />
          </div>
        </div>

        {/* Granularity Auto-Adjustment Notice */}
        {effectiveGranularity !== granularity && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 flex items-start gap-2">
            <div className="text-blue-400 text-xs">
              <strong>Note:</strong> {
                effectiveGranularity === 'weekly' && granularity === 'daily'
                  ? 'Switched to Weekly view - Daily view works best with date ranges under 2 months.'
                  : effectiveGranularity === 'daily-limited' && granularity === 'daily'
                  ? 'Showing last 30 days only - Daily view is limited to prevent overcrowding.'
                  : effectiveGranularity === 'monthly' && granularity === 'weekly'
                  ? 'Switched to Monthly view - Weekly view works best with date ranges under 1 year.'
                  : ''
              }
            </div>
          </div>
        )}

        {/* Cash Flow Combo Chart - Income, Spending, Net Trend */}
        <CashFlowComboChart data={granularData} height={400} />

        {/* Spending by Category - Stacked Chart */}
        <SpendingStackedChart
          monthlyData={granularData}
          categories={stackedChartCategories}
          height={350}
          enableFilter={true}
          onCategoryClick={handleCategoryClick}
        />

        {/* Active Filter Indicator */}
        {selectedCategory && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded bg-blue-500" />
              <p className="text-sm text-gray-300">
                Filtering by: <span className="font-semibold text-white">{selectedCategory}</span>
              </p>
            </div>
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-sm text-blue-400 hover:text-blue-300 underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
