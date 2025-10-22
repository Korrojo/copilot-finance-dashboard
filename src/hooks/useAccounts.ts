import { useState, useMemo } from 'react';
import type { DetailedAccount, AccountConnection, AccountHealth, AccountIssue } from '../types/account';

// Mock detailed account data
const INITIAL_ACCOUNTS: DetailedAccount[] = [
  {
    id: 'acc-1',
    name: 'Chase Freedom Unlimited',
    type: 'credit',
    subtype: 'credit_card',
    balance: -2847.32,
    currentBalance: -2847.32,
    availableBalance: 7152.68,
    limit: 10000,
    mask: '1234',
    institution: 'Chase',
    connectionId: 'conn-1',
    currency: 'USD',
    isActive: true,
    isPrimary: true,
    openedDate: '2022-03-15',
    lastTransactionDate: '2025-10-20',
    monthlySpending: 2847.32,
    transactionCount: 42,
    averageTransaction: 67.79,
    color: '#117ACA',
  },
  {
    id: 'acc-2',
    name: 'Chase Total Checking',
    type: 'debit',
    subtype: 'checking',
    balance: 4523.18,
    currentBalance: 4523.18,
    availableBalance: 4523.18,
    mask: '5678',
    institution: 'Chase',
    connectionId: 'conn-1',
    currency: 'USD',
    isActive: true,
    isPrimary: false,
    openedDate: '2021-01-10',
    lastTransactionDate: '2025-10-21',
    monthlySpending: 1250.45,
    transactionCount: 28,
    averageTransaction: 44.66,
    color: '#117ACA',
  },
  {
    id: 'acc-3',
    name: 'Bank of America Cash Rewards',
    type: 'credit',
    subtype: 'credit_card',
    balance: -1234.56,
    currentBalance: -1234.56,
    availableBalance: 3765.44,
    limit: 5000,
    mask: '9012',
    institution: 'Bank of America',
    connectionId: 'conn-2',
    currency: 'USD',
    isActive: true,
    isPrimary: false,
    openedDate: '2023-06-20',
    lastTransactionDate: '2025-10-19',
    monthlySpending: 1234.56,
    transactionCount: 19,
    averageTransaction: 64.98,
    needsAttention: true,
    color: '#E31837',
  },
  {
    id: 'acc-4',
    name: 'American Express Blue Cash',
    type: 'credit',
    subtype: 'credit_card',
    balance: -567.89,
    currentBalance: -567.89,
    availableBalance: 14432.11,
    limit: 15000,
    mask: '3456',
    institution: 'American Express',
    connectionId: 'conn-3',
    currency: 'USD',
    isActive: true,
    isPrimary: false,
    openedDate: '2020-11-05',
    lastTransactionDate: '2025-10-18',
    monthlySpending: 567.89,
    transactionCount: 11,
    averageTransaction: 51.63,
    color: '#006FCF',
  },
  {
    id: 'acc-5',
    name: 'Fidelity Brokerage',
    type: 'investment',
    subtype: 'brokerage',
    balance: 52340.75,
    currentBalance: 52340.75,
    mask: '7890',
    institution: 'Fidelity',
    connectionId: 'conn-4',
    currency: 'USD',
    isActive: true,
    isPrimary: false,
    openedDate: '2019-04-12',
    lastTransactionDate: '2025-10-15',
    transactionCount: 3,
    color: '#00703C',
  },
  {
    id: 'acc-6',
    name: 'Wells Fargo Savings',
    type: 'debit',
    subtype: 'savings',
    balance: 12500.00,
    currentBalance: 12500.00,
    availableBalance: 12500.00,
    mask: '2468',
    institution: 'Wells Fargo',
    connectionId: 'conn-5',
    currency: 'USD',
    isActive: true,
    isPrimary: false,
    openedDate: '2021-08-22',
    lastTransactionDate: '2025-10-10',
    monthlySpending: 250.00,
    transactionCount: 4,
    averageTransaction: 62.50,
    needsAttention: true,
    color: '#D71E28',
  },
];

const INITIAL_CONNECTIONS: AccountConnection[] = [
  {
    id: 'conn-1',
    institutionId: 'chase',
    institutionName: 'Chase',
    status: 'connected',
    lastSync: '2025-10-22T10:30:00Z',
    nextSync: '2025-10-22T22:30:00Z',
    linkedAccounts: ['acc-1', 'acc-2'],
  },
  {
    id: 'conn-2',
    institutionId: 'bofa',
    institutionName: 'Bank of America',
    status: 'connected',
    lastSync: '2025-10-22T09:15:00Z',
    nextSync: '2025-10-22T21:15:00Z',
    linkedAccounts: ['acc-3'],
  },
  {
    id: 'conn-3',
    institutionId: 'amex',
    institutionName: 'American Express',
    status: 'reauth_required',
    lastSync: '2025-10-18T14:20:00Z',
    errorMessage: 'Please re-authenticate your account',
    linkedAccounts: ['acc-4'],
  },
  {
    id: 'conn-4',
    institutionId: 'fidelity',
    institutionName: 'Fidelity',
    status: 'connected',
    lastSync: '2025-10-22T08:00:00Z',
    nextSync: '2025-10-23T08:00:00Z',
    linkedAccounts: ['acc-5'],
  },
  {
    id: 'conn-5',
    institutionId: 'wells_fargo',
    institutionName: 'Wells Fargo',
    status: 'error',
    lastSync: '2025-10-20T12:00:00Z',
    errorMessage: 'Connection timeout. Please try again.',
    linkedAccounts: ['acc-6'],
  },
];

