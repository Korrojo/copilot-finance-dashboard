# Dashboard Enhancement Plan

**Branch:** `feature/dashboard-enhancement`
**Date:** October 23, 2025
**Status:** Planning - Awaiting Approval

---

## Executive Summary

This plan outlines comprehensive improvements to the Dashboard page to achieve feature parity with Copilot Money and Monarch Money while maintaining our dark theme aesthetic.

**Total Estimated Time:** 3-4 hours
**Priority:** HIGH
**Complexity:** Medium-High

---

## Screenshot Analysis Summary

### Copilot Money Dashboard Features:
✅ Monthly spending with budget progress
✅ Assets/Debt trending card with time selector
✅ Transactions to review with merchant logos
✅ Top categories with visual progress bars
✅ Next two weeks calendar preview
✅ Rich visual hierarchy

### Monarch Money Dashboard Features:
✅ Budget breakdown (Fixed/Flexible/Non-Monthly)
✅ Net worth card with area chart
✅ Spending comparison chart
✅ Goals section with progress tracking
✅ Investment performance snapshot
✅ Clean minimalist design

### Current Local Dashboard:
✅ Monthly spending card
✅ Total spent with sparkline
✅ Average transaction with sparkline
✅ Top merchant card
✅ Primary account card
✅ Monthly spending chart
✅ Top categories with bars
✅ Transactions to review
✅ Next two weeks (showing "No upcoming items")
✅ Upcoming bills

### Gap Analysis:
❌ **Missing:** Assets/Debt trending card
❌ **Missing:** Net Worth card with chart
❌ **Missing:** Budget breakdown (Fixed/Flexible)
❌ **Missing:** Goals section
❌ **Bug:** Budget calculation showing wrong values
❌ **Bug:** Next two weeks showing "No upcoming items"
❌ **Enhancement:** Better merchant logos in transactions
❌ **Enhancement:** More interactive charts
❌ **Enhancement:** Better visual hierarchy

---

## Implementation Plan

### Phase 1: Fix Existing Issues ⚡ CRITICAL
**Priority:** Highest
**Time:** 30 minutes

#### 1.1 Fix Budget Calculation Bug
**Issue:** Dashboard shows "$41.9K over" when it should show under budget
**Root Cause:** Budget amount too low or calculation reversed

**Tasks:**
- [ ] Review budget calculation logic in Dashboard.tsx:45-49
- [ ] Update budgetAmount from 8000 to realistic value (e.g., 50000)
- [ ] Verify budgetLeft calculation is correct
- [ ] Test with actual data to ensure proper "under" vs "over" display
- [ ] Ensure color coding works (green for under, red for over)

**Files Modified:**
- `src/pages/Dashboard.tsx`

#### 1.2 Fix "Next Two Weeks" Showing Empty State
**Issue:** Calendar shows "No upcoming items" for all days
**Root Cause:** upcomingItems array may be empty or dates don't fall in 14-day window

**Tasks:**
- [ ] Review upcomingItems generation in Dashboard.tsx:32-39
- [ ] Check if upcomingBills has data
- [ ] Verify date formatting and filtering in NextTwoWeeksPreview component
- [ ] Add debug logging to see what data is being passed
- [ ] Ensure bills fall within next 14 days
- [ ] Test with mock data that covers the date range

**Files Modified:**
- `src/pages/Dashboard.tsx`
- `src/components/NextTwoWeeksPreview.tsx` (if needed)

---

### Phase 2: Add Assets/Debt Trending Card 🎯 HIGH PRIORITY
**Priority:** High
**Time:** 45 minutes

#### 2.1 Create AssetsDebtCard Component
**Goal:** Match Copilot Money's Assets/Debt card with dual metrics and trend chart

**Features:**
- Large asset value with percentage change (green)
- Large debt value with percentage change (red)
- Interactive line/area chart showing both trends
- Time range selector (1W, 1M, 3M, YTD, 1Y, ALL)
- Hover tooltips showing exact values
- Responsive layout

