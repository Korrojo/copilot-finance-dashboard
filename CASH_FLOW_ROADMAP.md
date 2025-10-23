# Cash Flow Page - Enhancement Roadmap

## Analysis of Reference Screenshots

### Copilot Money Features:
1. **Time period selector** - Year to date, Month to date, Last 12 months, Last 3 months, Last 4 weeks
2. **Comparison dropdown** - "compared to Previous period"
3. **Show excluded spend toggle**
4. **Net Income card** - Large amount with percentage change and trend chart
5. **Spend card** - Total spending with percentage change and stacked bar chart by category
6. **Income card** - Total income with percentage change and simple bar chart
7. **Category breakdown on hover** - Shows detailed breakdown when hovering over bar chart

### Monarch Money Features:
1. **Bar chart with trend line** - Green (income) and red (expenses) bars with black trend line overlay
2. **Month selector** - "March 2025" with view options
3. **Summary cards** - Income, Expenses, Total Savings, Savings Rate
4. **Income breakdown** - List with icons, percentages, and horizontal bars
5. **Expenses breakdown** - List with icons, percentages, and horizontal bars
6. **Category/Group/Merchant tabs** - Different views of the data

### Current Implementation:
- Basic 3 summary cards (Net Income, Total Income, Total Spending)
- Period selector (Month/Quarter/Year)
- Income/Spending breakdown components
- Cash flow forecast component
- Two bar charts (Income vs Spending, Net Income Trend)

---

## Enhancement Phases

### Phase 1: Date Range & Comparison (Foundation)
**Goal:** Flexible date selection and period comparison

**Features:**
- [ ] 1.1 Enhanced date range selector
  - Presets: This month, Last month, Last 3 months, Last 12 months, Year to date, Custom
  - Date picker for custom ranges
- [ ] 1.2 Comparison selector
  - Previous period
  - Same period last year
  - Custom comparison
- [ ] 1.3 Update all calculations to use selected date range
- [ ] 1.4 Show date range in header subtitle

**Files:**
- `src/components/DateRangeSelector.tsx` (new)
- `src/components/ComparisonSelector.tsx` (new)
- `src/pages/CashFlow.tsx` (update)
- `src/hooks/useCashFlowData.ts` (new)

---

### Phase 2: Enhanced Summary Cards
**Goal:** More informative summary cards with better visuals

**Features:**
- [ ] 2.1 Redesign Net Income card
  - Larger, more prominent display
  - Mini trend sparkline
  - Better percentage change visualization
  - Color coding (green positive, red negative)
- [ ] 2.2 Enhanced Total Income card
  - Percentage breakdown preview
  - Quick stats (avg per month, highest month)
- [ ] 2.3 Enhanced Total Spending card
  - Percentage breakdown preview
  - Quick stats (avg per month, highest category)
- [ ] 2.4 Add Savings Rate card
  - Large percentage display
  - Progress bar
  - Comparison to target

**Files:**
- `src/components/CashFlowSummaryCard.tsx` (new)
- `src/components/SavingsRateCard.tsx` (new)

---

### Phase 3: Advanced Charts
**Goal:** Rich, interactive charts with detailed insights

**Features:**
- [ ] 3.1 Combo chart (bars + line)
  - Income bars (green)
  - Expense bars (red)
  - Net income trend line (black/white)
  - Hover tooltips with breakdown
- [ ] 3.2 Stacked bar chart for spending
  - Each bar shows category breakdown
  - Color-coded by category
  - Hover shows category details
- [ ] 3.3 Interactive category filter
  - Click category to filter charts
  - Show/hide categories
- [ ] 3.4 Chart time granularity
  - Daily, Weekly, Monthly views
  - Zoom and pan

**Files:**
- `src/components/CashFlowComboChart.tsx` (new)
- `src/components/StackedSpendingChart.tsx` (new)
- `src/utils/chartHelpers.ts` (new)

---

### Phase 4: Detailed Breakdowns
**Goal:** Comprehensive income and expense breakdowns

**Features:**
- [ ] 4.1 Enhanced Income Breakdown
  - Icon for each source
  - Horizontal progress bars
  - Percentage of total
  - Month-over-month change
  - Click to drill down
- [ ] 4.2 Enhanced Spending Breakdown
  - Category icons
  - Horizontal progress bars
  - Budget comparison (if set)
  - Percentage of total
  - Trend indicator
  - Top merchants per category
- [ ] 4.3 Category/Group/Merchant tabs
  - Toggle between different views
  - Maintain sort and filter
- [ ] 4.4 Expandable rows
  - Click category to see transactions
  - Inline transaction list

**Files:**
- `src/components/EnhancedIncomeBreakdown.tsx` (new)
- `src/components/EnhancedSpendingBreakdown.tsx` (new)
- `src/components/BreakdownRow.tsx` (new)

---

### Phase 5: Cash Flow Forecast
**Goal:** Predictive insights and planning

