/** Employer accounts / registration applications. */
import { hashPassword } from '@/utils/hash';
import { digitsOnly } from '@/utils/format';
import { DEMO_PASSWORD } from './constants';
import { reserveEins } from './employerNumber';
import { ensureSchema, readJson, STORAGE_KEYS, writeJson } from './storage';
import type { Account, ApplicationStatus } from './types';

/**
 * Demo data present on first load: one pending application and two approved employers.
 * Employer Nos. follow the EIN structure DDD-II-NNNNNN (see employerNumber.ts).
 */
const SEED_ACCOUNTS: Account[] = [
  {
    id: 'seedp1', status: 'pending', appNo: 'REG-2026-10001', submitted: '18 Nov 2026 10:20', employerNo: '', industry: '28', directorateCode: '104', variant: 'data', ph: hashPassword(DEMO_PASSWORD),
    cnic: '42301-7788991-3', mobile: '0345-7788991', email: 'office@karachisteel.example', dir: 'SITE West Directorate',
    co: { employer: 'Karachi Steel Works', btype: 'Private Limited Company', secp: '0789012', ntn: '3344556-7', srb: 'SRB-000912', addr: 'Plot 9, SITE Area, Karachi', province: 'Sindh', district: 'Karachi West', gps: '24.9056° N, 66.9889° E', person: 'Omar Farooq', desig: 'Director', mobile: '0345-7788991', email: 'office@karachisteel.example', phone: '021-32550000', industry: 'Steel Industry' },
    docs: 10, workers: '120',
  },
  {
    id: 'abc', employerNo: '101-10-000001', industry: '10', directorateCode: '101', variant: 'data', ph: hashPassword(DEMO_PASSWORD), cnic: '42101-9876543-1', mobile: '0300-1234567', email: 'accounts@abcmanufacturing.example', dir: 'Landhi Directorate',
    co: { employer: 'ABC Manufacturing', btype: 'Private Limited Company', secp: '0123456', ntn: '1234567-8', srb: 'SRB-000123', addr: 'Plot 25, Sector 12-B, Landhi Industrial Area, Karachi', province: 'Sindh', district: 'Karachi', gps: '24.8441° N, 67.2038° E', person: 'Ali Hassan', desig: 'Accounts Manager', mobile: '0300-1234567', email: 'accounts@abcmanufacturing.example', phone: '021-35000000', industry: 'Engineering' },
  },
  {
    id: 'sunrise', employerNo: '102-96-000001', industry: '96', directorateCode: '102', variant: 'empty', ph: hashPassword(DEMO_PASSWORD), cnic: '42201-5551234-5', mobile: '0321-5551234', email: 'info@sunrisetraders.example', dir: 'City Directorate',
    co: { employer: 'Sunrise Traders', btype: 'Sole Proprietorship', secp: '0456789', ntn: '7654321-0', srb: 'SRB-000456', addr: 'Shop 4, Saddar Commercial Area, Karachi', province: 'Sindh', district: 'Karachi South', gps: '24.8607° N, 67.0011° E', person: 'Sara Khan', desig: 'Owner', mobile: '0321-5551234', email: 'info@sunrisetraders.example', phone: '021-32000000', industry: 'Wholesale Trade' },
  },
];

/** All accounts (seeds are added on first use). */
export function getAccounts(): Account[] {
  ensureSchema();
  const list = readJson<Account[]>(STORAGE_KEYS.accounts, []);
  SEED_ACCOUNTS.forEach((s) => {
    if (!list.some((a) => a.id === s.id)) list.push(s);
  });
  writeJson(STORAGE_KEYS.accounts, list);
  reserveEins(list.filter((a) => a.employerNo).map((a) => ({ ein: a.employerNo, accountId: a.id })));
  return list;
}

export function saveAccounts(list: Account[]): void {
  writeJson(STORAGE_KEYS.accounts, list);
}

export function getAccountById(id: string | null | undefined): Account | null {
  if (!id) return null;
  return getAccounts().find((a) => a.id === id) || null;
}

/** Find an account by Employer No., email, CNIC (13 digits) or mobile (10-11 digits). */
export function findAccountByLoginId(loginId: string): Account | null {
  const idv = String(loginId || '').trim().toLowerCase();
  if (!idv) return null;
  const d = digitsOnly(idv);
  return (
    getAccounts().find(
      (a) =>
        (a.employerNo && a.employerNo.toLowerCase() === idv) ||
        String(a.email).toLowerCase() === idv ||
        (d.length === 13 && digitsOnly(a.cnic) === d) ||
        (d.length >= 10 && d.length <= 11 && digitsOnly(a.mobile) === d),
    ) || null
  );
}

/** Status of an account; seeded employers without a status are approved. */
export function getStatus(a: Account): ApplicationStatus {
  return a.status || 'approved';
}