**Component Structure:**
```typescript
interface AssetsDebtCardProps {
  assets: number;
  assetsChange: number;
  debt: number;
  debtChange: number;
  assetsHistory: Array<{ date: string; value: number }>;
  debtHistory: Array<{ date: string; value: number }>;
}
```

**Visual Design:**
```
┌─────────────────────────────────────────┐
│ • Assets              • Debt            │
│   $576,701              $316,970        │
│   ↑ 45.74%              ↓ 9.43%        │
│                                         │
│ [Chart showing assets (blue) & debt    │
│  (red) trends over time]                │
│                                         │
│ [1W] [1M] [3M] [YTD] [1Y] [ALL] ←──────│
│                              JAN 30     │
└─────────────────────────────────────────┘
```

**Tasks:**
- [ ] Create `src/components/AssetsDebtCard.tsx`
- [ ] Add dual-line chart using Recharts
- [ ] Implement time range selector
- [ ] Calculate percentage changes
- [ ] Add hover tooltips
- [ ] Style to match Copilot Money design
- [ ] Make responsive for mobile

**Data Source:**
- Use existing account data from `useAccounts` hook
- Calculate assets (sum of positive balances)
- Calculate debt (sum of negative balances)
- Generate historical data from monthly changes

**Files Created:**
- `src/components/AssetsDebtCard.tsx`

**Files Modified:**
- `src/pages/Dashboard.tsx` (add component)

---

### Phase 3: Add Net Worth Card 📈 HIGH PRIORITY
**Priority:** High
**Time:** 30 minutes

#### 3.1 Create NetWorthCard Component
**Goal:** Match Monarch Money's net worth card with area chart

**Features:**
- Large net worth value
- Percentage change with color coding
- Area chart with gradient fill
- Time period dropdown (1 month, 3 months, etc.)
- Clean minimalist design

**Component Structure:**
```typescript
interface NetWorthCardProps {
  netWorth: number;
  change: number;
  changePercentage: number;
  history: Array<{ date: string; value: number }>;
  timePeriod: string;
  onTimePeriodChange: (period: string) => void;
}
```

**Visual Design:**
```
┌─────────────────────────────────────┐
│ Net worth    ↓ $129.82 (0%)  [1 mo]│
│                                     │
│ [Area chart with gradient fill     │
│  showing net worth over time]      │
│                                     │
│ Feb 28  Mar 6   Mar 12   Mar 28    │
└─────────────────────────────────────┘
```

**Tasks:**
- [ ] Create `src/components/NetWorthCard.tsx`
- [ ] Add area chart with Recharts
- [ ] Implement gradient fill
- [ ] Add time period selector
- [ ] Calculate net worth from accounts
- [ ] Style to match theme
- [ ] Add responsive behavior

**Calculations:**
- Net Worth = Total Assets - Total Debt
- Change = Current Net Worth - Previous Net Worth
- Change % = (Change / Previous Net Worth) × 100

**Files Created:**
- `src/components/NetWorthCard.tsx`

**Files Modified:**
- `src/pages/Dashboard.tsx`

---

### Phase 4: Add Budget Breakdown Card 💰 MEDIUM PRIORITY
**Priority:** Medium
**Time:** 45 minutes

#### 4.1 Create BudgetBreakdownCard Component
**Goal:** Match Monarch Money's budget breakdown with Fixed/Flexible/Non-Monthly

**Features:**
- Three budget categories: Fixed, Flexible, Non-Monthly
- Horizontal progress bars showing spent/budget/remaining
- Color coding (green for under, red for over)
- Percentage indicators
- Clean layout

**Component Structure:**
```typescript
interface BudgetCategory {
  name: 'Fixed' | 'Flexible' | 'Non-Monthly';
  budget: number;
  spent: number;
  remaining: number;
  percentage: number;
  status: 'under' | 'on-track' | 'over';
}

interface BudgetBreakdownCardProps {
  categories: BudgetCategory[];
  month: string;
}
```

**Visual Design:**
```
┌─────────────────────────────────────┐
│ Budget    March 2025      [Expenses]│
│                                     │
│ Fixed                               │
│ ████████████░░░░           budget   │
│     spent           remaining       │
│                                     │
│ Flexible                            │
│ ████████████████████       budget   │
│     spent           remaining       │
│                                     │
│ Non-Monthly                         │
│ ████████████████████       budget   │
│     spent           remaining       │
└─────────────────────────────────────┘
```

