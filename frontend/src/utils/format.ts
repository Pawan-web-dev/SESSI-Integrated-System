/** Formatting helpers. */

/** Keep only the digits of a value: "42101-1234567-1" -> "4210112345671". */
export function digitsOnly(value: unknown): string {
  return String(value || '').replace(/\D/g, '');
}

/** Parse an API timestamp. The server stores UTC; values without a zone are treated as UTC. */
export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const iso = /[zZ]|[+-]\d\d:?\d\d$/.test(value) || value.length <= 10 ? value : value + 'Z';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** "22 Nov 2026, 17:45" (local time) */
export function formatDateTime(value: string | null | undefined): string {
  const d = parseApiDate(value);
  return d ? d.toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-';
}

/** "22-Nov-2026" (as printed on challans and receipts) */
export function formatDate(value: string | null | undefined): string {
  const d = parseApiDate(value);
  if (!d) return '-';
  const day = String(d.getDate()).padStart(2, '0');
  return `${day}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
}

/** 106600 -> "106,600" */
export function formatAmount(value: number | null | undefined): string {
  return Number(value || 0).toLocaleString('en-US');
}

/** Current month as YYYY-MM (for contributions). */
export function currentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

/** "2026-11" -> "November, 2026" */
export function monthLabel(yyyyMm: string): string {
  const [y, m] = yyyyMm.split('-').map(Number);
  return new Date(y, m - 1, 1).toLocaleString('en-GB', { month: 'long' }) + ', ' + y;
}

const ONES = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN', 'NINETEEN'];
const TENS = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY', 'SIXTY', 'SEVENTY', 'EIGHTY', 'NINETY'];

/** 106600 -> "ONE HUNDRED SIX THOUSAND SIX HUNDRED" (as printed on challans) */
export function amountInWords(n: number): string {
  const below1000 = (x: number) => {
    let out = '';
    if (x >= 100) {
      out += ONES[Math.floor(x / 100)] + ' HUNDRED ';
      x %= 100;
    }
    if (x >= 20) out += TENS[Math.floor(x / 10)] + ' ' + ONES[x % 10] + ' ';
    else if (x > 0) out += ONES[x] + ' ';
    return out;
  };
  if (!n) return 'ZERO';
  let out = '';
  for (const [size, word] of [[1_000_000_000, 'BILLION'], [1_000_000, 'MILLION'], [1_000, 'THOUSAND']] as const) {
    if (n >= size) {
      out += below1000(Math.floor(n / size)) + word + ' ';
      n %= size;
    }
  }
  return (out + below1000(n)).replace(/ +/g, ' ').trim();
}

/** 2048 -> "2 KB", 3_500_000 -> "3.3 MB" */
export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  return Math.max(1, Math.round(bytes / 1024)) + ' KB';
}
