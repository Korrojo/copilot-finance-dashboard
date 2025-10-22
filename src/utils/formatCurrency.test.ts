import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCompactCurrency, formatNumber } from './formatCurrency';

describe('formatCurrency', () => {
  it('should format positive numbers as currency', () => {
    expect(formatCurrency(1000)).toBe('$1,000.00');
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });

  it('should format negative numbers as currency', () => {
    expect(formatCurrency(-1000)).toBe('-$1,000.00');
    expect(formatCurrency(-1234.56)).toBe('-$1,234.56');
  });

  it('should handle zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should handle decimal values correctly', () => {
    expect(formatCurrency(0.99)).toBe('$0.99');
    expect(formatCurrency(100.1)).toBe('$100.10');
  });
});

describe('formatCompactCurrency', () => {
  it('should format thousands with K suffix', () => {
    expect(formatCompactCurrency(1000)).toBe('$1.0K');
    expect(formatCompactCurrency(5500)).toBe('$5.5K');
  });

  it('should format millions with M suffix', () => {
    expect(formatCompactCurrency(1000000)).toBe('$1.0M');
    expect(formatCompactCurrency(2500000)).toBe('$2.5M');
  });

  it('should format billions as millions', () => {
    // Current implementation doesn't have billions support, treats as millions
    expect(formatCompactCurrency(1000000000)).toBe('$1000.0M');
  });

  it('should handle values less than 1000', () => {
    expect(formatCompactCurrency(999)).toBe('$999.00');
    expect(formatCompactCurrency(500)).toBe('$500.00');
  });

  it('should handle negative numbers', () => {
    // Uses absAmount, so returns positive format
    expect(formatCompactCurrency(-5000)).toBe('$5.0K');
    expect(formatCompactCurrency(-1500000)).toBe('$1.5M');
  });

  it('should handle zero', () => {
    expect(formatCompactCurrency(0)).toBe('$0.00');
  });
});

describe('formatNumber', () => {
  it('should format integers with commas', () => {
    expect(formatNumber(1000)).toBe('1,000');
    expect(formatNumber(1234567)).toBe('1,234,567');
  });

  it('should format decimals', () => {
    // Intl.NumberFormat doesn't enforce decimal places by default
    expect(formatNumber(1234.5678)).toBe('1,234.568');
    expect(formatNumber(100.1)).toBe('100.1');
  });

  it('should handle negative numbers', () => {
    expect(formatNumber(-1000)).toBe('-1,000');
    expect(formatNumber(-1234.56)).toBe('-1,234.56');
  });

  it('should handle zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});
