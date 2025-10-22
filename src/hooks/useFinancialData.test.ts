import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFinancialData } from './useFinancialData';

describe('useFinancialData', () => {
  it('should return financial data', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.data).toBeDefined();
    expect(result.current.data.monthly_spending).toBeInstanceOf(Array);
    expect(result.current.data.category_spending).toBeInstanceOf(Array);
    expect(result.current.data.merchant_spending).toBeInstanceOf(Array);
    expect(result.current.data.account_spending).toBeInstanceOf(Array);
  });

  it('should calculate total spent from monthly data', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.totalSpent).toBeGreaterThan(0);
    expect(typeof result.current.totalSpent).toBe('number');
  });

  it('should calculate total transactions', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.totalTransactions).toBeGreaterThan(0);
    expect(typeof result.current.totalTransactions).toBe('number');
  });

  it('should calculate average transaction', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.avgTransaction).toBeGreaterThan(0);
    expect(typeof result.current.avgTransaction).toBe('number');
  });

  it('should return top merchant', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.topMerchant).toBeDefined();
    expect(typeof result.current.topMerchant).toBe('string');
  });

  it('should return primary account', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.primaryAccount).toBeDefined();
    expect(typeof result.current.primaryAccount).toBe('string');
  });

  it('should return latest month spending', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.latestMonthSpending).toBeGreaterThanOrEqual(0);
    expect(typeof result.current.latestMonthSpending).toBe('number');
  });

  it('should return top 5 categories', () => {
    const { result } = renderHook(() => useFinancialData());

    expect(result.current.topCategories).toBeInstanceOf(Array);
    expect(result.current.topCategories.length).toBeLessThanOrEqual(5);

    if (result.current.topCategories.length > 0) {
      const firstCategory = result.current.topCategories[0];
      expect(firstCategory).toHaveProperty('category');
      expect(firstCategory).toHaveProperty('amount');
    }
  });

  it('should memoize data and not recalculate on re-render', () => {
    const { result, rerender } = renderHook(() => useFinancialData());

    const firstData = result.current.data;
    const firstTotalSpent = result.current.totalSpent;

    rerender();

    expect(result.current.data).toBe(firstData);
    expect(result.current.totalSpent).toBe(firstTotalSpent);
  });
});
