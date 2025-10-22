import { useMemo } from 'react';
import type { InvestmentAccount, InvestmentPosition, PortfolioSummary, TopMover } from '../types/investment';

// Mock investment data
const MOCK_POSITIONS: InvestmentPosition[] = [
  {
    id: 'pos-1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    accountId: 'acc-brokerage',
    accountName: 'Fidelity Brokerage',
    shares: 50,
    costBasis: 7500,
    costPerShare: 150,
    currentPrice: 175.50,
    currentValue: 8775,
    totalGain: 1275,
    totalGainPercent: 17.0,
    dayGain: 125,
    dayGainPercent: 1.44,
    purchaseDate: '2023-06-15',
    lastUpdated: new Date().toISOString(),
    color: '#000000',
  },
  {
    id: 'pos-2',
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    type: 'etf',
    accountId: 'acc-brokerage',
    accountName: 'Fidelity Brokerage',
    shares: 25,
    costBasis: 9500,
    costPerShare: 380,
    currentPrice: 425.75,
    currentValue: 10643.75,
    totalGain: 1143.75,
    totalGainPercent: 12.04,
    dayGain: -75.50,
    dayGainPercent: -0.70,
    purchaseDate: '2023-01-10',
    lastUpdated: new Date().toISOString(),
    color: '#8b5cf6',
  },
  {
    id: 'pos-3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stock',
    accountId: 'acc-401k',
    accountName: 'Vanguard 401(k)',
    shares: 30,
    costBasis: 9000,
    costPerShare: 300,
    currentPrice: 370.25,
    currentValue: 11107.50,
    totalGain: 2107.50,
    totalGainPercent: 23.42,
    dayGain: 90.75,
    dayGainPercent: 0.82,
    purchaseDate: '2022-08-20',
    lastUpdated: new Date().toISOString(),
    color: '#00A4EF',
  },
  {
    id: 'pos-4',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stock',
    accountId: 'acc-brokerage',
    accountName: 'Fidelity Brokerage',
    shares: 20,
    costBasis: 2600,
    costPerShare: 130,
    currentPrice: 140.50,
    currentValue: 2810,
    totalGain: 210,
    totalGainPercent: 8.08,
    dayGain: 30,
    dayGainPercent: 1.08,
    purchaseDate: '2024-03-01',
    lastUpdated: new Date().toISOString(),
    color: '#4285F4',
  },
  {
    id: 'pos-5',
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    type: 'etf',
    accountId: 'acc-roth-ira',
    accountName: 'Fidelity Roth IRA',
    shares: 40,
    costBasis: 8800,
    costPerShare: 220,
    currentPrice: 245.30,
    currentValue: 9812,
    totalGain: 1012,
    totalGainPercent: 11.50,
    dayGain: -49.20,
    dayGainPercent: -0.50,
    purchaseDate: '2023-04-12',
    lastUpdated: new Date().toISOString(),
    color: '#8b5cf6',
  },
];

const MOCK_ACCOUNTS: InvestmentAccount[] = [
  {
    id: 'acc-brokerage',
    name: 'Fidelity Brokerage',
    type: 'brokerage',
    institution: 'Fidelity',
    totalValue: 22228.75,
    totalGain: 2628.75,
    totalGainPercent: 13.41,
    positions: MOCK_POSITIONS.filter(p => p.accountId === 'acc-brokerage'),
    cashBalance: 1500,
    lastSync: new Date().toISOString(),
  },
  {
    id: 'acc-401k',
    name: 'Vanguard 401(k)',
    type: '401k',
    institution: 'Vanguard',
    totalValue: 11107.50,
    totalGain: 2107.50,
    totalGainPercent: 23.42,
    positions: MOCK_POSITIONS.filter(p => p.accountId === 'acc-401k'),
    cashBalance: 0,
    lastSync: new Date().toISOString(),
  },
  {
    id: 'acc-roth-ira',
    name: 'Fidelity Roth IRA',
    type: 'roth_ira',
    institution: 'Fidelity',
    totalValue: 9812,
    totalGain: 1012,
    totalGainPercent: 11.50,
    positions: MOCK_POSITIONS.filter(p => p.accountId === 'acc-roth-ira'),
    cashBalance: 500,
    lastSync: new Date().toISOString(),
  },
];

export function useInvestments() {
  const accounts = MOCK_ACCOUNTS;
  const positions = MOCK_POSITIONS;

  const portfolioSummary: PortfolioSummary = useMemo(() => {
    const totalValue = accounts.reduce((sum, acc) => sum + acc.totalValue, 0);
    const cashBalance = accounts.reduce((sum, acc) => sum + acc.cashBalance, 0);
    const totalCost = positions.reduce((sum, pos) => sum + pos.costBasis, 0);
    const totalGain = totalValue - cashBalance - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    const dayGain = positions.reduce((sum, pos) => sum + pos.dayGain, 0);
    const dayGainPercent = totalValue > 0 ? (dayGain / (totalValue - dayGain)) * 100 : 0;

    return {
      totalValue,
      totalCost,
      totalGain,
      totalGainPercent,
      dayGain,
      dayGainPercent,
      cashBalance,
      investedAmount: totalValue - cashBalance,
    };
  }, [accounts, positions]);

  const topMovers: TopMover[] = useMemo(() => {
    return [...positions]
      .sort((a, b) => Math.abs(b.dayGainPercent) - Math.abs(a.dayGainPercent))
      .slice(0, 5)
      .map(position => ({
        position,
        change: position.dayGain,
        changePercent: position.dayGainPercent,
        direction: position.dayGain >= 0 ? 'up' as const : 'down' as const,
      }));
  }, [positions]);

  // Generate mock historical performance data
  const generatePerformanceHistory = (days: number) => {
    const data = [];
    const startValue = portfolioSummary.totalValue * 0.85; // Start 15% lower
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const trend = 1 + ((days - i) / days) * 0.15; // Gradual 15% increase
      const noise = 0.98 + Math.random() * 0.04; // ±2% daily noise
      const value = startValue * trend * noise;
      data.push({
        date: date.toISOString().split('T')[0],
        value,
        gain: value - portfolioSummary.totalCost,
        gainPercent: ((value - portfolioSummary.totalCost) / portfolioSummary.totalCost) * 100,
      });
    }
    return data;
  };

  return {
    accounts,
    positions,
    portfolioSummary,
    topMovers,
    generatePerformanceHistory,
  };
}
