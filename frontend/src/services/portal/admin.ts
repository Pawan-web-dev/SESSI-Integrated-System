/**
 * Admin workspace data (demo): company change requests and the challan register.
 * Change requests are the ones employers submit from their dashboard (stored per employer under
 * "essi:changes:<account id>"); approving one updates that employer's company profile.
 */
import { nowStamp } from '@/utils/format';
import { getAccounts, getStatus } from './accounts';
import { sendMessage } from './outbox';
import { readJson, writeJson } from './storage';
import type { Account } from './types';

/* ---------- company documents ---------- */

/** The ten registration documents: [key, label, required]. */
export const COMPANY_DOCUMENTS: [string, string, boolean][] = [
  ['secp', 'SECP Certificate', true], ['ntn', 'NTN', true], ['srb', 'SRB Registration', true], ['elec', 'Electricity Bill', true], ['gas', 'Gas Bill', false],
  ['deed', 'Partnership Deed', false], ['cnic', 'Proprietor/Employer CNIC', true], ['bank', 'Bank Details', true], ['logo', 'Company Logo', false], ['contact', 'Contact Numbers & Email Address', true],
];

/* ---------- change requests ---------- */

export type ChangeRequestStatus = 'Pending Review' | 'Under Review' | 'Approved' | 'Rejected';

export interface ChangeRequestEvent {
  t: string;
  text: string;
  who: string;
}

/** A change request as the employer dashboard stores it. */
export interface StoredChangeRequest {
  id: string;
  ref: string;
  /** Company field that is changed (employer, addr, mobile ...) */
  key: string;
  label: string;
  oldVal: string;
  newVal: string;
  reason: string;
  doc: string;
  status: ChangeRequestStatus;
  submitted: string;
  by: string;
  remarks: string;
  events: ChangeRequestEvent[];
}

/** A stored request together with the company it belongs to. */
export interface AdminChangeRequest extends StoredChangeRequest {
  companyId: string;
  company: string;
}

const crKey = (accountId: string) => 'essi:changes:' + accountId;
const coKey = (accountId: string) => 'essi:company:' + accountId;

export function isChangeRequestOpen(r: { status: ChangeRequestStatus }): boolean {
  return r.status === 'Pending Review' || r.status === 'Under Review';
}

/** Every change request of every employer. */
export function getChangeRequests(): AdminChangeRequest[] {
  return getAccounts().flatMap((a) => readJson<StoredChangeRequest[]>(crKey(a.id), []).map((r) => ({ ...r, companyId: a.id, company: a.co.employer })));
}

/** Approve or reject an open request. Approval writes the new value into the company profile. */
export function decideChangeRequest(companyId: string, id: string, decision: 'Approved' | 'Rejected', remarks = ''): AdminChangeRequest | null {
  const list = readJson<StoredChangeRequest[]>(crKey(companyId), []);
  const r = list.find((x) => x.id === id);
  const account = getAccounts().find((a) => a.id === companyId);
  if (!r || !account || !isChangeRequestOpen(r)) return null;
  r.status = decision;
  r.events = [...(r.events || []), { t: nowStamp(), who: 'ESSI', text: decision === 'Approved' ? 'Approved by ESSI officer. Company profile updated.' : 'Rejected by ESSI officer' + (remarks ? ': ' + remarks : '') }];
  if (decision === 'Rejected') r.remarks = remarks;
  writeJson(crKey(companyId), list);
  if (decision === 'Approved') {
    const profile = readJson<Record<string, string>>(coKey(companyId), {});
    profile[r.key] = r.newVal;
    writeJson(coKey(companyId), profile);
  }
  sendMessage(account, 'Change request ' + decision.toLowerCase(), 'ESSI Sindh: Your change request ' + r.ref + ' (' + r.label + ') was ' + decision.toLowerCase() + '.' + (remarks ? ' ' + remarks : ''));
  return { ...r, companyId, company: account.co.employer };
}

/* ---------- challan register ---------- */

export const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] as const;
export type ChallanStatus = 'Paid' | 'Unpaid' | 'Not generated';

export interface Challan {
  id: string;
  companyId: string;
  company: string;
  employerNo: string;
  /** contribution month 1-12 and year */
  month: number;
  year: number;
  workers: number;
  wages: number;
  amount: number;
  /** due date as YYYY-MM-DD */
  dueDate: string;
  status: ChallanStatus;
}

/** Current contribution month of the demo. */
export const CURRENT_PERIOD = { month: 10, year: 2026 };

/** Demo base figures per seeded employer: [account id, workers in October, serial]. */
const DEMO_BASE: [string, number, number][] = [['abc', 42, 0], ['sunrise', 18, 1], ['seedp1', 65, 2]];
const DEMO_OCTOBER_UNPAID = ['abc', 'seedp1'];
const WAGE_PER_WORKER = 37000;
const RATE = 0.02;

function dueDateFor(month: number, year: number): string {
  const m = month === 12 ? 1 : month + 1;
  const y = month === 12 ? year + 1 : year;
  return y + '-' + String(m).padStart(2, '0') + '-15';
}

/** Demo challans, built deterministically. No real contribution rules are applied. */
export function getChallans(): Challan[] {
  const accounts = getAccounts();
  const out: Challan[] = [];
  for (const [id, baseWorkers, serial] of DEMO_BASE) {
    const a: Account | undefined = accounts.find((x) => x.id === id);
    if (!a) continue;
    for (let month = 1; month <= CURRENT_PERIOD.month; month++) {
      const mi = month - 1;
      const workers = month === CURRENT_PERIOD.month ? baseWorkers : baseWorkers + ((mi * 5 + serial * serial * 2 + mi * mi) % 11) - 5;
      const wages = workers * WAGE_PER_WORKER;
      const unpaid = month === CURRENT_PERIOD.month && DEMO_OCTOBER_UNPAID.includes(id);
      out.push({
        id: 'CH-' + CURRENT_PERIOD.year + '-' + String(month).padStart(2, '0') + '-' + String(serial + 1).padStart(4, '0'), companyId: id, company: a.co.employer, employerNo: a.employerNo,
        month, year: CURRENT_PERIOD.year, workers, wages, amount: Math.round(wages * RATE), dueDate: dueDateFor(month, CURRENT_PERIOD.year), status: unpaid ? 'Unpaid' : 'Paid',
      });
    }
  }
  // employers approved after the demo data was created have no challan yet
  for (const a of accounts) {
    if (getStatus(a) === 'approved' && !DEMO_BASE.some((d) => d[0] === a.id)) {
      out.push({
        id: 'Not generated', companyId: a.id, company: a.co.employer, employerNo: a.employerNo, month: CURRENT_PERIOD.month, year: CURRENT_PERIOD.year, workers: 0, wages: 0, amount: 0,
        dueDate: dueDateFor(CURRENT_PERIOD.month, CURRENT_PERIOD.year), status: 'Not generated',
      });
    }
  }
  return out;
}

export function formatMoney(n: number): string {
  return 'Rs. ' + Number(n || 0).toLocaleString('en-PK');
}

/** "15 Nov 2026" from "2026-11-15". */
export function formatDueDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  return d + ' ' + MONTH_NAMES[m - 1].slice(0, 3) + ' ' + y;
}
