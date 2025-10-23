# Accounts Page Enhancement - Roadmap

**Branch:** `feature/accounts-enhancement`
**Date:** October 23, 2025
**Status:** Planning

---

## Analysis: Reference Screenshots

### Copilot Money Accounts (7 screenshots)
**Key Features Observed:**
1. **Net Worth Summary** - Assets vs Debt at top with trend chart
2. **Account Grouping** - Organized by type (Credit cards, Depository, Investments, Loans, Real estate, Others)
3. **Account Cards** - Each with institution logo, account name, balance, sparkline, percentage change
4. **Detail Panel** - Right side shows full transaction history, balance chart, metadata
5. **Connection Status** - "Connection needing attention" alert, last updated timestamps
6. **Expandable Sections** - Click to expand/collapse account groups
7. **Account Health** - Credit utilization bars, health scores (EXCELLENT, GOOD, etc.)
8. **Investment Details** - Holdings breakdown, allocation pie chart

### Monarch Money Accounts (1 screenshot)
**Key Features Observed:**
1. **Net Worth Card** - Large number with area chart showing growth
2. **Summary Stats** - Assets, Liabilities breakdown with horizontal bars
3. **Account Groups** - Cash, Credit Cards, Investments collapsible sections
4. **Mini Sparklines** - Small trend charts on each account
5. **Time Range Selector** - "1 month" dropdown for performance view

### Local Accounts (Current - 1 screenshot)
**Current State:**
- Net Worth, Assets, Liabilities summary cards
- Filter tabs (All Accounts, Credit, Depository, Investments)
- Account cards grouped by type
- Basic sparklines
- Hide Balances toggle
- "2 need attention" alert

**Issues:**
- No detailed account view/panel
- No transaction history per account
- No connection status details
- No credit utilization visuals
- No investment holdings
- Cards are basic (no health scores, metadata)

---

## Feature Comparison Matrix

| Feature | Copilot Money | Monarch Money | Local (Current) | Priority |
|---------|---------------|---------------|-----------------|----------|
| Net Worth Summary | ✅ Chart + trend | ✅ Area chart | ✅ Cards only | High |
| Account Grouping | ✅ Expandable | ✅ Collapsible | ✅ Filter tabs | Med |
| Account Sparklines | ✅ | ✅ | ✅ | Done |
| Detail Panel | ✅ Full featured | ❌ | ❌ | **High** |
| Transaction History | ✅ Per account | ❌ | ❌ | **High** |
| Connection Status | ✅ Alerts + sync | ❌ | ⚠️ Basic | Med |
| Credit Utilization | ✅ Progress bars | ❌ | ❌ | Med |
| Account Health | ✅ Scores | ❌ | ❌ | Med |
| Investment Holdings | ✅ Detailed | ❌ | ❌ | Low |
| Allocation Chart | ✅ | ❌ | ❌ | Low |
| Hide Balances | ❌ | ❌ | ✅ | Done |
| Time Range Filter | ❌ | ✅ | ❌ | Low |

---

## Implementation Plan

### Phase 1: Enhanced Net Worth Summary ⭐ High Priority
**Goal:** Make net worth section match Copilot Money's rich visualization

**Components to Build:**
1. `NetWorthSummary.tsx`
   - Large net worth card with trend chart
   - Assets/Debt dual-line chart (like Cash Flow combo)
   - Time range selector (1W, 1M, 3M, YTD, 1Y, ALL)
   - Percentage change indicators

**Features:**
- Interactive chart showing assets (blue) vs debt (red) over time
- Hover tooltip showing exact values
- Green/red percentage change badge
- Responsive layout

**Files:**
- `src/components/NetWorthSummary.tsx` (new)
- `src/pages/Accounts.tsx` (modify)

---

### Phase 2: Enhanced Account Cards ⭐ High Priority
**Goal:** Add metadata, health scores, and better visuals to account cards

**Components to Build:**
1. Enhanced `AccountCard.tsx`
   - Institution logo/icon
   - Account nickname + last 4 digits
   - Current balance (large)
   - Available credit (for credit cards)
   - Sparkline chart
   - Percentage change badge
   - Health score badge (EXCELLENT, GOOD, WARNING, CRITICAL)
   - Last synced timestamp
   - Alert icon if needs attention

**Features:**
- Credit card utilization progress bar
- Color-coded health status
- Sync status indicator
- Click to open detail panel

**Visual Design:**
```
┌─────────────────────────────────────┐
│ 🏦 Apple Card        ●  2h ago      │
│ ****1234                            │
│                                     │
│ $3,948.74    / $5,000 limit        │
│ ████████░░░░ 79%                   │
│                                     │
│ [sparkline chart]      ▲ +2.5%    │
│                                     │
│ EXCELLENT  100/100                  │
└─────────────────────────────────────┘
```

