# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A modern financial dashboard built with React, TypeScript, Vite, and Tailwind CSS. Emulates the Copilot Money app UI/UX with features for tracking spending, budgets, subscriptions, and accounts.

## Development Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:5173
npm run build            # Build for production (runs TypeScript check + Vite build)
npm run preview          # Preview production build
npm run lint             # Run ESLint

# Testing
npm test                 # Run tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:run         # Run tests once (CI mode)
npm run test:coverage    # Generate coverage report
```

## Architecture

### Data Flow Pattern

The app uses a **centralized data + custom hooks** pattern:

1. **Data Source**: `src/data/financial_data.json` contains all financial data (monthly spending, categories, merchants, accounts, transactions)
2. **Primary Hook**: `useFinancialData()` loads and memoizes this data with computed aggregations
3. **Feature Hooks**: Domain-specific hooks (`useBudgets`, `useSubscriptions`, `useAccounts`) build on top of the base data with local state management
4. **Pages**: Consume hooks and render UI, keeping pages lean and focused on presentation

### Key Hooks & Their Responsibilities

- **`useFinancialData`**: Core data loading, provides aggregations (total spent, top merchant, etc.)
- **`useBudgets`**: Budget management with local state, compares budgets against category spending
- **`useSubscriptions`**: Detects recurring transactions, calculates upcoming bills and yearly projections
- **`useAccounts`**: Account management with connection status tracking

Each feature hook maintains its own local state (via `useState`) but reads from the shared `useFinancialData` for spending/transaction data.

### Component Organization

```
src/
├── components/
│   ├── layout/          # Sidebar, Layout (with <Outlet />)
│   ├── charts/          # Recharts wrappers (MonthlySpendingChart, CategoryPieChart, Sparkline)
│   └── [feature].tsx    # Feature-specific modals/cards (EditBudgetsModal, SubscriptionCard, etc.)
├── pages/               # Route pages (Dashboard, Transactions, CashFlow, Accounts, Categories, Recurrings)
├── hooks/               # Custom hooks for data + logic
├── types/               # TypeScript definitions (index.ts for core types, feature-specific files)
├── utils/               # Helpers (formatCurrency, subscriptionDetection, mockTransactions)
└── data/                # financial_data.json
```

### Routing Structure

React Router v6 with nested routes in `App.tsx`:
- Root layout (`<Layout />`) wraps all pages with sidebar navigation
- Pages use `<Outlet />` pattern for nested rendering
- Route paths: `/`, `/transactions`, `/cash-flow`, `/accounts`, `/categories`, `/recurrings`, `/goals`, `/investments`

### Type System

- **`src/types/index.ts`**: Core financial types (`Transaction`, `CategorySpending`, `MonthlySpending`, `FinancialData`)
- **Feature-specific types**: `budget.ts`, `subscription.ts`, `account.ts` for domain models
- All components use strict TypeScript with explicit interfaces

### Styling Approach

- **Tailwind CSS** with custom dark theme in `tailwind.config.js`
- Dark mode colors defined under `dark.*` namespace (`dark-bg`, `dark-surface`, `dark-border`, `dark-hover`)
- Uses `darkMode: 'class'` for theme toggling capability
- Lucide React for icons

### Testing Setup

- **Vitest** with happy-dom environment
- **React Testing Library** for component tests
- Test files colocated with source (`.test.tsx` or `.test.ts`)
- Path alias `@` maps to `./src` (configured in `vitest.config.ts`)
- Coverage excludes: `node_modules/`, `src/test/`, type definitions, config files, mock data

## Important Patterns

### Mock Data vs Real Data

Currently uses mock/static data:
- `financial_data.json` for spending/transaction history
- Inline mock arrays in hooks (`INITIAL_BUDGETS`, `INITIAL_SUBSCRIPTIONS`) for feature state
- Production would replace with API calls or localStorage persistence

### Subscription Detection

The `useSubscriptions` hook simulates recurring transaction detection:
- Pattern matching for frequency (monthly, yearly, quarterly, weekly, biweekly, daily)
- Confidence scores for subscription likelihood
- Auto-calculates upcoming bills and low-usage warnings
- See `src/utils/subscriptionDetection.ts` for date utilities

### Budget Status Logic

Budgets track three states:
- `under`: < 80% spent
- `warning`: 80-99% spent
- `over`: ≥ 100% spent

Budgets support rollover and different periods (monthly, yearly, etc.) though UI currently only shows monthly.

## Adding New Features

1. **New page**: Create in `src/pages/`, add route in `App.tsx`, add nav item in `Sidebar.tsx`
2. **New data type**: Add interface to `src/types/`, update `FinancialData` if needed
3. **New hook**: Follow pattern of composing `useFinancialData` + local `useState` for feature state
4. **New chart**: Wrap Recharts components in `src/components/charts/` with consistent styling
