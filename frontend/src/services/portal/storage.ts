/**
 * Small wrapper around localStorage. Falls back to memory when storage is blocked
 * (private windows, sandboxed previews), exactly like the design prototype.
 */

const memory: Record<string, string> = {};

export const STORAGE_KEYS = {
  accounts: 'essi:accounts',
  session: 'essi:session',
  admin: 'essi:admin',
  outbox: 'essi:outbox',
  loginFailures: 'essi:fails',
  lastApplication: 'essi:lastapp',
  registrationDraft: 'essi:regdraft',
  einRegistry: 'essi:ein-registry',
  schema: 'essi:schema',
} as const;

/**
 * Version of the stored demo data. Bump it when the data shape changes; older demo data in the
 * browser is then cleared once (v2: Employer Identification Numbers DDD-II-NNNNNN).
 */
const SCHEMA_VERSION = 2;

export function ensureSchema(): void {
  if (readJson<number>(STORAGE_KEYS.schema, 0) >= SCHEMA_VERSION) return;
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('essi:'))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* storage blocked */
  }
  for (const k of Object.keys(memory)) delete memory[k];
  writeJson(STORAGE_KEYS.schema, SCHEMA_VERSION);
}

export function readJson<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    if (v) return JSON.parse(v) as T;
  } catch {
    /* storage blocked */
  }
  return key in memory ? (JSON.parse(memory[key]) as T) : fallback;
}

export function writeJson(key: string, value: unknown): void {
  const json = JSON.stringify(value);
  memory[key] = json;
  try {
    localStorage.setItem(key, json);
  } catch {
    /* storage blocked */
  }
}

export function removeKey(key: string): void {
  delete memory[key];
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage blocked */
  }
}
