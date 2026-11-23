/** Formatting helpers. */

/** Keep only the digits of a value: "42101-1234567-1" -> "4210112345671". */
export function digitsOnly(value: unknown): string {
  return String(value || '').replace(/\D/g, '');
}

/** Current time as shown in the portal, e.g. "22 Nov 2026, 17:45". */
export function nowStamp(): string {
  return new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/** Remove characters that could break markup or scripts from user-entered text. */
export function sanitizeText(value: unknown): string {
  return String(value == null ? '' : value).replace(/[<>&"'\\{}$`]/g, '').trim();
}