**Files:**
- `src/components/AccountCard.tsx` (modify)
- `src/components/AccountHealthBadge.tsx` (new)
- `src/types/account.ts` (modify)

---

### Phase 3: Account Detail Panel ⭐⭐ Highest Priority
**Goal:** Full featured right-side panel showing account details

**Components to Build:**
1. `AccountDetailPanel.tsx`
   - Account header (institution, name, balance)
   - Balance chart (line/area chart over time)
   - Account metadata
     - Account type
     - Account number (masked)
     - Opened date
     - Interest rate (if applicable)
     - Credit limit (for credit cards)
     - Available credit
     - Utilization percentage
   - Transaction list (filtered to this account)
   - Connection status
     - Last synced
     - Sync button
     - Disconnect button
   - Actions
     - Edit nickname
     - Hide from dashboard
     - Mark as closed

**Features:**
- Slide-in panel from right
- Balance trend chart with time range
- Paginated transaction list
- Real-time sync status
- Close with X or click outside

**Layout:**
```
┌────────────────────────────────────────┐
│ Apple Card                         ✕  │
│ Updated 2 hours ago    [Manage conn]  │
├────────────────────────────────────────┤
│ $3,948.74 / $5,000                    │
│ ████████░░░░ 79% utilized             │
│                                        │
│ [Balance chart]                        │
│                                        │
├────────────────────────────────────────┤
│ Account Details                        │
│ • Type: Credit Card                    │
│ • Number: ****1234                     │
│ • Opened: Jan 2023                     │
│ • APR: 18.99%                         │
│                                        │
├────────────────────────────────────────┤
│ Recent Transactions                    │
│ Aug 10  Verizon         -$110.20      │
│ Aug 9   CVS Pharmacy    -$50.00       │
│ Aug 9   Adjustment      -$1.62        │
│ ...                                    │
└────────────────────────────────────────┘
```

**Files:**
- `src/components/AccountDetailPanel.tsx` (new)
- `src/components/AccountBalanceChart.tsx` (new)
- `src/components/AccountTransactionList.tsx` (new)

---

### Phase 4: Connection Management 🔸 Medium Priority
**Goal:** Show connection status and allow sync/reconnect

**Components to Build:**
1. `ConnectionStatusAlert.tsx`
   - Banner showing accounts needing attention
   - "X need attention" with alert icon
   - Click to expand list
   - Per-connection status (working, expired, error)

2. `ConnectionCard.tsx`
   - Institution name + logo
   - Connection status badge
   - Last synced timestamp
   - Accounts count
   - [Sync] button
   - [Fix connection] button (if error)

**Features:**
- Color-coded status (green=good, yellow=warning, red=error)
- One-click sync
- Re-authentication flow (modal)

**Files:**
- `src/components/ConnectionStatusAlert.tsx` (new)
- `src/components/ConnectionCard.tsx` (new)
- `src/components/ReconnectModal.tsx` (new)

---

### Phase 5: Account Filtering & Grouping 🔸 Medium Priority
**Goal:** Better organization and findability

**Features to Enhance:**
1. **Filter Tabs** (keep current)
   - All Accounts
   - Credit (credit cards)
   - Depository (checking, savings)
   - Investments (401k, brokerage, etc.)
   - Add: Loans, Real Estate, Others

2. **Account Grouping** (new)
   - Collapsible sections by type
   - Show/hide entire groups
   - Group-level totals

3. **Search** (new)
   - Search by account name
   - Search by institution
   - Fuzzy matching

**Visual:**
```
[All (6)] [Credit (3)] [Depository (2)] [Investments (1)]

▼ Credit Cards                    $4,375.34
  • Apple Card
  • Freedom - Emu
  • Sapphire

▼ Depository                    $50,190.60
  • Bus.Checking
  • Bet.Saving
```

---

### Phase 6: Investment Account Details 🔹 Low Priority
**Goal:** Show holdings, allocation, performance for investment accounts

**Components to Build:**
1. `InvestmentDetailPanel.tsx` (extends AccountDetailPanel)
   - Holdings table (symbol, shares, price, value, gain/loss)
   - Allocation pie chart
   - Performance metrics
   - Cost basis

**Features:**
- Sort holdings by value, gain%, etc.
- Color-coded gains/losses
- Allocation by asset class

**Files:**
- `src/components/InvestmentDetailPanel.tsx` (new)
- `src/components/HoldingsTable.tsx` (new)
- `src/components/AllocationChart.tsx` (new)

---

### Phase 7: Real Estate Account Details 🔹 Low Priority
**Goal:** Show property value history, equity, mortgage info

**Components to Build:**
1. `RealEstateDetailPanel.tsx`
   - Property address
   - Zestimate/valuation history
   - Mortgage details (if linked)
   - Home equity calculation

**Features:**
- Valuation chart over time
- Equity vs debt breakdown
- Linked mortgage account

