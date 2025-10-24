# Goals Page Implementation Plan

**Date:** October 23, 2025
**Status:** Planning → Implementation
**Approach:** Best of Both Worlds (Copilot Money + Monarch Money)

---

## Feature Comparison

### Copilot Money Goals ⭐⭐⭐⭐⭐

**Strengths:**
- ✅ Progress projection chart with timeline to target date
- ✅ "Need to save $X per month" automatic calculation
- ✅ Multiple goals in sidebar with quick overview
- ✅ Circular progress indicator showing total saved
- ✅ Goal detail panel with comprehensive information
- ✅ Account linking (529 accounts for education fund)
- ✅ Saving mode options (target date vs. monthly amount)
- ✅ Transaction tracking per goal
- ✅ Summary metadata (start date, target date, amount)

**Layout:**
- Left: Goals list with summary card at top
- Right: Selected goal details with chart
- Clean two-column design

### Monarch Money Goals ⭐⭐⭐⭐

**Strengths:**
- ✅ Visual hero images (fire extinguisher for emergency fund)
- ✅ Monthly contribution tracker with checkmarks
- ✅ Year selector (2024, 2025) for historical view
- ✅ Account balances panel with performance metrics
- ✅ Clean, simple progress bar
- ✅ Budget tracker per month
- ✅ Transaction list with transfer indicators

**Layout:**
- Single-page view with hero image at top
- Contributions calendar below
- Balances sidebar on right
- Transactions at bottom

---

## Our Implementation (Best of Both)

### Layout Design

```
┌─────────────────────────────────────────────────────────────────┐
│ Goals                                    [+ Add Goal]            │
├─────────────────────┬───────────────────────────────────────────┤
│ Goals List (Left)   │ Goal Details Panel (Right)                │
│                     │                                           │
│ [Summary Card]      │ 🏠 Emergency Fund        [Edit] [Delete]  │
│ • Total: $52K       │ $7,500 / $15,000 (50%)                   │
│ • Progress ring     │ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░                     │
│                     │                                           │
│ [Active Goals]      │ [Projection Chart]                        │
│ ┌─────────────┐    │ Shows progress over time with target     │
│ │🏠 Emergency │    │ "Save $500/month to reach by Dec 2026"   │
│ │   Fund      │    │                                           │
│ │ 50% • $7.5K │◄── │ [Monthly Contributions Tracker]          │
│ └─────────────┘    │ 2025: [Oct✓][Nov✓][Dec ]                │
│                     │                                           │
│ ┌─────────────┐    │ [Summary]                                │
│ │✈️  Vacation │    │ • Target: $15,000                        │
│ │   Fund      │    │ • Start: Jan 2025                        │
│ │ 48% • $2.4K │    │ • End: Dec 2026                          │
│ └─────────────┘    │ • Monthly: $500                          │
│                     │                                           │
│ ┌─────────────┐    │ [Linked Accounts]                        │
│ │🏠 Down      │    │ • Savings Account: $7,500                │
│ │   Payment   │    │                                           │
│ │ 75% • $45K  │    │ [Recent Contributions]                   │
│ └─────────────┘    │ • Jan 15: +$500 (Savings transfer)       │
└─────────────────────┴───────────────────────────────────────────┘
```

### Key Features to Implement

#### 1. Goals List (Left Panel)
- **Summary Card** (Copilot style)
  - Total saved across all goals
  - Total remaining to reach all goals
  - Circular progress indicator
  - Goal count

- **Goal Cards** (Combined style)
  - Icon (customizable per goal type)
  - Goal name
  - Progress bar
  - Current / Target amounts
  - Percentage complete
  - Monthly change indicator (from Dashboard)

#### 2. Goal Details Panel (Right Panel)
- **Header** (Combined)
  - Large icon
  - Goal name (editable)
  - Current / Target display
  - Edit and Delete buttons

