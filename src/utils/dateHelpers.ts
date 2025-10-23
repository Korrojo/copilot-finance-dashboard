/**
 * Date utility functions for displaying relative and formatted dates
 */

/**
 * Returns a relative date label for recent dates, or formatted date for older ones
 * Examples: "Today", "Yesterday", "This Week", "Last Week", "Sep 12, 2025"
 */
export function getRelativeDateLabel(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Reset time to compare dates only
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

  // Check if it's today
  if (dateOnly.getTime() === todayOnly.getTime()) {
    return 'Today';
  }

  // Check if it's yesterday
  if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return 'Yesterday';
  }

  // Check if it's within the current week (last 7 days)
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (dateOnly > weekAgo && dateOnly < todayOnly) {
    return 'This Week';
  }

  // Check if it's within the previous week (7-14 days ago)
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
  if (dateOnly > twoWeeksAgo && dateOnly <= weekAgo) {
    return 'Last Week';
  }

  // For older dates, return formatted date
  return formatAbsoluteDate(dateString);
}

/**
 * Formats a date string as "Mon DD, YYYY"
 * Example: "Sep 12, 2025"
 */
export function formatAbsoluteDate(dateString: string): string {
  const date = new Date(dateString);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
}

/**
 * Gets the day of the week for a date
 * Example: "Monday", "Tuesday", etc.
 */
export function getDayOfWeek(dateString: string): string {
  const date = new Date(dateString);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[date.getDay()];
}

/**
 * Checks if a date is within the last N days
 */
export function isWithinDays(dateString: string, days: number): boolean {
  const date = new Date(dateString);
  const today = new Date();
  const threshold = new Date(today);
  threshold.setDate(threshold.getDate() - days);

  return date >= threshold;
}
