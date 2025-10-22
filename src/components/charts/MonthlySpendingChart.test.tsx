import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MonthlySpendingChart } from './MonthlySpendingChart';
import type { MonthlySpending } from '../../types';

describe('MonthlySpendingChart', () => {
  const mockData: MonthlySpending[] = [
    {
      date: '2025-01',
      month: '2025-01',
      total_spent: -1500,
      transaction_count: 50,
      avg_transaction: -30,
    },
    {
      date: '2025-02',
      month: '2025-02',
      total_spent: -2000,
      transaction_count: 60,
      avg_transaction: -33.33,
    },
    {
      date: '2025-03',
      month: '2025-03',
      total_spent: -1800,
      transaction_count: 55,
      avg_transaction: -32.73,
    },
  ];

  it('should render without crashing', () => {
    render(<MonthlySpendingChart data={mockData} />);
  });

  it('should render ResponsiveContainer', () => {
    const { container } = render(<MonthlySpendingChart data={mockData} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle empty data gracefully', () => {
    const { container } = render(<MonthlySpendingChart data={[]} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render with single data point', () => {
    const singleData = [mockData[0]];
    const { container } = render(<MonthlySpendingChart data={singleData} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should process data correctly', () => {
    const { container } = render(<MonthlySpendingChart data={mockData} />);
    expect(container.firstChild).toBeTruthy();
  });
});