- **Progress Visualization** (Copilot style)
  - Projection chart showing path to goal
  - Timeline markers
  - "Save $X per month" calculation
  - Current trajectory vs. required trajectory

- **Monthly Contributions** (Monarch style)
  - Year selector
  - Monthly tracker with checkmarks
  - Contribution amounts per month
  - Visual indicator of completed months

- **Goal Details** (Copilot style)
  - Target amount
  - Start date
  - Target date
  - Saving mode (Target date / Monthly amount)
  - Priority level

- **Linked Accounts** (Copilot style)
  - Accounts contributing to this goal
  - Current balances
  - Contribution amounts
  - Performance metrics (Monarch addition)

- **Recent Contributions** (Both have this)
  - Transaction list
  - Dates and amounts
  - Source accounts
  - Running total

#### 3. Add/Edit Goal Modal
- Goal name
- Goal icon/category
- Target amount
- Start date
- Target date OR monthly contribution amount
- Saving mode toggle
- Account selection
- Priority level

---

## Technical Implementation

### Data Structure

```typescript
interface Goal {
  id: string;
  name: string;
  icon: string; // 'home' | 'plane' | 'graduation' | 'piggybank' | 'car'
  category: string;

  // Financial
  target: number;
  current: number;
  percentage: number;

  // Timeline
  startDate: string;
  targetDate: string;
  monthlyTarget?: number;

  // Mode
  savingMode: 'target-date' | 'monthly-amount';
  priority: 'high' | 'medium' | 'low';

  // Tracking
  linkedAccounts: string[]; // Account IDs
  monthlyContributions: MonthlyContribution[];
  transactions: GoalTransaction[];

  // Projections
  projectedCompletion?: string;
  requiredMonthlyAmount: number;
  isOnTrack: boolean;
}

interface MonthlyContribution {
  month: string; // 'YYYY-MM'
  amount: number;
  completed: boolean;
  budgeted: number;
}

interface GoalTransaction {
  id: string;
  date: string;
  amount: number;
  accountId: string;
  accountName: string;
  type: 'contribution' | 'withdrawal' | 'interest';
  note?: string;
}
```

### Components to Create

1. **`src/pages/Goals.tsx`** - Main page
2. **`src/components/GoalsList.tsx`** - Left panel with goal cards
3. **`src/components/GoalDetailPanel.tsx`** - Right panel
4. **`src/components/GoalProgressChart.tsx`** - Projection chart
5. **`src/components/MonthlyContributionTracker.tsx`** - Month tracker with checkmarks
6. **`src/components/AddGoalModal.tsx`** - Create/edit goals
7. **`src/hooks/useGoals.ts`** - Goals state management

### Integration with Dashboard

The Dashboard already has `GoalsPreview` component showing top 3 goals. We need to:
1. Create a shared goals hook (`useGoals`)
2. Dashboard imports from this hook (top 3)
3. Goals page imports full list from same hook
4. "View all" link navigates to `/goals`

---

## Implementation Phases

### Phase 1: Basic Structure ⏱️ 30 min
- [x] Create Goals page route
- [ ] Build left panel with summary card
- [ ] Build goal cards list
- [ ] Build right detail panel shell
- [ ] Basic layout and styling

### Phase 2: Goal Details ⏱️ 45 min
- [ ] Progress projection chart (Recharts)
- [ ] Monthly contribution tracker
- [ ] Summary section
- [ ] Linked accounts display
- [ ] Recent contributions list

### Phase 3: State Management ⏱️ 30 min
- [ ] Create `useGoals` hook
- [ ] Mock data for 3-5 goals
- [ ] Goal selection logic
- [ ] Calculate projections
- [ ] Monthly tracking state

### Phase 4: Add/Edit Functionality ⏱️ 45 min
- [ ] Add Goal modal
- [ ] Form validation
- [ ] Create goal logic
- [ ] Edit goal logic
- [ ] Delete goal logic

### Phase 5: Dashboard Integration ⏱️ 15 min
- [ ] Update Dashboard to use `useGoals` hook
- [ ] Ensure "View all" navigates correctly
- [ ] Sync data between pages