**Tasks:**
- [ ] Create `src/components/BudgetBreakdownCard.tsx`
- [ ] Define budget categories in data model
- [ ] Calculate spent vs budget for each category
- [ ] Create horizontal progress bars
- [ ] Add color coding logic
- [ ] Style to match theme
- [ ] Make responsive

**Budget Categories:**
- **Fixed:** Rent, mortgage, insurance, loan payments, subscriptions
- **Flexible:** Groceries, dining, entertainment, shopping, gas
- **Non-Monthly:** Annual subscriptions, quarterly bills, one-time expenses

**Files Created:**
- `src/components/BudgetBreakdownCard.tsx`
- `src/types/budget.ts` (update with new interfaces)

**Files Modified:**
- `src/pages/Dashboard.tsx`
- `src/hooks/useBudgets.ts` (add category breakdown)

---

### Phase 5: Add Goals Section 🎯 MEDIUM PRIORITY
**Priority:** Medium
**Time:** 30 minutes

#### 5.1 Create GoalsPreview Component
**Goal:** Match Monarch Money's goals section showing top priorities

**Features:**
- Shows 2-3 top priority goals
- Progress bars with current/target amounts
- Goal icons
- Percentage complete
- "This month" indicator for progress

**Component Structure:**
```typescript
interface Goal {
  id: string;
  name: string;
  icon: string;
  current: number;
  target: number;
  percentage: number;
  category?: string;
  deadline?: string;
}

interface GoalsPreviewProps {
  goals: Goal[];
  onViewAll: () => void;
}
```

**Visual Design:**
```
┌─────────────────────────────────────┐
│ Goals  Your top priorities          │
│                                     │
│ 🏠 EMERGENCY FUND                   │
│ ██████████░░░░░  ↓ $XXX This month │
│                                     │
│ 🚗 CAR DOWN PAYMENT                 │
│ ████░░░░░░░░░░░  ↑ $XXX This month │
└─────────────────────────────────────┘
```

**Tasks:**
- [ ] Create `src/components/GoalsPreview.tsx`
- [ ] Add goal icons (using Lucide)
- [ ] Create progress bars
- [ ] Calculate percentage complete
- [ ] Add "View All" link to Goals page
- [ ] Style to match theme

**Mock Goals Data:**
```typescript
const mockGoals = [
  {
    id: '1',
    name: 'Emergency Fund',
    icon: 'home',
    current: 4500,
    target: 10000,
    percentage: 45,
  },
  {
    id: '2',
    name: 'Vacation Fund',
    icon: 'plane',
    current: 1200,
    target: 5000,
    percentage: 24,
  },
];
```

**Files Created:**
- `src/components/GoalsPreview.tsx`

**Files Modified:**
- `src/pages/Dashboard.tsx`

---

### Phase 6: Enhance Transactions to Review 📝 LOW PRIORITY
**Priority:** Low
**Time:** 20 minutes

#### 6.1 Improve Transaction Display
**Goal:** Better merchant logos and formatting like Copilot Money

**Enhancements:**
- [ ] Add merchant logos using MerchantIcon component
- [ ] Better category badge styling
- [ ] Improved date grouping headers
- [ ] Better spacing and typography
- [ ] Add hover effects

**Tasks:**
- [ ] Update TransactionsToReview component
- [ ] Import and use MerchantIcon
- [ ] Enhance visual styling
- [ ] Test with various transaction types

**Files Modified:**
- `src/components/TransactionsToReview.tsx`

---

### Phase 7: Visual Polish & Responsive Design 🎨 LOW PRIORITY
**Priority:** Low
**Time:** 30 minutes

#### 7.1 Improve Layout and Spacing
**Tasks:**
- [ ] Adjust grid gaps for better visual hierarchy
- [ ] Ensure consistent card heights
- [ ] Improve typography hierarchy
- [ ] Add subtle animations (hover effects, transitions)
- [ ] Test responsive behavior on mobile (320px to 768px)
- [ ] Test on tablet (768px to 1024px)
- [ ] Test on desktop (1024px+)

