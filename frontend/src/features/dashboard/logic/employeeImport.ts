/**
 * Bulk employee import: turns rows from a CSV file, an Excel sheet or pasted API (JSON) data into
 * validated employee records. Validation follows the manual registration form.
 */
import type { EmployeeInput } from '@/services/api/types';

export type RawRow = Record<string, unknown>;

export interface ParsedRow {
  /** 1-based position in the file (header excluded) */
  line: number;
  name: string;
  cnic: string;
  designation: string;
  input: EmployeeInput | null;
  errors: string[];
}

const GENDERS = ['MALE', 'FEMALE', 'TRANSGENDER'];
const EMPLOYMENT_TYPES = ['Permanent', 'Contractual', 'Daily Wages', 'Piece Rated', 'Others'];
const SKILL_LEVELS = ['Unskilled', 'Semi-Skilled', 'Skilled', 'Highly Skilled'];
const WAGE_TYPES = ['Monthly', 'Daily', 'Piece Rate'];
const FREQUENCIES = ['Monthly', 'Weekly', 'Daily'];

/** Accepted column names (lower-case letters and digits only) -> field. */
const ALIASES: Record<string, string> = {
  cnic: 'cnic', cnicno: 'cnic', cnicnumber: 'cnic',
  name: 'full_name', fullname: 'full_name', employeename: 'full_name',
  fathername: 'father_name', fathersname: 'father_name',
  dateofbirth: 'date_of_birth', dob: 'date_of_birth',
  gender: 'gender',
  dateofjoining: 'date_joined', joiningdate: 'date_joined', datejoined: 'date_joined', doj: 'date_joined',
  designation: 'designation',
  employmenttype: 'employment_type', type: 'employment_type',
  skilllevel: 'skill_level', skill: 'skill_level',
  wagetype: 'wage_type',
  paymentfrequency: 'payment_frequency',
  monthlywages: 'monthly_wage', monthlywage: 'monthly_wage', wages: 'monthly_wage', wage: 'monthly_wage', salary: 'monthly_wage',
  bankaccount: 'bank_account', bankaccountnumber: 'bank_account', accountnumber: 'bank_account',
  mobile: 'mobile', mobileno: 'mobile', mobilenumber: 'mobile', phone: 'mobile',
};

/** Column headings of the downloadable template. */
export const TEMPLATE_COLUMNS = ['Full Name', 'Father’s Name', 'Gender', 'CNIC No.', 'Date of Birth', 'Mobile No.', 'Designation', 'Skill Level', 'Employment Type', 'Wage Type', 'Payment Frequency', 'Date of Joining', 'Monthly Wages', 'Bank Account'];

/** Demo employees used by "Try with sample data" and the downloadable templates (same order as TEMPLATE_COLUMNS). */
export const SAMPLE_ROWS: string[][] = [
  ['Zainab Ahmed', 'Ahmed Khan', 'FEMALE', '42101-5550001-1', '14/06/1992', '0300-5550001', 'Accounts Clerk', 'Skilled', 'Permanent', 'Monthly', 'Monthly', '01/03/2024', '45000', '0001-5550001'],
  ['Hamza Siddiqui', 'Siddique Ali', 'MALE', '42201-5550002-3', '02/11/1989', '0321-5550002', 'Machine Operator', 'Semi-Skilled', 'Contractual', 'Monthly', 'Monthly', '15/04/2024', '38000', '0001-5550002'],
  ['Naeem Baloch', 'Gul Baloch', 'MALE', '42301-5550003-5', '23/01/1995', '0333-5550003', 'Helper', 'Unskilled', 'Daily Wages', 'Daily', 'Daily', '10/05/2024', '37000', '0001-5550003'],
];

