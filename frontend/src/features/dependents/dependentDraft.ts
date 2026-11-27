/** Dependents as edited on screen (dates as DD/MM/YYYY), and conversion to / from the API shape. */
import type { Dependent, DependentInput, DependentSource } from '@/services/api/types';

export interface DependentDraft {
  /** stable React key */
  key: string;
  /** saved record id (undefined for a new row) */
  id?: number;
  name: string;
  relation: string;
  cnic: string;
  /** DD/MM/YYYY */
  dob: string;
  gender: string;
  photo?: string;
  source: DependentSource;
  /** family-member number (worker number + /01 …), shown once the row is saved */
  workerNo?: string;
  /** fields the FRC scan could not read; highlighted until the user fills them in */
  missing?: ('name' | 'relation' | 'cnic' | 'dob')[];
}

/** relationships offered in the dropdown; anything else is typed in with "Other" */
export const RELATIONS = ['Spouse', 'Wife', 'Husband', 'Son', 'Daughter', 'Father', 'Mother', 'Brother', 'Sister', 'Grandson', 'Granddaughter', 'Adopted Son', 'Adopted Daughter', 'Other'];

let seq = 0;
export const newKey = () => 'd' + Date.now().toString(36) + (seq++).toString(36);

export const emptyDraft = (): DependentDraft => ({ key: newKey(), name: '', relation: '', cnic: '', dob: '', gender: '', source: 'Manual' });

const isoToSlash = (v: string | null) => (v ? v.split('-').reverse().join('/') : '');

/** "DD/MM/YYYY" -> "YYYY-MM-DD"; null when empty, 'invalid' when it is not a real date. */
export function slashToIso(value: string): string | null | 'invalid' {
  const v = value.trim();
  if (!v) return null;
  const m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(v);
  if (!m) return 'invalid';
  const d = new Date(+m[3], +m[2] - 1, +m[1]);
  if (d.getMonth() !== +m[2] - 1 || d.getTime() > Date.now()) return 'invalid';
  return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}

/** Gender implied by a relationship word (used to pre-fill the gender of scanned dependents). */
export function genderOf(relation: string): string {
  const r = relation.toLowerCase();
  if (/\b(son|brother|father|husband|grandson)\b/.test(r)) return 'MALE';
  if (/\b(daughter|sister|mother|wife|granddaughter)\b/.test(r)) return 'FEMALE';
  return '';
}

export const toDraft = (d: Dependent): DependentDraft => ({
  key: 'saved-' + d.id, id: d.id, name: d.name, relation: d.relation, cnic: d.cnic || '', dob: isoToSlash(d.date_of_birth), gender: d.gender || '',
  photo: d.photo || undefined, source: d.source, workerNo: d.worker_no || undefined,
});

/** Check the rows and turn them into the API shape, or return an error message for the user. */
export function draftsToInput(rows: DependentDraft[]): DependentInput[] | string {
  const out: DependentInput[] = [];
  for (const [i, r] of rows.entries()) {
    const who = r.name.trim() || `row ${i + 1}`;
    if (!r.name.trim()) return `Dependent ${i + 1}: enter the name (or remove the row).`;
    if (!r.relation.trim()) return `Dependent “${who}”: choose the relationship.`;
    const dob = slashToIso(r.dob);
    if (dob === 'invalid') return `Dependent “${who}”: enter the date of birth as DD/MM/YYYY, for example 15/02/2016.`;
    const cnic = r.cnic.trim();
    if (cnic && cnic !== '—' && /^[\d\s-]+$/.test(cnic) && cnic.replace(/\D/g, '').length !== 13) return `Dependent “${who}”: a CNIC / B-Form number has 13 digits.`;
    out.push({
      id: r.id ?? null, name: r.name.trim(), relation: r.relation.trim(), cnic: cnic && cnic !== '—' ? cnic : null, date_of_birth: dob,
      gender: r.gender || null, photo: r.photo || null, source: r.source,
    });
  }
  return out;
}

/** "4210112345671" -> "42101-1234567-1" while typing (leaves other text, e.g. "B-Form …", alone). */
export function formatCnicInput(value: string): string {
  if (!/^[\d-]*$/.test(value)) return value;
  const d = value.replace(/\D/g, '').slice(0, 13);
  return d.length > 12 ? `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}` : d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d;
}