#### 7.2 Add Loading States
**Tasks:**
- [ ] Create skeleton loaders for all cards
- [ ] Add loading states to charts
- [ ] Smooth transitions when data loads

#### 7.3 Performance Optimization
**Tasks:**
- [ ] Memoize expensive calculations
- [ ] Optimize chart rendering
- [ ] Lazy load heavy components
- [ ] Add debouncing to time range changes

**Files Modified:**
- `src/pages/Dashboard.tsx`
- All new components

---

## Layout Structure (After Implementation)

```
Dashboard
├── Header (Title + Time Range Selector)
│
├── Stats Grid (3 columns)
│   ├── Monthly Spending Card
│   ├── Total Spent Card
│   └── Average Transaction Card
│
├── Featured Cards (2 columns)
│   ├── Assets/Debt Trending Card [NEW]
│   └── Net Worth Card [NEW]
│
├── Budget & Goals (2 columns)
│   ├── Budget Breakdown Card [NEW]
│   └── Goals Preview Card [NEW]
│
├── Charts Row (2 columns)
│   ├── Monthly Spending Chart
│   └── Top Categories
│
├── Activity Row (2 columns)
│   ├── Transactions to Review
│   └── Next Two Weeks Preview
│
└── Upcoming Bills (full width)
```

---

## Component Hierarchy

```
Dashboard.tsx
├── TimeRangeSelector
├── MonthlySpendingCard (existing)
├── TotalSpentCard (existing)
├── AverageTransactionCard (existing)
├── AssetsDebtCard [NEW]
├── NetWorthCard [NEW]
├── BudgetBreakdownCard [NEW]
├── GoalsPreview [NEW]
├── MonthlySpendingChart
├── TopCategoriesCard
├── TransactionsToReview (enhanced)
├── NextTwoWeeksPreview (fixed)
└── UpcomingBills
```

---

## New Files to Create

1. `src/components/AssetsDebtCard.tsx`
2. `src/components/NetWorthCard.tsx`
3. `src/components/BudgetBreakdownCard.tsx`
4. `src/components/GoalsPreview.tsx`

---

## Files to Modify

1. `src/pages/Dashboard.tsx` - Main integration
2. `src/components/TransactionsToReview.tsx` - Enhancements
3. `src/components/NextTwoWeeksPreview.tsx` - Bug fixes
4. `src/hooks/useBudgets.ts` - Add category breakdown
5. `src/types/budget.ts` - Update interfaces

---

## Data Requirements

### Assets/Debt Historical Data
```typescript
interface AssetDebtHistory {
  date: string;
  assets: number;
  debt: number;
  netWorth: number;
}
```

**Source:** Calculate from account balance history

### Budget Category Breakdown
```typescript
interface BudgetCategoryBreakdown {
  fixed: {
    budget: number;
    spent: number;
    categories: string[];
  };
  flexible: {
    budget: number;
    spent: number;
    categories: string[];
  };
  nonMonthly: {
    budget: number;
    spent: number;
    categories: string[];
  };
}
```

**Source:** Derive from existing category spending data

### Goals Data
```typescript
interface Goal {
  id: string;
  name: string;
  icon: string;
  current: number;
  target: number;
  deadline?: string;
  category?: string;
}
```

**Source:** New mock data (or from Goals page if implemented)

---

## Testing Checklist

### Phase 1: Bug Fixes
- [ ] Budget calculation shows correct "under" amount
- [ ] Next two weeks shows actual upcoming bills
- [ ] No console errors

### Phase 2: Assets/Debt Card
- [ ] Assets and debt values display correctly
- [ ] Percentage changes calculate correctly
- [ ] Chart renders with both lines
- [ ] Time range selector works (1W, 1M, 3M, YTD, 1Y, ALL)
- [ ] Hover tooltips show correct data
- [ ] Responsive on mobile

