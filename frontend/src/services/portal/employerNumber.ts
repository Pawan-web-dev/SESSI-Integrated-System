/**
 * Employer Identification Number (EIN) – Sindh Employees' Social Security Act, 2016.
 *
 *   DDD-II-NNNNNN[-BB]
 *   DDD    Directorate Code                 (3 digits, see DIRECTORATE_MASTER)
 *   II     Industry Classification Code     (2 digits, see INDUSTRY_MASTER)
 *   NNNNNN Establishment Serial Number      (6 digits, sequential within Directorate + Industry)
 *   BB     Branch / Sub-unit Identifier     (optional, 2 digits)
 *
 * Rules implemented here:
 *  - an EIN is issued once per establishment and stays permanent (also after an industry change,
 *    closure, transfer, merger or change of ownership);
 *  - every EIN ever issued is kept in a registry, so a number is never issued to another employer;
 *  - the serial continues from the highest number ever issued for that Directorate + Industry.
 */
import { nowStamp } from '@/utils/format';
import { findDirectorateByCode, findIndustry } from './masterData';
import { readJson, STORAGE_KEYS, writeJson } from './storage';

export const EIN_PATTERN = /^(\d{3})-(\d{2})-(\d{6})(?:-(\d{2}))?$/;
export const EIN_FORMAT_HINT = 'DDD-II-NNNNNN (Directorate-Industry-Serial), e.g. 100-91-000001';

export interface EinParts {
  directorate: string;
  industry: string;
  serial: number;
  branch?: string;
}

/** One issued number. Entries are never removed. */
export interface EinRegistryEntry {
  ein: string;
  accountId: string;
  issuedAt: string;
}

export function formatEin(p: EinParts): string {
  return p.directorate + '-' + p.industry + '-' + String(p.serial).padStart(6, '0') + (p.branch ? '-' + p.branch : '');
}

export function parseEin(ein: string | undefined): EinParts | null {
  const m = EIN_PATTERN.exec(String(ein || '').trim());
  if (!m) return null;
  return { directorate: m[1], industry: m[2], serial: Number(m[3]), branch: m[4] };
}

export function isValidEin(ein: string | undefined): boolean {
  const p = parseEin(ein);
  return !!p && !!findDirectorateByCode(p.directorate) && !!findIndustry(p.industry);
}

/** Readable meaning of an EIN, e.g. "Malir Directorate · Retail Shops · No. 000001". */
export function describeEin(ein: string | undefined): { directorate: string; industry: string; serial: string; branch: string } | null {
  const p = parseEin(ein);
  if (!p) return null;
  return {
    directorate: findDirectorateByCode(p.directorate)?.name || 'Directorate ' + p.directorate,
    industry: findIndustry(p.industry)?.name || 'Industry ' + p.industry,
    serial: String(p.serial).padStart(6, '0'),
    branch: p.branch || '',
  };
}

export function getEinRegistry(): EinRegistryEntry[] {
  return readJson<EinRegistryEntry[]>(STORAGE_KEYS.einRegistry, []);
}

/** Highest serial issued so far for a Directorate + Industry (registry and known numbers). */
function lastSerial(directorate: string, industry: string, knownNumbers: string[]): number {
  let max = 0;
  for (const ein of [...getEinRegistry().map((e) => e.ein), ...knownNumbers]) {
    const p = parseEin(ein);
    if (p && p.directorate === directorate && p.industry === industry) max = Math.max(max, p.serial);
  }
  return max;
}

/** The number that would be issued next (shown to the officer before approving). */
export function previewNextEin(directorate: string, industry: string, knownNumbers: string[] = []): string {
  return formatEin({ directorate, industry, serial: lastSerial(directorate, industry, knownNumbers) + 1 });
}

/**
 * Issue the EIN for an establishment. Returns the existing number if the account already has one,
 * so an establishment can never receive a second number.
 */
export function issueEin(accountId: string, directorate: string, industry: string, knownNumbers: string[] = []): string {
  const registry = getEinRegistry();
  const existing = registry.find((e) => e.accountId === accountId);
  if (existing) return existing.ein;
  if (!findDirectorateByCode(directorate)) throw new Error('Unknown Directorate code ' + directorate);
  if (!findIndustry(industry)) throw new Error('Unknown Industry Classification code ' + industry);
  const ein = previewNextEin(directorate, industry, knownNumbers);
  registry.push({ ein, accountId, issuedAt: nowStamp() });
  writeJson(STORAGE_KEYS.einRegistry, registry);
  return ein;
}

/** Record numbers that exist already (seed data) so they are never issued again. */
export function reserveEins(entries: { ein: string; accountId: string }[]): void {
  const registry = getEinRegistry();
  let changed = false;
  for (const e of entries) {
    if (e.ein && !registry.some((r) => r.ein === e.ein)) {
      registry.push({ ein: e.ein, accountId: e.accountId, issuedAt: 'existing' });
      changed = true;
    }
  }
  if (changed) writeJson(STORAGE_KEYS.einRegistry, registry);
}