export function useAccounts() {
  const [accounts, setAccounts] = useState<DetailedAccount[]>(INITIAL_ACCOUNTS);
  const [connections, setConnections] = useState<AccountConnection[]>(INITIAL_CONNECTIONS);

  // Calculate total net worth
  const netWorth = useMemo(() => {
    return accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
  }, [accounts]);

  // Calculate total assets (positive balances)
  const totalAssets = useMemo(() => {
    return accounts
      .filter(acc => acc.currentBalance > 0)
      .reduce((sum, acc) => sum + acc.currentBalance, 0);
  }, [accounts]);

  // Calculate total liabilities (negative balances)
  const totalLiabilities = useMemo(() => {
    return Math.abs(
      accounts
        .filter(acc => acc.currentBalance < 0)
        .reduce((sum, acc) => sum + acc.currentBalance, 0)
    );
  }, [accounts]);

  // Group accounts by institution
  const accountsByInstitution = useMemo(() => {
    const grouped: Record<string, DetailedAccount[]> = {};
    for (const account of accounts) {
      if (!grouped[account.institution]) {
        grouped[account.institution] = [];
      }
      grouped[account.institution].push(account);
    }
    return grouped;
  }, [accounts]);

  // Active accounts
  const activeAccounts = useMemo(() => {
    return accounts.filter(acc => acc.isActive);
  }, [accounts]);

  // Accounts needing attention
  const accountsNeedingAttention = useMemo(() => {
    return accounts.filter(acc => acc.needsAttention);
  }, [accounts]);

  // Calculate account health
  const calculateAccountHealth = (account: DetailedAccount): AccountHealth => {
    const issues: AccountIssue[] = [];
    let score = 100;

    // Check credit utilization
    if (account.type === 'credit' && account.limit) {
      const utilization = (Math.abs(account.currentBalance) / account.limit) * 100;
      if (utilization > 80) {
        issues.push({
          type: 'high_utilization',
          severity: 'high',
          message: `Credit utilization at ${utilization.toFixed(0)}% (over 80%)`,
          actionable: true,
          action: 'Pay down balance',
        });
        score -= 30;
      } else if (utilization > 50) {
        issues.push({
          type: 'high_utilization',
          severity: 'medium',
          message: `Credit utilization at ${utilization.toFixed(0)}% (over 50%)`,
          actionable: true,
          action: 'Consider paying down balance',
        });
        score -= 15;
      }
    }

    // Check low balance for checking/savings
    if ((account.subtype === 'checking' || account.subtype === 'savings') && account.currentBalance < 1000) {
      issues.push({
        type: 'low_balance',
        severity: account.currentBalance < 500 ? 'high' : 'medium',
        message: `Low balance: $${account.currentBalance.toFixed(2)}`,
        actionable: true,
        action: 'Add funds to maintain buffer',
      });
      score -= account.currentBalance < 500 ? 25 : 10;
    }

    // Check connection status
    const connection = connections.find(c => c.id === account.connectionId);
    if (connection?.status === 'error' || connection?.status === 'reauth_required') {
      issues.push({
        type: 'auth_expired',
        severity: 'medium',
        message: connection.errorMessage || 'Authentication required',
        actionable: true,
        action: 'Re-authenticate account',
      });
      score -= 20;
    }

    // Determine status
    let status: AccountHealth['status'];
    if (score >= 90) status = 'excellent';
    else if (score >= 70) status = 'good';
    else if (score >= 50) status = 'warning';
    else status = 'critical';

    const recommendations: string[] = [];
    if (issues.length === 0) {
      recommendations.push('Account is in good standing');
    }

    return {
      accountId: account.id,
      score: Math.max(0, score),
      status,
      issues,
      recommendations,
    };
  };

  // Get account health for all accounts
  const accountHealthMap = useMemo(() => {
    const healthMap: Record<string, AccountHealth> = {};
    for (const account of accounts) {
      healthMap[account.id] = calculateAccountHealth(account);
    }
    return healthMap;
  }, [accounts, connections]);

  // Sync account
  const syncAccount = async (accountId: string) => {
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;

    const connection = connections.find(c => c.id === account.connectionId);
    if (!connection) return;

    // Update connection status
    setConnections(conns =>
      conns.map(c =>
        c.id === connection.id
          ? {
              ...c,
              status: 'connected',
              lastSync: new Date().toISOString(),
              nextSync: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
              errorMessage: undefined,
            }
          : c
      )
    );

    // Update account
    setAccounts(accs =>
      accs.map(a =>
        a.id === accountId
          ? {
              ...a,
              needsAttention: false,
            }
          : a
      )
    );
  };

  // Disconnect account
  const disconnectAccount = (connectionId: string) => {
    setConnections(conns =>
      conns.map(c =>
        c.id === connectionId
          ? {
              ...c,
              status: 'disconnected',
            }
          : c
      )
    );
  };

  // Set account nickname
  const setAccountNickname = (accountId: string, nickname: string) => {
    setAccounts(accs =>
      accs.map(a =>
        a.id === accountId
          ? {
              ...a,
              nickname,
            }
          : a
      )
    );
  };

  return {
    accounts,
    connections,
    netWorth,
    totalAssets,
    totalLiabilities,
    accountsByInstitution,
    activeAccounts,
    accountsNeedingAttention,
    accountHealthMap,
    syncAccount,
    disconnectAccount,
    setAccountNickname,
  };
}
