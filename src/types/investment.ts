export interface InvestmentPosition {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'etf' | 'mutual_fund' | 'bond' | 'crypto' | 'other';
  accountId: string;
  accountName: string;

  // Holdings
  shares: number;
  costBasis: number; // Total cost
  costPerShare: number;
  currentPrice: number;
  currentValue: number;

  // Performance
  totalGain: number;
  totalGainPercent: number;
  dayGain: number;
  dayGainPercent: number;

  // Historical
  purchaseDate?: string;
  lastUpdated: string;

  // Display
  color?: string;
  logoUrl?: string;
}

export interface InvestmentAccount {
  id: string;
  name: string;
  type: 'brokerage' | '401k' | 'ira' | 'roth_ira' | 'hsa' | 'other';
  institution: string;
  totalValue: number;
  totalGain: number;
  totalGainPercent: number;
  positions: InvestmentPosition[];
  cashBalance: number;
  lastSync: string;
}

export interface PortfolioSummary {
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dayGain: number;
  dayGainPercent: number;
  cashBalance: number;
  investedAmount: number;
}

export interface PortfolioPerformance {
  date: string;
  value: number;
  gain: number;
  gainPercent: number;
}

export interface TopMover {
  position: InvestmentPosition;
  change: number;
  changePercent: number;
  direction: 'up' | 'down';
}

export const INVESTMENT_TYPE_LABELS: Record<InvestmentPosition['type'], string> = {
  stock: 'Stock',
  etf: 'ETF',
  mutual_fund: 'Mutual Fund',
  bond: 'Bond',
  crypto: 'Crypto',
  other: 'Other',
};

export const ACCOUNT_TYPE_LABELS: Record<InvestmentAccount['type'], string> = {
  brokerage: 'Brokerage',
  '401k': '401(k)',
  ira: 'Traditional IRA',
  roth_ira: 'Roth IRA',
  hsa: 'HSA',
  other: 'Other',
};

export const INVESTMENT_TYPE_COLORS: Record<InvestmentPosition['type'], string> = {
  stock: '#3b82f6',
  etf: '#8b5cf6',
  mutual_fund: '#10b981',
  bond: '#f59e0b',
  crypto: '#ef4444',
  other: '#6b7280',
};
