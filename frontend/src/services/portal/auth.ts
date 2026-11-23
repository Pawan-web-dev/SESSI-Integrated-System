/** Employer session, admin session, login lock and one-time login-page messages. */
import { getAccountById } from './accounts';
import { readJson, removeKey, STORAGE_KEYS, writeJson } from './storage';
import type { Account, LoginFailures } from './types';

/* ---------- employer session ---------- */
export function getSessionAccount(): Account | null {
  const s = readJson<{ id: string; t: number } | null>(STORAGE_KEYS.session, null);
  return s ? getAccountById(s.id) : null;
}
export function startSession(acc: Account): void {
  writeJson(STORAGE_KEYS.session, { id: acc.id, t: Date.now() });
}
export function endSession(): void {
  removeKey(STORAGE_KEYS.session);
}

/* ---------- admin session ---------- */
export function isAdminSignedIn(): boolean {
  return !!readJson(STORAGE_KEYS.admin, null);
}
export function startAdminSession(): void {
  writeJson(STORAGE_KEYS.admin, { t: Date.now() });
}
export function endAdminSession(): void {
  removeKey(STORAGE_KEYS.admin);
}

/* ---------- failed-login lock ---------- */
export function getLoginFailures(): LoginFailures {
  return readJson<LoginFailures>(STORAGE_KEYS.loginFailures, { n: 0, until: 0 });
}
export function setLoginFailures(f: LoginFailures): void {
  writeJson(STORAGE_KEYS.loginFailures, f);
}
export function resetLoginFailures(): void {
  setLoginFailures({ n: 0, until: 0 });
}

/* ---------- message shown once on the login page (after logout / password change) ---------- */
let flashMessage = '';
export function setLoginFlash(message: string): void {
  flashMessage = message;
}
export function peekLoginFlash(): string {
  return flashMessage;
}
export function clearLoginFlash(): void {
  flashMessage = '';
}
