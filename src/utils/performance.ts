/**
 * Performance utilities for monitoring and optimization
 */

/**
 * Measure the execution time of a function
 */
export function measurePerformance<T>(
  name: string,
  fn: () => T
): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
}

/**
 * Async version of measurePerformance
 */
export async function measurePerformanceAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  }

  return { result, duration };
}

/**
 * Log render count (useful for debugging unnecessary re-renders)
 */
export function useRenderCount(componentName: string): void {
  const renderCount = React.useRef(0);

  if (process.env.NODE_ENV === 'development') {
    renderCount.current += 1;
    console.log(`[Render] ${componentName}: ${renderCount.current}`);
  }
}

/**
 * Throttle a function to run at most once per specified time
 */
export function throttle<TFunc extends (...args: unknown[]) => void>(
  func: TFunc,
  limit: number
): TFunc {
  let inThrottle: boolean;
  let lastResult: unknown;

  return ((...args: unknown[]) => {
    if (!inThrottle) {
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
      lastResult = func(...args);
    }
    return lastResult;
  }) as TFunc;
}

/**
 * Simple memoization for expensive calculations
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Batch updates to reduce re-renders
 */
export function batchUpdates(updates: Array<() => void>): void {
  // In React 18+, updates are automatically batched
  // This is a fallback for older versions
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      updates.forEach(update => update());
    });
  } else {
    updates.forEach(update => update());
  }
}

/**
 * Check if an element is in viewport (for lazy loading)
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Virtual scrolling utilities (documentation for future implementation)
 *
 * For large transaction lists (500+ items), consider implementing virtual scrolling:
 *
 * 1. Install react-window or react-virtual:
 *    npm install react-window @types/react-window
 *
 * 2. Wrap transaction list in FixedSizeList:
 *    <FixedSizeList
 *      height={600}
 *      itemCount={transactions.length}
 *      itemSize={80}
 *      width="100%"
 *    >
 *      {({ index, style }) => (
 *        <div style={style}>
 *          <TransactionRow transaction={transactions[index]} />
 *        </div>
 *      )}
 *    </FixedSizeList>
 *
 * This will only render visible items, improving performance dramatically.
 */

// Re-export React for useRenderCount
import React from 'react';
