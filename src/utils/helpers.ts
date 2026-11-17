import { formatDistance, parseISO, differenceInDays } from 'date-fns';

/**
 * Subtract two dates to find the difference in days.
 * Works for both Date objects and string formats from Supabase.
 */
export const subtractDates = (
  dateStr1: string | Date,
  dateStr2: string | Date
): number =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)));

/**
 * Format a date string into a relative distance from now (e.g., "2 days ago").
 * Includes a safety shield to prevent undefined/null crashes on initial load.
 */
export const formatDistanceFromNow = (dateStr: string): string => {
  if (!dateStr) return ''; // <--- THE SHIELD: Stops undefined crashes instantly!

  try {
    return formatDistance(parseISO(dateStr), new Date(), {
      addSuffix: true,
    })
      .replace('about ', '')
      .replace('in', 'In');
  } catch (error) {
    return '';
  }
};

/**
 * Get today's date formatted as an ISO string.
 * Strips away time details or sets them to the end of the day for Supabase comparisons.
 */
export const getToday = function (options: { end?: boolean } = {}): string {
  const today = new Date();

  // Set to the last second or first second of the day for database comparisons
  if (options?.end) {
    today.setUTCHours(23, 59, 59, 999);
  } else {
    today.setUTCHours(0, 0, 0, 0);
  }

  return today.toISOString();
};

/**
 * Format a numeric amount into local currency (USD).
 */
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en', { style: 'currency', currency: 'USD' }).format(
    value
  );