### Phase 6: Polish ⏱️ 30 min
- [ ] Animations and transitions
- [ ] Empty states
- [ ] Loading states
- [ ] Responsive design
- [ ] Error handling

**Total Estimated Time:** 3 hours

---

## Mock Data

```typescript
const MOCK_GOALS: Goal[] = [
  {
    id: 'goal-1',
    name: 'Emergency Fund',
    icon: 'home',
    category: 'Savings',
    target: 15000,
    current: 7500,
    percentage: 50,
    startDate: '2025-01-01',
    targetDate: '2026-12-31',
    savingMode: 'target-date',
    priority: 'high',
    linkedAccounts: ['acc-1'],
    requiredMonthlyAmount: 500,
    isOnTrack: true,
    monthlyContributions: [
      { month: '2025-01', amount: 500, completed: true, budgeted: 500 },
      { month: '2025-02', amount: 500, completed: true, budgeted: 500 },
      // ...
    ],
    transactions: [
      {
        id: 'txn-1',
        date: '2025-01-15',
        amount: 500,
        accountId: 'acc-1',
        accountName: 'Savings Account',
        type: 'contribution',
      },
      // ...
    ],
  },
  {
    id: 'goal-2',
    name: 'Vacation Fund',
    icon: 'plane',
    category: 'Travel',
    target: 5000,
    current: 2400,
    percentage: 48,
    startDate: '2025-01-01',
    targetDate: '2025-12-31',
    savingMode: 'monthly-amount',
    monthlyTarget: 400,
    priority: 'medium',
    linkedAccounts: ['acc-2'],
    requiredMonthlyAmount: 400,
    isOnTrack: false,
    monthlyContributions: [],
    transactions: [],
  },
  {
    id: 'goal-3',
    name: 'Down Payment',
    icon: 'home',
    category: 'Housing',
    target: 60000,
    current: 45000,
    percentage: 75,
    startDate: '2024-01-01',
    targetDate: '2026-06-30',
    savingMode: 'target-date',
    priority: 'high',
    linkedAccounts: ['acc-3', 'acc-4'],
    requiredMonthlyAmount: 2000,
    isOnTrack: true,
    monthlyContributions: [],
    transactions: [],
  },
];
```

---

## Design System

### Colors
- **On Track:** Green (#10b981)
- **Behind:** Yellow (#f59e0b)
- **Off Track:** Red (#ef4444)
- **Completed:** Blue (#60a5fa)

### Icons
- Home: 🏠 (Emergency Fund, Down Payment)
- Plane: ✈️ (Vacation, Travel)
- Graduation: 🎓 (Education Fund)
- Piggy Bank: 🐷 (General Savings)
- Car: 🚗 (Car Purchase)

### Typography
- Goal name: text-xl font-bold
- Amounts: text-3xl font-bold (large display)
- Progress: text-sm text-gray-400
- Percentages: text-lg font-semibold

---

## Success Criteria

### Functionality
- [ ] Can view all goals in list
- [ ] Can select a goal to see details
- [ ] Can add a new goal
- [ ] Can edit existing goal
- [ ] Can delete a goal
- [ ] Progress chart shows projection
- [ ] Monthly tracker shows contributions
- [ ] Calculations are accurate
- [ ] Integrates with Dashboard

### Visual Quality
- [ ] Matches dark theme
- [ ] Smooth animations
- [ ] Responsive layout
- [ ] Accessible (keyboard navigation)
- [ ] Professional polish

### Performance
- [ ] Fast load time
- [ ] Smooth transitions
- [ ] No layout shifts
- [ ] Efficient re-renders

---

## Next Steps

1. ✅ Create this plan
2. Start Phase 1: Build basic structure
3. Implement progressively through all phases
4. Test thoroughly
5. Integrate with Dashboard
6. Polish and commit

**Status:** Ready to implement! 🚀