export function sampleCsv(): string {
  return [TEMPLATE_COLUMNS, ...SAMPLE_ROWS].map((r) => r.map((c) => (/[",\n]/.test(c) ? '"' + c.replace(/"/g, '""') + '"' : c)).join(',')).join('\n') + '\n';
}

export function sampleJson(): string {
  const keys = ['full_name', 'father_name', 'gender', 'cnic', 'date_of_birth', 'mobile', 'designation', 'skill_level', 'employment_type', 'wage_type', 'payment_frequency', 'date_joined', 'monthly_wage', 'bank_account'];
  return JSON.stringify({ employees: SAMPLE_ROWS.map((r) => Object.fromEntries(keys.map((k, i) => [k, k === 'monthly_wage' ? Number(r[i]) : r[i]]))) }, null, 2);
}

/** Parse CSV text into rows of cells (quotes, escaped quotes, CRLF and a BOM are handled). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  const src = text.replace(/^﻿/, '');
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && src[i + 1] === '\n') i++;
      row.push(cell);
      cell = '';
      rows.push(row);
      row = [];
    } else cell += ch;
  }
  if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ''));
}

/** Header + cell rows (from CSV or Excel) -> keyed rows. */
export function tableToRows(table: unknown[][]): RawRow[] {
  if (!table.length) return [];
  const header = table[0].map((h) => String(h ?? ''));
  return table.slice(1).filter((r) => r.some((c) => String(c ?? '').trim() !== '')).map((r) => Object.fromEntries(header.map((h, i) => [h, r[i]])));
}

/** Pasted API data: a JSON array of employees, or an object with an "employees" array. */
export function jsonToRows(text: string): RawRow[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error('That is not valid JSON. Paste an array of employees or an object with an "employees" array.');
  }
  const list = Array.isArray(data) ? data : data && typeof data === 'object' && Array.isArray((data as { employees?: unknown }).employees) ? (data as { employees: unknown[] }).employees : null;
  if (!list) throw new Error('Expected a JSON array of employees or an object with an "employees" array.');
  if (list.some((x) => !x || typeof x !== 'object' || Array.isArray(x))) throw new Error('Every employee must be a JSON object, for example { "cnic": "…", "full_name": "…" }.');
  return list as RawRow[];
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Date cell (Excel date, DD/MM/YYYY or YYYY-MM-DD) -> "YYYY-MM-DD"; null when empty. */
function toIso(value: unknown): string | null | 'invalid' {
  if (value instanceof Date) return isNaN(value.getTime()) ? 'invalid' : `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  const v = String(value ?? '').trim();
  if (!v) return null;
  let y: number, m: number, d: number;
  const dmy = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(v);
  const ymd = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(v);
  if (dmy) [d, m, y] = [+dmy[1], +dmy[2], +dmy[3]];
  else if (ymd) [y, m, d] = [+ymd[1], +ymd[2], +ymd[3]];
  else return 'invalid';
  const t = new Date(y, m - 1, d);
  return t.getMonth() === m - 1 && t.getDate() === d ? `${y}-${pad(m)}-${pad(d)}` : 'invalid';
}

const oneOf = (value: string, options: string[]) => options.find((o) => o.toLowerCase() === value.trim().toLowerCase());

/** Validate keyed rows. `existingCnics` are digits-only CNICs that are already registered. */
export function validateRows(raw: RawRow[], existingCnics: string[]): ParsedRow[] {
  const seen = new Set(existingCnics);
  return raw.map((r, idx) => {
    const f: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(r)) {
      const field = ALIASES[k.toLowerCase().replace(/[^a-z0-9]/g, '')];
      if (field) f[field] = v;
    }
    const text = (k: string) => (f[k] instanceof Date ? '' : String(f[k] ?? '').trim());
    const errors: string[] = [];
    const missing = (k: string, label: string) => {
      if (!text(k)) errors.push(label + ' is missing');
      return text(k);
    };

    const name = missing('full_name', 'Name');
    const father = missing('father_name', 'Father Name');
    const designation = missing('designation', 'Designation');
    const mobile = missing('mobile', 'Mobile Number');

    const digits = text('cnic').replace(/\D/g, '');
    let cnic = text('cnic');
    if (!cnic) errors.push('CNIC is missing');
    else if (digits.length !== 13) errors.push('CNIC must have 13 digits');
    else {
      cnic = digits.slice(0, 5) + '-' + digits.slice(5, 12) + '-' + digits.slice(12);
      if (seen.has(digits)) errors.push('CNIC is already registered' + (existingCnics.includes(digits) ? '' : ' (repeated in this file)'));
      else seen.add(digits);
    }

    const gender = oneOf(text('gender'), GENDERS);
    if (!text('gender')) errors.push('Gender is missing');
    else if (!gender) errors.push('Gender must be MALE, FEMALE or TRANSGENDER');

    const type = oneOf(text('employment_type'), EMPLOYMENT_TYPES);
    if (!text('employment_type')) errors.push('Employment Type is missing');
    else if (!type) errors.push('Employment Type must be one of: ' + EMPLOYMENT_TYPES.join(', '));

    const optional = (k: string, label: string, options: string[]): string | null => {
      if (!text(k)) return null;
      const hit = oneOf(text(k), options);
      if (!hit) errors.push(label + ' must be one of: ' + options.join(', '));
      return hit ?? null;
    };
    const skill = optional('skill_level', 'Skill Level', SKILL_LEVELS);
    const wageType = optional('wage_type', 'Wage Type', WAGE_TYPES);
    const frequency = optional('payment_frequency', 'Payment Frequency', FREQUENCIES);

    const dob = toIso(f.date_of_birth);
    const joined = toIso(f.date_joined);
    if (dob === 'invalid') errors.push('Date of Birth must be DD/MM/YYYY');
    if (joined === 'invalid') errors.push('Date of Joining must be DD/MM/YYYY');

    const wageText = String(f.monthly_wage ?? '').replace(/[,\s]/g, '');
    if (wageText && !/^\d+$/.test(wageText)) errors.push('Monthly Wages must be a whole number');

    const input: EmployeeInput | null = errors.length
      ? null
      : {
          full_name: name, father_name: father, gender: gender!, cnic, date_of_birth: dob === 'invalid' ? null : dob, mobile, designation, skill_level: skill, employment_type: type!,
          wage_type: wageType, payment_frequency: frequency, date_joined: joined === 'invalid' ? null : joined, monthly_wage: wageText ? Number(wageText) : null, bank_account: text('bank_account') || null, photo: null,
        };
    return { line: idx + 1, name, cnic: cnic || text('cnic'), designation, input, errors };
  });
}