**Features:**
- [ ] 5.1 Enhanced forecast chart
  - Historical data (solid)
  - Projected data (dashed)
  - Confidence intervals
  - Multiple scenarios (optimistic, realistic, pessimistic)
- [ ] 5.2 Forecast adjustments
  - Add expected income
  - Add expected expenses
  - One-time events
- [ ] 5.3 Runway calculator
  - Months until zero
  - Emergency fund coverage
  - Burn rate analysis
- [ ] 5.4 Savings projection
  - Projected balance over time
  - Goal achievement timeline

**Files:**
- `src/components/EnhancedCashFlowForecast.tsx` (new)
- `src/components/ForecastAdjustments.tsx` (new)
- `src/components/RunwayCalculator.tsx` (new)
- `src/utils/forecastEngine.ts` (new)

---

### Phase 6: Insights & Analytics
**Goal:** Actionable insights and trends

**Features:**
- [ ] 6.1 Spending insights
  - Unusual spending alerts
  - Category trends (up/down)
  - Seasonal patterns
- [ ] 6.2 Income insights
  - Income stability score
  - Growth trends
  - Diversification analysis
- [ ] 6.3 Recommendations
  - Savings opportunities
  - Budget adjustments
  - Cash flow optimization tips
- [ ] 6.4 Anomaly detection
  - Highlight outliers
  - Explain deviations

**Files:**
- `src/components/CashFlowInsights.tsx` (new)
- `src/utils/insightEngine.ts` (new)
- `src/utils/anomalyDetection.ts` (new)

---

### Phase 7: Filtering & Customization
**Goal:** User control and personalization

**Features:**
- [ ] 7.1 Advanced filters
  - Include/exclude categories
  - Include/exclude accounts
  - Include/exclude merchants
  - Transaction types (recurring only, one-time only)
- [ ] 7.2 Exclude toggle
  - "Show excluded spend" toggle
  - Manage exclusion rules
- [ ] 7.3 Custom views
  - Save filter combinations
  - Quick view switcher
  - Share views
- [ ] 7.4 Export options
  - CSV export
  - PDF report
  - Chart image export

**Files:**
- `src/components/CashFlowFilters.tsx` (new)
- `src/components/ExclusionManager.tsx` (new)
- `src/hooks/useCashFlowFilters.ts` (new)

---

### Phase 8: Polish & UX
**Goal:** Smooth, polished experience

**Features:**
- [ ] 8.1 Loading states
  - Skeleton loaders
  - Progressive loading
  - Shimmer effects
- [ ] 8.2 Empty states
  - No data messages
  - Helpful illustrations
  - Quick actions
- [ ] 8.3 Animations
  - Chart transitions
  - Card animations
  - Smooth scrolling
- [ ] 8.4 Keyboard shortcuts
  - Navigate date ranges (arrow keys)
  - Quick filters (hotkeys)
  - Export (Cmd+E)
- [ ] 8.5 Responsive design
  - Mobile-optimized charts
  - Touch-friendly controls
  - Adaptive layouts

**Files:**
- `src/components/CashFlowSkeleton.tsx` (new)
- `src/components/CashFlowEmptyState.tsx` (new)
- `src/hooks/useCashFlowKeyboard.ts` (new)

---

## Implementation Priority

### Must Have (MVP):
- Phase 1: Date Range & Comparison
- Phase 2: Enhanced Summary Cards
- Phase 3.1-3.2: Combo chart and stacked bars
- Phase 4.1-4.2: Enhanced breakdowns

### Should Have:
- Phase 3.3-3.4: Interactive filtering
- Phase 4.3-4.4: Tabs and expandable rows
- Phase 5.1-5.2: Enhanced forecast
- Phase 7.1-7.2: Filtering and exclusions

### Nice to Have:
- Phase 5.3-5.4: Runway and projections
- Phase 6: All insights
- Phase 7.3-7.4: Custom views and export
- Phase 8: Polish and UX

---

## Technical Approach

### Data Management:
- Create `useCashFlowData` hook for all calculations
- Centralize date range logic
- Memoize expensive calculations
- Support real-time updates

### Component Structure:
```
CashFlow.tsx (main page)
├── DateRangeSelector
├── ComparisonSelector
├── Summary Cards
│   ├── NetIncomeCard
│   ├── TotalIncomeCard
│   ├── TotalSpendingCard
│   └── SavingsRateCard
├── Charts
│   ├── CashFlowComboChart
│   └── StackedSpendingChart
├── Breakdowns
│   ├── EnhancedIncomeBreakdown
│   └── EnhancedSpendingBreakdown
└── CashFlowForecast
```

### State Management:
- Date range state
- Comparison period state
- Filter state
- Chart interaction state
- Breakdown expansion state

---

## Success Metrics

- All 3 reference designs implemented
- Smooth 60fps animations
- < 200ms filter response time
- Comprehensive test coverage
- Full TypeScript type safety
- Accessible (WCAG AA)
- Mobile responsive

---

## Next Steps

Start with **Phase 1** to build the foundation, then proceed sequentially through the phases.
