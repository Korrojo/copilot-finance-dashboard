import type { Account } from './index';

export interface AccountConnection {
  id: string;
  institutionId: string;
  institutionName: string;
  institutionLogo?: string;
  status: 'connected' | 'disconnected' | 'error' | 'reauth_required';
  lastSync: string;
  nextSync?: string;
  errorMessage?: string;
  linkedAccounts: string[]; // Account IDs
}

export interface DetailedAccount extends Account {
  // Connection info
  connectionId: string;
  accountNumber?: string;
  routingNumber?: string;

  // Balance details
  availableBalance?: number;
  currentBalance: number;
  limit?: number; // For credit cards

  // Account metadata
  currency: string;
  openedDate?: string;
  lastTransactionDate?: string;

  // Status indicators
  isActive: boolean;
  isPrimary?: boolean;
  needsAttention?: boolean;

  // Spending stats
  monthlySpending?: number;
  transactionCount?: number;
  averageTransaction?: number;

  // Additional details
  subtype?: 'checking' | 'savings' | 'credit_card' | 'brokerage' | '401k' | 'ira';
  nickname?: string;
  color?: string;
}

export interface AccountHealth {
  accountId: string;
  score: number; // 0-100
  status: 'excellent' | 'good' | 'warning' | 'critical';
  issues: AccountIssue[];
  recommendations: string[];
}

export interface AccountIssue {
  type: 'high_utilization' | 'low_balance' | 'unusual_activity' | 'missed_sync' | 'auth_expired';
  severity: 'low' | 'medium' | 'high';
  message: string;
  actionable: boolean;
  action?: string;
}

export interface InstitutionInfo {
  id: string;
  name: string;
  logo?: string;
  website?: string;
  supportPhone?: string;
  color: string;
  accountTypes: string[];
}

export const INSTITUTION_INFO: Record<string, InstitutionInfo> = {
  'chase': {
    id: 'chase',
    name: 'Chase',
    logo: '🏦',
    website: 'https://chase.com',
    supportPhone: '1-800-935-9935',
    color: '#117ACA',
    accountTypes: ['checking', 'savings', 'credit_card'],
  },
  'bofa': {
    id: 'bofa',
    name: 'Bank of America',
    logo: '🏦',
    website: 'https://bankofamerica.com',
    supportPhone: '1-800-432-1000',
    color: '#E31837',
    accountTypes: ['checking', 'savings', 'credit_card'],
  },
  'amex': {
    id: 'amex',
    name: 'American Express',
    logo: '💳',
    website: 'https://americanexpress.com',
    supportPhone: '1-800-528-4800',
    color: '#006FCF',
    accountTypes: ['credit_card'],
  },
  'fidelity': {
    id: 'fidelity',
    name: 'Fidelity',
    logo: '📈',
    website: 'https://fidelity.com',
    supportPhone: '1-800-343-3548',
    color: '#00703C',
    accountTypes: ['brokerage', '401k', 'ira'],
  },
  'wells_fargo': {
    id: 'wells_fargo',
    name: 'Wells Fargo',
    logo: '🏦',
    website: 'https://wellsfargo.com',
    supportPhone: '1-800-869-3557',
    color: '#D71E28',
    accountTypes: ['checking', 'savings', 'credit_card'],
  },
};

export const CONNECTION_STATUS_COLORS = {
  connected: 'bg-green-500/20 text-green-400 border-green-500/30',
  disconnected: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  error: 'bg-red-500/20 text-red-400 border-red-500/30',
  reauth_required: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
};

export const ACCOUNT_HEALTH_COLORS = {
  excellent: 'text-green-400 bg-green-500/20',
  good: 'text-blue-400 bg-blue-500/20',
  warning: 'text-yellow-400 bg-yellow-500/20',
  critical: 'text-red-400 bg-red-500/20',
};
