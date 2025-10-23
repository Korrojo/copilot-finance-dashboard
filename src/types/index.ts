// Transaction types
export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  account: string;
  amount: number;
  status: 'pending' | 'posted' | 'cleared' | 'to_review';
  type: 'debit' | 'credit';
  notes?: string;
  tags?: string[];
}

// Category spending
export interface CategorySpending {
  category: string;
  amount: number;
  budget?: number;
  transactions?: number;
}

// Monthly spending
export interface MonthlySpending {
  date: string;
  month: string;
  total_spent: number;
  transaction_count: number;
  avg_transaction: number;
}

// Merchant data
export interface MerchantSpending {
  merchant: string;
  amount: number;
  transaction_count?: number;
  category?: string;
}

// Account data
export interface Account {
  id: string;
  name: string;
  type: 'credit' | 'debit' | 'investment';
  balance: number;
  mask?: string;
  institution: string;
}

// Account spending
export interface AccountSpending {
  account: string;
  amount: number;
  percentage?: number;
}

// Financial data structure
export interface FinancialData {
  monthly_spending: MonthlySpending[];
  category_spending: CategorySpending[];
  merchant_spending: MerchantSpending[];
  account_spending: AccountSpending[];
  transactions?: Transaction[];
}

// Page navigation
export type PageType =
  | 'dashboard'
  | 'transactions'
  | 'cash-flow'
  | 'accounts'
  | 'investments'
  | 'categories'
  | 'recurrings'
  | 'goals';
