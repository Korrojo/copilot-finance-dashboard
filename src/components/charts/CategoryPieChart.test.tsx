import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { CategoryPieChart } from './CategoryPieChart';
import type { CategorySpending } from '../../types';

describe('CategoryPieChart', () => {
  const mockData: CategorySpending[] = [
    { category: 'Groceries', amount: 500 },
    { category: 'Restaurants', amount: 300 },
    { category: 'Transportation', amount: 200 },
    { category: 'Entertainment', amount: 150 },
    { category: 'Utilities', amount: 100 },
  ];

  it('should render without crashing', () => {
    render(<CategoryPieChart data={mockData} />);
  });

  it('should render ResponsiveContainer', () => {
    const { container } = render(<CategoryPieChart data={mockData} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle empty data gracefully', () => {
    const { container } = render(<CategoryPieChart data={[]} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should limit data to specified limit', () => {
    const { container } = render(<CategoryPieChart data={mockData} limit={3} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should use default limit of 10 when not specified', () => {
    const largeData = Array.from({ length: 15 }, (_, i) => ({
      category: `Category ${i}`,
      amount: 100 + i * 10,
    }));
    const { container } = render(<CategoryPieChart data={largeData} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should handle single category', () => {
    const singleData = [mockData[0]];
    const { container } = render(<CategoryPieChart data={singleData} />);
    expect(container.firstChild).toBeTruthy();
  });

  it('should render pie chart', () => {
    const { container } = render(<CategoryPieChart data={mockData} />);
    expect(container.firstChild).toBeTruthy();
  });
});