### Phase 3: Net Worth Card
- [ ] Net worth calculates correctly (assets - debt)
- [ ] Area chart renders with gradient
- [ ] Time period selector works
- [ ] Change percentage displays correctly
- [ ] Responsive layout

### Phase 4: Budget Breakdown Card
- [ ] Three categories display (Fixed, Flexible, Non-Monthly)
- [ ] Progress bars show correct percentages
- [ ] Color coding works (green/red)
- [ ] Spent/budget/remaining values accurate
- [ ] Responsive design

### Phase 5: Goals Preview
- [ ] Top 2-3 goals display
- [ ] Progress bars render correctly
- [ ] Icons display properly
- [ ] Percentage calculations accurate
- [ ] "View All" link works

### Phase 6: Transactions Enhancement
- [ ] Merchant logos appear
- [ ] Category badges styled correctly
- [ ] Hover effects work
- [ ] Date grouping displays properly

### Phase 7: Visual Polish
- [ ] Consistent spacing throughout
- [ ] All cards same height in rows
- [ ] Animations smooth
- [ ] Loading states work
- [ ] Responsive on all screen sizes

---

## Success Criteria

### Visual Parity
- [ ] Matches Copilot Money's rich data visualization
- [ ] Incorporates Monarch Money's clean layout
- [ ] Maintains consistent dark theme
- [ ] Professional polish and attention to detail

### Functionality
- [ ] All bugs fixed
- [ ] All new features working
- [ ] Interactive charts responsive
- [ ] Time selectors functional
- [ ] Data calculations accurate

### Performance
- [ ] Page loads in < 2 seconds
- [ ] No lag when changing time ranges
- [ ] Smooth animations (60fps)
- [ ] No memory leaks

### Code Quality
- [ ] Full TypeScript coverage
- [ ] No ESLint errors
- [ ] Clean, maintainable code
- [ ] Proper component composition
- [ ] Reusable utilities

---

## Implementation Order (Recommended)

### Session 1 (1.5-2 hours) - CRITICAL
1. Phase 1: Fix bugs (30 min)
2. Phase 2: Assets/Debt card (45 min)
3. Phase 3: Net Worth card (30 min)

### Session 2 (1.5-2 hours) - ENHANCEMENTS
4. Phase 4: Budget breakdown (45 min)
5. Phase 5: Goals preview (30 min)
6. Phase 6: Transaction enhancements (20 min)
7. Phase 7: Visual polish (30 min)

---

## Risk Assessment

### Low Risk
- Bug fixes (well-defined problems)
- New component creation (isolated changes)
- Visual enhancements (no logic changes)

### Medium Risk
- Budget breakdown (requires data model changes)
- Historical data generation (calculations may be complex)

### Mitigation
- Test calculations thoroughly
- Use mock data initially
- Progressive enhancement approach
- Keep changes modular

---

## Rollback Plan

If issues arise:
1. Each component is isolated - can disable individually
2. Git branch allows easy revert
3. No breaking changes to existing code
4. Can deploy phases incrementally

---

## Future Enhancements (Post-MVP)

1. **Spending Insights Card** - AI-powered insights
2. **Bill Negotiation Reminders** - Suggest when to review bills
3. **Tax Category Tracking** - Tax deduction tracking
4. **Financial Health Score** - Overall financial wellness metric
5. **Custom Dashboard** - User-configurable widgets
6. **Export Dashboard** - PDF/PNG export

---

## Notes

- All components will use existing dark theme colors
- Charts will use Recharts library (already in project)
- Mock data used for demo purposes
- Real data integration would require backend API
- Components designed to be reusable across other pages

---

## Questions for Approval

1. **Budget Categories:** Should we use Fixed/Flexible/Non-Monthly (Monarch) or different categorization?
2. **Goals Data:** Should we create mock goals or wait for Goals page implementation?
3. **Time Range:** Which time ranges to support? (1W, 1M, 3M, 6M, YTD, 1Y, ALL)?
4. **Priority:** Should we implement all phases or focus on Phase 1-3 only?
5. **Design:** Any specific visual preferences or deviations from reference screenshots?

---

**Status:** ⏳ AWAITING APPROVAL

Please review this plan and provide feedback or approval to proceed.