---

## Phase Prioritization

### MUST HAVE (MVP)
1. ✅ Phase 3: Account Detail Panel
2. ✅ Phase 2: Enhanced Account Cards
3. ✅ Phase 1: Enhanced Net Worth Summary

### SHOULD HAVE
4. Phase 4: Connection Management
5. Phase 5: Account Filtering & Grouping

### NICE TO HAVE
6. Phase 6: Investment Details
7. Phase 7: Real Estate Details

---

## Implementation Order

**Session 1 (Current):**
- Phase 1: Net Worth Summary (~30 min)
- Phase 2: Enhanced Account Cards (~30 min)
- Phase 3: Account Detail Panel (~45 min)

**Session 2 (If time):**
- Phase 4: Connection Management (~20 min)
- Phase 5: Filtering & Grouping (~15 min)

**Session 3 (Optional):**
- Phase 6: Investment Details
- Phase 7: Real Estate Details

---

## Technical Approach

### Data Structure

**Current Account Type:**
```typescript
interface Account {
  id: string;
  name: string;
  type: string;
  balance: number;
  institution?: string;
}
```

**Enhanced Account Type:**
```typescript
interface Account {
  id: string;
  name: string;
  nickname?: string;
  type: AccountType;
  subtype?: string;
  institution: Institution;

  // Balance
  balance: number;
  available?: number;
  currency: string;

  // Credit specific
  creditLimit?: number;
  utilization?: number;
  apr?: number;

  // Metadata
  accountNumber: string; // masked
  lastFourDigits: string;
  openedDate: string;
  status: 'active' | 'closed' | 'pending';

  // Sync
  connection: Connection;
  lastSynced: string;
  needsAttention: boolean;

  // History
  balanceHistory: Array<{ date: string; balance: number }>;

  // Health
  healthScore: number; // 0-100
  issues: string[];
}

interface Connection {
  id: string;
  institution: Institution;
  status: 'connected' | 'auth_expired' | 'error';
  lastSynced: string;
  nextSync?: string;
  error?: string;
}

interface Institution {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
}
```

### Mock Data Strategy
- Extend existing account data
- Add connection data
- Generate balance history from monthly spending
- Calculate health scores based on utilization, balance trends

---

## Visual Design Principles

**Following Copilot Money:**
1. **Card-based layout** - Each account is a card
2. **Sparklines everywhere** - Quick visual trends
3. **Health indicators** - Color-coded status badges
4. **Rich detail panel** - Slide-in from right
5. **Connection awareness** - Show sync status prominently
6. **Progressive disclosure** - Summary → Details on click

**Color Coding:**
- **Green:** Positive (good health, increasing balance)
- **Red:** Negative (high utilization, decreasing balance)
- **Yellow:** Warning (approaching limits)
- **Blue:** Neutral (info, links)
- **Gray:** Disabled/inactive

**Typography:**
- **Large numbers:** Balances (2xl-4xl)
- **Medium:** Labels, percentages (base-sm)
- **Small:** Metadata, timestamps (xs-sm)
- **Mono:** Account numbers, balances (for alignment)

---

## Success Criteria

### Phase 1 Success:
- [ ] Net worth chart displays assets vs debt over time
- [ ] Time range selector works (1W, 1M, 3M, etc.)
- [ ] Percentage changes calculate correctly
- [ ] Chart is interactive with hover tooltips

### Phase 2 Success:
- [ ] Account cards show all metadata
- [ ] Health scores display with colors
- [ ] Credit utilization shows progress bar
- [ ] Sparklines render correctly
- [ ] Last synced timestamps show

### Phase 3 Success:
- [ ] Detail panel slides in from right
- [ ] Balance chart shows account history
- [ ] Transaction list filters to selected account
- [ ] All metadata displays correctly
- [ ] Close panel works (X button, click outside)

---

## Files to Create/Modify

### New Files:
1. `src/components/NetWorthSummary.tsx`
2. `src/components/AccountDetailPanel.tsx`
3. `src/components/AccountBalanceChart.tsx`
4. `src/components/AccountHealthBadge.tsx`
5. `src/components/ConnectionStatusAlert.tsx`
6. `src/hooks/useAccounts.ts` (may need to enhance)

### Modified Files:
1. `src/pages/Accounts.tsx`
2. `src/components/AccountCard.tsx` (if exists, or create)
3. `src/types/account.ts`

---

## Next Steps

1. ✅ Create roadmap (this file)
2. Start Phase 1: Build NetWorthSummary component
3. Start Phase 2: Enhance AccountCard component
4. Start Phase 3: Build AccountDetailPanel
5. Test all features
6. Build and commit

---

**Status:** Ready to implement Phase 1-3
**Estimated Time:** 2-3 hours for complete implementation
**Complexity:** Medium-High (3 major components + data structures)
