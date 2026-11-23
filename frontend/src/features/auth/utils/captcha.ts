/** Simple visual security code for the login form (demo; a real portal validates on the server). */

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const LENGTH = 5;

export interface CaptchaChar {
  char: string;
  /** CSS transform that tilts / shifts the character */
  transform: string;
}

export function createCaptcha(): CaptchaChar[] {
  return Array.from({ length: LENGTH }, () => ({
    char: CHARS.charAt(Math.floor(Math.random() * CHARS.length)),
    transform: 'rotate(' + (Math.random() * 24 - 12).toFixed(0) + 'deg) translateY(' + (Math.random() * 6 - 3).toFixed(0) + 'px)',
  }));
}

export function captchaText(code: CaptchaChar[]): string {
  return code.map((c) => c.char).join('');
}
