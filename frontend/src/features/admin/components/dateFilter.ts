import { MONTH_NAMES, type Challan } from '@/services/portal';

/** Date filter. Empty day = whole month, empty month = whole year, all empty = all dates. */
export interface DateFilter {
  day: string;
  month: string;
  year: string;
}

export const ALL_DATES: DateFilter = { day: '', month: '', year: '' };

export const daysIn = (year: number, month: number) => new Date(year, month, 0).getDate();
export const pad = (n: number | string) => String(n).padStart(2, '0');

export function describeFilter(f: DateFilter): string {
  if (!f.year && !f.month && !f.day) return 'All dates';
  const mon = f.month ? MONTH_NAMES[+f.month - 1] : '';
  if (f.day) return +f.day + ' ' + mon.slice(0, 3) + ' ' + f.year;
  return (mon + ' ' + f.year).trim();
}

/** Does a challan fall in the selected period? A chosen day matches the due date. */
export function matchesDateFilter(c: Challan, f: DateFilter): boolean {
  if (f.day) return c.dueDate === f.year + '-' + pad(f.month) + '-' + pad(f.day);
  return (!f.year || c.year === +f.year) && (!f.month || c.month === +f.month);
}
