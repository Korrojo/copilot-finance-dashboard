export function formatCurrency(amount: number, includeSign = true): string {
  const absAmount = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(absAmount);

  if (!includeSign) {
    return formatted;
  }

  // Return with appropriate sign for negative/positive
  return amount < 0 ? `-${formatted}` : formatted;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num);
}

export function formatCompactCurrency(amount: number): string {
  const absAmount = Math.abs(amount);

  if (absAmount >= 1000000) {
    return `$${(absAmount / 1000000).toFixed(1)}M`;
  } else if (absAmount >= 1000) {
    return `$${(absAmount / 1000).toFixed(1)}K`;
  }

  return formatCurrency(absAmount, false);
}
