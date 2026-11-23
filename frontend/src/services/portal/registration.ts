/** Registration submission and admin decisions on applications. */
import { digitsOnly, nowStamp } from '@/utils/format';
import { hashPassword } from '@/utils/hash';
import { getAccounts, saveAccounts } from './accounts';
import { REVIEW_STAGES } from './constants';
import { issueEin, previewNextEin } from './employerNumber';
import { directorateForDistrict, findIndustry } from './masterData';
import { sendMessage } from './outbox';
import { readJson, removeKey, STORAGE_KEYS, writeJson } from './storage';
import { addTrackEvent } from './tracking';
import type { Account, RegistrationForm } from './types';

/** Save a submitted registration as a pending application and notify the applicant. */
export function submitRegistration(f: RegistrationForm): Account {
  let list = getAccounts();
  const s = (k: string) => (f[k] == null ? '' : String(f[k]));
  const cd = digitsOnly(f.ac);
  const dist = s('dist') || 'Karachi';
  const directorate = directorateForDistrict(dist);
  const industry = findIndustry(s('ind'));
  const appNo = 'REG-2026-' + String(10000 + list.filter((a) => a.appNo).length + 1 + Math.floor(Math.random() * 80000));
  const acc: Account = {
    id: 'r' + cd, status: 'pending', stage: 1, track: [{ s: 'submitted', t: nowStamp(), n: 'Application ' + appNo + ' received.' }], appNo, submitted: nowStamp(),
    employerNo: '', industry: industry?.code || '99', directorateCode: directorate?.code || '', variant: 'data', ph: hashPassword(s('ap')), cnic: cd.slice(0, 5) + '-' + cd.slice(5, 12) + '-' + cd.slice(12), mobile: s('am'), email: s('ae').trim(),
    dir: directorate?.name || 'City Directorate', workers: s('wk'), docs: 10,
    co: { employer: s('en') || 'My Company', btype: s('bt'), secp: s('secp'), ntn: s('ntn'), srb: s('srb'), addr: s('ba'), province: 'Sindh', district: dist, gps: s('gps'), person: s('pn') || s('an'), desig: s('pd'), mobile: s('pm') || s('am'), email: s('pe') || s('ae'), phone: s('ph'), industry: industry?.name || '' },
  };
  list = list.filter((a) => a.id !== acc.id);
  list.push(acc);
  saveAccounts(list);
  removeKey(STORAGE_KEYS.session);
  writeJson(STORAGE_KEYS.lastApplication, acc.id);
  sendMessage(acc, 'Application received', 'ESSI Sindh: Dear ' + (s('an') || 'applicant') + ', your employer registration for ' + acc.co.employer + ' was received. Application No. ' + appNo + '. You will be notified after verification.');
  return acc;
}

/** Id of the application submitted last on this device (for the "submitted" page). */
export function getLastApplicationId(): string | null {
  return readJson<string | null>(STORAGE_KEYS.lastApplication, null);
}

/** Admin: mark review stage 2 (documents) or 3 (inspection) as done. */
export function postProgressUpdate(id: string, stage: number, note: string): Account | null {
  const list = getAccounts();
  const a = list.find((x) => x.id === id);
  if (!a) return null;
  a.stage = Math.max(a.stage || 1, stage);
  addTrackEvent(a, stage === 2 ? 'docs' : 'inspect', note || (stage === 2 ? 'Your documents have been verified.' : 'Directorate review has been completed.'));
  saveAccounts(list);
  sendMessage(a, 'Application update', 'ESSI Sindh: Application ' + a.appNo + ' — ' + REVIEW_STAGES[stage - 1][0] + ' completed.' + (note ? ' ' + note + '.' : '') + ' You can track your application any time from the login page.');
  return a;
}

/** Directorate + Industry codes of an application (falls back to the district / "Other"). */
function einCodes(a: Account): [string, string] {
  return [a.directorateCode || directorateForDistrict(a.co.district)?.code || '102', a.industry || '99'];
}

/** Employer No. the application will receive when approved (shown to the officer). */
export function expectedEmployerNo(a: Account): string {
  if (a.employerNo) return a.employerNo;
  const [dir, ind] = einCodes(a);
  return previewNextEin(dir, ind, getAccounts().map((x) => x.employerNo));
}

/** Admin: approve an application and issue its permanent Employer Identification Number. */
export function approveApplication(id: string): Account | null {
  const list = getAccounts();
  const a = list.find((x) => x.id === id);
  if (!a) return null;
  const [dir, ind] = einCodes(a);
  const no = issueEin(a.id, dir, ind, list.map((x) => x.employerNo));
  addTrackEvent(a, 'final', 'Approved. Employer No. ' + no + ' assigned.');
  a.status = 'approved';
  a.stage = 4;
  a.employerNo = no;
  a.approved = nowStamp();
  saveAccounts(list);
  sendMessage(a, 'Registration approved', 'ESSI Sindh: Congratulations! ' + a.co.employer + ' is approved. Your Employer No. is ' + no + '. Log in at the Employer Portal with your Employer No. (or CNIC / email) and the password you created at registration.');
  return a;
}

/** Admin: reject an application with a reason. */
export function rejectApplication(id: string, reason: string): Account | null {
  const list = getAccounts();
  const a = list.find((x) => x.id === id);
  if (!a) return null;
  addTrackEvent(a, 'rejected', reason);
  a.status = 'rejected';
  a.rejectedAt = nowStamp();
  a.reason = reason;
  saveAccounts(list);
  sendMessage(a, 'Registration needs correction', 'ESSI Sindh: Your application ' + a.appNo + ' could not be approved. Reason: ' + a.reason + '. Please register again with corrected details.');
  return a;
}

/** Employer: set a new password after the reset code was confirmed. */
export function changePassword(id: string, newPassword: string): void {
  const list = getAccounts();
  list.forEach((a) => {
    if (a.id === id) a.ph = hashPassword(newPassword);
  });
  saveAccounts(list);
}
